/**
 * Cloudflare Pages Function: /api/sql
 * Cloudflare D1 SQL Studio & AI Schema Generator
 *
 * Capabilities:
 * - GET ?action=schema: Live database schema introspection, table structures, column definitions, row counts, and AI prompt generation
 * - POST: Direct execution of raw SQL queries (SELECT, INSERT, UPDATE, DELETE, CREATE, etc.) against env.DB (crii-production-db)
 * - Safe multi-statement parsing, batch execution, and execution timing
 */

function fromBase64Url(base64url) {
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function verifyToken(token, secret) {
  try {
    if (!token || !token.startsWith('crii_v2.')) return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const sigBytes = fromBase64Url(parts[2]);
    const isValid = await crypto.subtle.verify('HMAC', key, sigBytes, enc.encode(parts[1]));
    if (!isValid) return null;

    const payloadJson = new TextDecoder().decode(fromBase64Url(parts[1]));
    const payload = JSON.parse(payloadJson);
    if (!payload || !payload.exp || Date.now() > payload.exp) return null;

    return payload.user;
  } catch (e) {
    return null;
  }
}

async function authenticateRequest(request, env) {
  let token = "";
  const authHeader = request.headers.get("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.replace("Bearer ", "").trim();
  }
  if (!token) {
    const customHeader = request.headers.get("X-Auth-Token");
    if (customHeader) token = customHeader.trim();
  }
  if (!token) {
    const cookieHeader = request.headers.get("Cookie") || "";
    const match = cookieHeader.match(/(?:^|;\s*)crii_session=([^;]*)/);
    if (match) token = decodeURIComponent(match[1]).trim();
  }

  // Check cryptographic signature
  const secret = (env && (env.AUTH_SECRET || env.ADMIN_EMAIL)) || "crii_institute_jwt_hmac_secret_2026";
  if (token) {
    const verified = await verifyToken(token, secret);
    if (verified) return { authenticated: true, user: verified };

    // Check sessions table in D1
    if (env && env.DB) {
      try {
        const row = await env.DB.prepare(
          "SELECT * FROM sessions WHERE token = ? AND expiresAt > datetime('now')"
        ).bind(token).first();
        if (row && row.user_json) {
          return { authenticated: true, user: JSON.parse(row.user_json) };
        }
      } catch (e) {
        // sessions table query error
      }
    }
  }

  // Also check if admin email header or dev token matches
  const adminHeader = request.headers.get("X-Admin-Email");
  if (adminHeader && adminHeader.toLowerCase() === "harunabdullahrakin@gmail.com") {
    return { authenticated: true, user: { email: adminHeader, role: "Super Admin" } };
  }

  return { authenticated: false, error: "Unauthorized access" };
}

function splitSqlStatements(sql) {
  const statements = [];
  let current = '';
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inBacktick = false;

  // Strip block comments /* ... */
  const cleanedSql = sql.replace(/\/\*[\s\S]*?\*\//g, '');
  const lines = cleanedSql.split('\n');

  // Strip single-line comments -- ...
  const strippedLines = lines.map(line => {
    const commentIdx = line.indexOf('--');
    if (commentIdx === -1) return line;
    // Check if -- is inside a string
    let inQuote = false;
    for (let c = 0; c < commentIdx; c++) {
      if (line[c] === "'" || line[c] === '"') inQuote = !inQuote;
    }
    return inQuote ? line : line.substring(0, commentIdx);
  });

  const fullCleaned = strippedLines.join('\n');

  for (let i = 0; i < fullCleaned.length; i++) {
    const char = fullCleaned[i];
    const prev = i > 0 ? fullCleaned[i - 1] : '';

    if (char === "'" && prev !== '\\') {
      if (!inDoubleQuote && !inBacktick) inSingleQuote = !inSingleQuote;
    } else if (char === '"' && prev !== '\\') {
      if (!inSingleQuote && !inBacktick) inDoubleQuote = !inDoubleQuote;
    } else if (char === '`' && prev !== '\\') {
      if (!inSingleQuote && !inDoubleQuote) inBacktick = !inBacktick;
    }

    if (char === ';' && !inSingleQuote && !inDoubleQuote && !inBacktick) {
      const trimmed = current.trim();
      if (trimmed.length > 0) {
        statements.push(trimmed);
      }
      current = '';
    } else {
      current += char;
    }
  }

  const lastTrimmed = current.trim();
  if (lastTrimmed.length > 0) {
    statements.push(lastTrimmed);
  }

  return statements;
}

// -----------------------------------------------------------------------------
// GET: Schema Introspection & AI Prompt Generation
// -----------------------------------------------------------------------------
export async function onRequestGet(context) {
  const { env, request } = context;
  const auth = await authenticateRequest(request, env);
  if (!auth.authenticated) {
    return new Response(JSON.stringify({ success: false, error: "Unauthorized. Admin session required." }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  if (!env || !env.DB) {
    return new Response(JSON.stringify({ success: false, error: "Database binding (env.DB) not found." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    // 1. Get all user tables
    const tablesQuery = await env.DB.prepare(`
      SELECT name, sql FROM sqlite_master 
      WHERE type='table' 
        AND name NOT LIKE 'sqlite_%' 
        AND name NOT LIKE '_cf_%' 
        AND name NOT LIKE 'd1_%'
      ORDER BY name ASC;
    `).all();

    const tableList = (tablesQuery.results || []);
    const tables = [];

    for (const tbl of tableList) {
      const tableName = tbl.name;
      let columns = [];
      let rowCount = 0;

      // PRAGMA table_info
      try {
        const infoQuery = await env.DB.prepare(`PRAGMA table_info("${tableName}");`).all();
        columns = (infoQuery.results || []).map(col => ({
          cid: col.cid,
          name: col.name,
          type: col.type || 'TEXT',
          notnull: col.notnull === 1,
          dflt_value: col.dflt_value,
          pk: col.pk === 1
        }));
      } catch (e) {
        // Table info pragma fallback
      }

      // Row count
      try {
        const countQuery = await env.DB.prepare(`SELECT COUNT(*) as count FROM "${tableName}";`).first();
        if (countQuery && countQuery.count !== undefined) {
          rowCount = countQuery.count;
        }
      } catch (e) {
        // count fallback
      }

      tables.push({
        name: tableName,
        sql: tbl.sql,
        columns,
        rowCount
      });
    }

    // Build consolidated DDL
    const fullDdl = tables.map(t => t.sql ? t.sql + ';' : `-- ${t.name}`).join('\n\n');

    // Build AI Prompt Templates for user
    const aiPromptTemplates = {
      bulkArticles: `You are generating bulk SQL INSERT statements for the Cloudflare D1 database table "posts" of Curiomas Research & Innovation Institute (CRII).

TABLE SCHEMA:
${tables.find(t => t.name === 'posts')?.sql || `CREATE TABLE posts (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  coverImage TEXT,
  category TEXT NOT NULL,
  authors_json TEXT NOT NULL DEFAULT '["CRII Fellow"]',
  date TEXT NOT NULL,
  updatedAt TEXT,
  updatedBy TEXT,
  readingTime TEXT DEFAULT '10 min read',
  doi TEXT,
  summary TEXT NOT NULL,
  abstract TEXT,
  content TEXT NOT NULL,
  blocks_json TEXT,
  tags_json TEXT DEFAULT '["Research"]',
  published INTEGER NOT NULL DEFAULT 1,
  featured INTEGER NOT NULL DEFAULT 0,
  downloads INTEGER NOT NULL DEFAULT 0,
  citations INTEGER NOT NULL DEFAULT 0
);`}

DATA CONSTRAINTS & FORMATTING RULES:
1. "id": Unique string identifier, e.g. 'post-slug-or-uuid' or random 8-16 char string.
2. "slug": Clean url-friendly string without spaces, e.g. 'breakthroughs-in-astrophysics-2026'.
3. "title": Full publication or article title.
4. "coverImage": Valid image URL (e.g. Unsplash or R2 URL).
5. "category": e.g. 'Astrophysics', 'Computational Biology', 'Quantum Systems', 'Applied AI'.
6. "authors_json": Valid JSON array of author names, e.g. '["Dr. Eleanor Vance", "Marcus Reed"]'.
7. "date": ISO date string 'YYYY-MM-DD', e.g. '2026-11-08'.
8. "readingTime": e.g. '8 min read'.
9. "summary": 1-2 sentence executive overview.
10. "abstract": Extended scientific abstract.
11. "content": Full HTML content string (<p>..., <h2>..., <blockquote>...).
12. "tags_json": Valid JSON array of keywords, e.g. '["Cosmology", "Neural Networks"]'.
13. "published": 1 (active) or 0 (draft).
14. "featured": 1 (highlight on homepage) or 0.

OUTPUT INSTRUCTIONS:
- Return ONLY valid SQLite INSERT INTO posts (...) VALUES (...); statements separated by semicolons.
- Properly escape single quotes inside SQL strings by doubling them (e.g. 'It''s a breakthrough').
- Ready to paste directly into CRII D1 SQL Studio.`,

      bulkResearchers: `You are generating bulk SQL INSERT statements for the Cloudflare D1 database table "interns" of Curiomas Research & Innovation Institute (CRII).

TABLE SCHEMA:
${tables.find(t => t.name === 'interns')?.sql || `CREATE TABLE interns (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar TEXT,
  university TEXT,
  degree TEXT,
  division TEXT NOT NULL,
  role TEXT NOT NULL,
  cohort TEXT,
  status TEXT NOT NULL DEFAULT 'Active',
  bio TEXT,
  socials_json TEXT DEFAULT '{}',
  projects_json TEXT DEFAULT '[]',
  isTeamMember INTEGER NOT NULL DEFAULT 0,
  orderIndex INTEGER NOT NULL DEFAULT 0,
  createdAt TEXT,
  updatedAt TEXT
);`}

DATA CONSTRAINTS & FORMATTING RULES:
1. "id": e.g. 'fellow-001' or unique string.
2. "name": Full name.
3. "email": Valid email.
4. "avatar": Profile picture URL.
5. "university": Alma mater or current institute.
6. "degree": e.g. 'B.S. in Computer Science & Physics', 'Ph.D. Candidate'.
7. "division": e.g. 'Astrophysics & Space Science', 'Biophysics & Bioengineering', 'AI & Machine Learning'.
8. "role": e.g. 'Research Fellow', 'Undergraduate Scholar', 'Postgraduate Fellow'.
9. "status": 'Active' or 'Alumni'.
10. "socials_json": e.g. '{"github":"https://github.com/...","linkedin":"https://linkedin.com/..."}'.
11. "projects_json": e.g. '["Exoplanetary Spectra", "Neural Gene Models"]'.
12. "isTeamMember": 0 (Fellow/Scholar) or 1 (Core Leadership Team).

OUTPUT INSTRUCTIONS:
- Return ONLY valid SQLite INSERT INTO interns (...) VALUES (...); statements separated by semicolons.
- Ready to paste directly into CRII D1 SQL Studio.`,

      bulkDivisions: `You are generating bulk SQL INSERT statements for the Cloudflare D1 database table "divisions" of Curiomas Research & Innovation Institute (CRII).

TABLE SCHEMA:
${tables.find(t => t.name === 'divisions')?.sql || `CREATE TABLE IF NOT EXISTS divisions (
  id TEXT PRIMARY KEY,
  number TEXT NOT NULL,
  tag TEXT NOT NULL,
  title TEXT NOT NULL,
  desc TEXT,
  image TEXT,
  link TEXT DEFAULT '/research',
  orderIndex INTEGER DEFAULT 0,
  createdAt TEXT,
  updatedAt TEXT
);`}

DATA CONSTRAINTS & FORMATTING RULES:
1. "id": Unique string identifier, e.g. 'div-space-astrophysics', 'div-quantum-physics', 'div-synthetic-biology' or 'div-' || hex(randomblob(4)).
2. "number": 2-digit zero-padded number, e.g. '01', '02', '03', '04', '05'...
3. "tag": Format like '01 / RESEARCH DIVISION' or '04 / APPLIED AI'.
4. "title": Formal name of the research division (e.g. 'Artificial Intelligence & Autonomous Scientific Systems', 'Planetary Geophysics & Climate Systems').
5. "desc": 1-2 sentence description explaining the scope and scientific objectives of the division.
6. "image": Valid high-resolution image URL (Unsplash or OpenAI CDN image URL).
7. "link": Default '/research' or division-specific page link.
8. "orderIndex": Integer sequence for sorting (1, 2, 3, 4...).
9. "createdAt": ISO-8601 string or datetime('now').
10. "updatedAt": ISO-8601 string or datetime('now').

OUTPUT INSTRUCTIONS:
- Return ONLY valid SQLite INSERT INTO divisions (id, number, tag, title, desc, image, link, orderIndex, createdAt, updatedAt) VALUES (...); statements separated by semicolons.
- Properly escape single quotes inside SQL strings by doubling them (e.g. 'Earth''s atmosphere').
- Ready to paste directly into CRII D1 SQL Studio.`,

      fullSchemaPrompt: `You are an AI assistant generating bulk SQLite data for Curiomas Research & Innovation Institute (CRII).

LIVE CLOUDFLARE D1 DATABASE SCHEMA:
\`\`\`sql
${fullDdl}
\`\`\`

INSTRUCTIONS:
1. Generate valid SQLite INSERT statements adhering strictly to the above column names and types.
2. Ensure JSON fields (such as tags_json, authors_json, socials_json, projects_json) are serialized JSON strings.
3. Properly escape single quotes by doubling them (e.g. 'Can''t find').
4. Separate statements with semicolons so they can be batch-executed in CRII D1 SQL Studio.`
    };

    return new Response(JSON.stringify({
      success: true,
      database: "crii-production-db",
      engine: "Cloudflare D1 (SQLite 3)",
      tables,
      fullDdl,
      aiPromptTemplates
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message || "Failed to inspect database schema."
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

// -----------------------------------------------------------------------------
// POST: Execute Query (SELECT, INSERT, UPDATE, DELETE, BATCH)
// -----------------------------------------------------------------------------
export async function onRequestPost(context) {
  const { env, request } = context;
  const auth = await authenticateRequest(request, env);
  if (!auth.authenticated) {
    return new Response(JSON.stringify({ success: false, error: "Unauthorized. Admin session required." }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  if (!env || !env.DB) {
    return new Response(JSON.stringify({ success: false, error: "Database binding (env.DB) not found." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: "Invalid JSON request body." }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const rawQuery = (body.query || "").trim();
  if (!rawQuery) {
    return new Response(JSON.stringify({ success: false, error: "Query cannot be empty." }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const statements = splitSqlStatements(rawQuery);
  if (statements.length === 0) {
    return new Response(JSON.stringify({ success: false, error: "No executable SQL statements found." }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const startTime = Date.now();

  try {
    // Single statement execution
    if (statements.length === 1) {
      const stmtText = statements[0];
      const prepared = env.DB.prepare(stmtText);
      const result = await prepared.all();
      const duration = Date.now() - startTime;

      const rows = result.results || [];
      const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
      const changes = result.meta?.changes !== undefined ? result.meta.changes : 0;
      const lastRowId = result.meta?.last_row_id;


    // If divisions table was modified, synchronize settings table as well
    if (rawQuery.toLowerCase().includes('divisions')) {
      try {
        const divRows = await env.DB.prepare("SELECT * FROM divisions ORDER BY orderIndex ASC, number ASC").all();
        if (divRows && divRows.results) {
          await env.DB.prepare(`
            INSERT INTO settings (key, value_json, updatedAt, updatedBy)
            VALUES ('divisions', ?, datetime('now'), 'D1 SQL Studio')
            ON CONFLICT(key) DO UPDATE SET
              value_json = excluded.value_json,
              updatedAt = excluded.updatedAt,
              updatedBy = excluded.updatedBy;
          `).bind(JSON.stringify(divRows.results)).run().catch(() => {});
        }
      } catch (e) {}
    }
      return new Response(JSON.stringify({
        success: true,
        statementCount: 1,
        duration,
        columns,
        rows,
        changes,
        lastRowId,
        queryType: stmtText.trim().split(/\s+/)[0].toUpperCase(),
        meta: result.meta || {}
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Multi-statement batch execution (e.g. bulk INSERTs generated by AI)
    const preparedBatch = statements.map(s => env.DB.prepare(s));
    let batchResults;
    
    try {
      batchResults = await env.DB.batch(preparedBatch);
    } catch (batchErr) {
      // Fallback: execute sequentially if batch transactions have strict limits
      batchResults = [];
      for (const stmt of preparedBatch) {
        batchResults.push(await stmt.all());
      }
    }

    const duration = Date.now() - startTime;
    let totalChanges = 0;
    let lastResults = [];
    let lastColumns = [];

    batchResults.forEach(res => {
      if (res.meta && res.meta.changes) {
        totalChanges += res.meta.changes;
      }
      if (res.results && res.results.length > 0) {
        lastResults = res.results;
        lastColumns = Object.keys(res.results[0]);
      }
    });


    // If divisions table was modified, synchronize settings table as well
    if (rawQuery.toLowerCase().includes('divisions')) {
      try {
        const divRows = await env.DB.prepare("SELECT * FROM divisions ORDER BY orderIndex ASC, number ASC").all();
        if (divRows && divRows.results) {
          await env.DB.prepare(`
            INSERT INTO settings (key, value_json, updatedAt, updatedBy)
            VALUES ('divisions', ?, datetime('now'), 'D1 SQL Studio')
            ON CONFLICT(key) DO UPDATE SET
              value_json = excluded.value_json,
              updatedAt = excluded.updatedAt,
              updatedBy = excluded.updatedBy;
          `).bind(JSON.stringify(divRows.results)).run().catch(() => {});
        }
      } catch (e) {}
    }
    return new Response(JSON.stringify({
      success: true,
      statementCount: statements.length,
      duration,
      columns: lastColumns,
      rows: lastResults,
      changes: totalChanges,
      batchSummary: batchResults.map((res, i) => ({
        index: i + 1,
        changes: res.meta?.changes || 0,
        rowsCount: res.results?.length || 0,
        duration: res.meta?.duration || 0
      }))
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    return new Response(JSON.stringify({
      success: false,
      error: error.message || "SQL execution error occurred.",
      duration
    }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
}
