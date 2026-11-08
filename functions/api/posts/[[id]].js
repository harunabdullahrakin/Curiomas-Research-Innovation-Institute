/**
 * Cloudflare Pages Function: /api/posts/[[id]]
 * Relational SQL CRUD operations for research articles & blog dispatches via Cloudflare D1
 */

const PURGED_POST_IDS = new Set([
  "crii-article-exoplanetary-spectra",
  "crii-article-fossil-calibration",
  "crii-article-ml-biophysics",
  "crii-article-edge-of-habitability"
]);

const SEED_POSTS = [];

function formatSqlRow(row) {
  if (!row) return null;
  return {
    ...row,
    authors: safeJsonParse(row.authors_json, [row.authors_json || "CRII Fellow"]),
    tags: safeJsonParse(row.tags_json, ["Research"]),
    blocks: safeJsonParse(row.blocks_json, []),
    published: Boolean(row.published),
    featured: Boolean(row.featured)
  };
}

function safeJsonParse(str, fallback) {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch (e) {
    return fallback;
  }
}

async function ensurePostsTable(db) {
  if (!db) return;
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS posts (
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
      )
    `).run().catch(() => {});

    await db.prepare("CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug)").run().catch(() => {});
    await db.prepare("CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published)").run().catch(() => {});
    await db.prepare("CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category)").run().catch(() => {});

    // Ensure columns exist on older schemas
    await db.prepare("ALTER TABLE posts ADD COLUMN blocks_json TEXT").run().catch(() => {});
    await db.prepare("ALTER TABLE posts ADD COLUMN tags_json TEXT").run().catch(() => {});
    await db.prepare("ALTER TABLE posts ADD COLUMN featured INTEGER DEFAULT 0").run().catch(() => {});
    await db.prepare("ALTER TABLE posts ADD COLUMN published INTEGER DEFAULT 1").run().catch(() => {});
  } catch (e) {
    console.error("ensurePostsTable error:", e);
  }
}

export async function onRequestGet(context) {
  const { params, request, env } = context;
  let idOrSlug = null;
  if (params && params.id) {
    idOrSlug = Array.isArray(params.id) ? params.id.join('/') : String(params.id);
  }
  if (!idOrSlug) {
    const url = new URL(request.url);
    idOrSlug = url.searchParams.get("id") || url.searchParams.get("slug");
  }
  if (idOrSlug) idOrSlug = idOrSlug.trim();

  // 1. Cloudflare D1 SQL implementation
  if (env && env.DB) {
    try {
      await ensurePostsTable(env.DB);

      // Load tombstone of deleted post IDs
      let deletedIds = new Set(PURGED_POST_IDS);
      try {
        const delRow = await env.DB.prepare("SELECT value_json FROM settings WHERE key = 'deleted_posts'").first();
        if (delRow && delRow.value_json) {
          const arr = JSON.parse(delRow.value_json);
          if (Array.isArray(arr)) arr.forEach(id => deletedIds.add(id));
        }
      } catch (e) {}

      if (idOrSlug) {
        if (deletedIds.has(idOrSlug)) {
          return new Response(JSON.stringify({ error: "Post deleted" }), {
            status: 404,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache, no-store, must-revalidate"
            }
          });
        }

        const stmt = env.DB.prepare(
          "SELECT * FROM posts WHERE id = ? OR slug = ? LIMIT 1"
        );
        const row = await stmt.bind(idOrSlug, idOrSlug).first();
        if (row) {
          if (deletedIds.has(row.id)) {
            return new Response(JSON.stringify({ error: "Post deleted" }), {
              status: 404,
              headers: { "Content-Type": "application/json" }
            });
          }
          return new Response(JSON.stringify(formatSqlRow(row)), {
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache, no-store, must-revalidate"
            }
          });
        }

        // Secondary fallback to settings store
        try {
          const storeRow = await env.DB.prepare("SELECT value_json FROM settings WHERE key = 'posts_store'").first();
          if (storeRow && storeRow.value_json) {
            const list = JSON.parse(storeRow.value_json);
            if (Array.isArray(list)) {
              const found = list.find(p => p.id === idOrSlug || p.slug === idOrSlug);
              if (found && !deletedIds.has(found.id)) {
                return new Response(JSON.stringify(found), {
                  headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache, no-store, must-revalidate"
                  }
                });
              }
            }
          }
        } catch (e) {}

        return new Response(JSON.stringify({ error: "Post not found" }), {
          status: 404,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate"
          }
        });
      }

      // Query list
      const url = new URL(request.url);
      const category = url.searchParams.get("category");
      const includeDrafts = url.searchParams.get("includeDrafts") === "true";

      let query = "SELECT * FROM posts";
      const conditions = [];
      const binds = [];

      if (!includeDrafts) {
        conditions.push("published = 1");
      }
      if (category) {
        conditions.push("category = ?");
        binds.push(category);
      }

      if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
      }
      query += " ORDER BY date DESC, createdAt DESC";

      let results = [];
      try {
        const stmt = env.DB.prepare(query);
        const res = binds.length > 0 ? await stmt.bind(...binds).all() : await stmt.all();
        results = res.results || [];
      } catch (e) {
        // Retry without createdAt if column absent
        query = query.replace(", createdAt DESC", "");
        const stmt = env.DB.prepare(query);
        const res = binds.length > 0 ? await stmt.bind(...binds).all() : await stmt.all();
        results = res.results || [];
      }

      let formatted = (results || []).map(formatSqlRow).filter(p => !deletedIds.has(p.id));

      // Merge with posts_store if posts table missed any
      try {
        const storeRow = await env.DB.prepare("SELECT value_json FROM settings WHERE key = 'posts_store'").first();
        if (storeRow && storeRow.value_json) {
          const list = JSON.parse(storeRow.value_json);
          if (Array.isArray(list)) {
            const existingIds = new Set(formatted.map(p => p.id));
            for (const sp of list) {
              if (!existingIds.has(sp.id) && !deletedIds.has(sp.id)) {
                if (includeDrafts || sp.published !== false) {
                  formatted.push(sp);
                }
              }
            }
          }
        }
      } catch (e) {}

      return new Response(JSON.stringify(formatted), {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate"
        }
      });
    } catch (err) {
      console.error("D1 SQL Error:", err);
    }
  }

  // 2. Memory / Seed fallback if D1 not yet bound
  let posts = SEED_POSTS;

  if (idOrSlug) {
    const found = posts.find(p => p.id === idOrSlug || p.slug === idOrSlug);
    if (!found) {
      return new Response(JSON.stringify({ error: "Post not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify(found), {
      headers: { "Content-Type": "application/json" }
    });
  }

  return new Response(JSON.stringify(posts), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate"
    }
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const data = await request.json();
    const id = data.id || `crii-paper-${Date.now()}`;
    const title = (data.title || "Untitled Research Publication").trim();
    let slug = (data.slug || title || "paper")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    if (!slug) slug = `paper-${Date.now().toString(36)}`;
    const category = data.category || "Space & Astrophysics";
    const date = data.date || new Date().toISOString().split("T")[0];
    const nowIso = new Date().toISOString();
    const updatedAt = nowIso;
    const updatedBy = data.updatedBy || "Institute Fellow";

    const authorsJson = JSON.stringify(Array.isArray(data.authors) && data.authors.length > 0 ? data.authors : [data.authors || "CRII Fellow"]);
    const tagsJson = JSON.stringify(Array.isArray(data.tags) && data.tags.length > 0 ? data.tags : ["Research"]);
    const blocksJson = data.blocks ? JSON.stringify(data.blocks) : "[]";
    const published = data.published !== false ? 1 : 0;
    const featured = data.featured ? 1 : 0;
    const downloads = Number(data.downloads) || 0;
    const citations = Number(data.citations) || 0;
    const coverImage = data.coverImage || "";
    const readingTime = data.readingTime || "5 min read";
    const doi = data.doi || `10.5281/crii.2026.${Math.floor(1000 + Math.random() * 9000)}`;
    const summary = data.summary || title;
    const abstract = data.abstract || summary;
    const content = data.content || summary;

    // 1. Save to Cloudflare D1 SQL Database with automatic slug deduplication
    if (env && env.DB) {
      await ensurePostsTable(env.DB);

      // Check if another article uses this slug
      let finalSlug = slug;
      let counter = 1;
      while (true) {
        const existing = await env.DB.prepare(
          "SELECT id FROM posts WHERE slug = ? AND id != ? LIMIT 1"
        ).bind(finalSlug, id).first();
        if (!existing) break;
        finalSlug = `${slug}-${counter++}`;
      }
      slug = finalSlug;

      if (featured === 1) {
        await env.DB.prepare("UPDATE posts SET featured = 0 WHERE id != ?").bind(id).run().catch(() => {});
      }

      const sql = `
        INSERT INTO posts (
          id, slug, title, coverImage, category, authors_json, date,
          updatedAt, updatedBy, readingTime, doi, summary, abstract,
          content, blocks_json, tags_json, published, featured, downloads, citations
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
        ON CONFLICT(id) DO UPDATE SET
          slug=excluded.slug,
          title=excluded.title,
          coverImage=excluded.coverImage,
          category=excluded.category,
          authors_json=excluded.authors_json,
          updatedAt=excluded.updatedAt,
          updatedBy=excluded.updatedBy,
          readingTime=excluded.readingTime,
          doi=excluded.doi,
          summary=excluded.summary,
          abstract=excluded.abstract,
          content=excluded.content,
          blocks_json=excluded.blocks_json,
          tags_json=excluded.tags_json,
          published=excluded.published,
          featured=excluded.featured;
      `;
      await env.DB.prepare(sql).bind(
        id, slug, title, coverImage, category, authorsJson, date,
        updatedAt, updatedBy, readingTime, doi, summary, abstract,
        content, blocksJson, tagsJson, published, featured, downloads, citations
      ).run();

      // Dual-persistence into settings 'posts_store'
      try {
        const storeRow = await env.DB.prepare("SELECT value_json FROM settings WHERE key = 'posts_store'").first();
        let list = [];
        if (storeRow && storeRow.value_json) {
          try { list = JSON.parse(storeRow.value_json); } catch(e){}
        }
        if (!Array.isArray(list)) list = [];
        list = list.filter(p => p.id !== id);
        const postObj = {
          ...data,
          id,
          slug,
          title,
          category,
          date,
          updatedAt,
          updatedBy,
          coverImage,
          readingTime,
          doi,
          summary,
          abstract,
          content,
          blocks: data.blocks || [],
          tags: Array.isArray(data.tags) ? data.tags : ["Research"],
          authors: Array.isArray(data.authors) ? data.authors : [data.authors || "CRII Fellow"],
          published: Boolean(published),
          featured: Boolean(featured),
          downloads,
          citations
        };
        list.unshift(postObj);
        await env.DB.prepare(`
          INSERT INTO settings (key, value_json, updatedAt, updatedBy)
          VALUES ('posts_store', ?, ?, ?)
          ON CONFLICT(key) DO UPDATE SET value_json=excluded.value_json, updatedAt=excluded.updatedAt;
        `).bind(JSON.stringify(list.slice(0, 500)), updatedAt, updatedBy).run().catch(() => {});
      } catch (e) {}
    }

    const saved = {
      ...data,
      id,
      slug,
      title,
      category,
      date,
      updatedAt,
      updatedBy,
      coverImage,
      readingTime,
      doi,
      summary,
      abstract,
      content,
      published: Boolean(published),
      featured: Boolean(featured),
      downloads,
      citations
    };

    return new Response(JSON.stringify(saved), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate"
      }
    });
  } catch (err) {
    console.error("Failed to create/update post in D1:", err);
    return new Response(JSON.stringify({ error: err.message || "Failed to process post" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function onRequestDelete(context) {
  const { params, request, env } = context;

  let id = null;
  if (params && params.id) {
    id = Array.isArray(params.id) ? params.id.join('/') : String(params.id);
  }
  if (!id) {
    const url = new URL(request.url);
    id = url.searchParams.get("id");
  }
  if (!id) {
    try {
      const body = await request.json();
      id = body.id;
    } catch (e) {}
  }

  if (!id) {
    return new Response(JSON.stringify({ error: "Missing publication ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  if (env && env.DB) {
    try {
      await ensurePostsTable(env.DB);

      // Record in tombstone
      let deletedList = [];
      try {
        const delRow = await env.DB.prepare("SELECT value_json FROM settings WHERE key = 'deleted_posts'").first();
        if (delRow && delRow.value_json) {
          deletedList = JSON.parse(delRow.value_json);
          if (!Array.isArray(deletedList)) deletedList = [];
        }
      } catch (e) {}

      if (!deletedList.includes(id)) {
        deletedList.push(id);
        await env.DB.prepare("INSERT OR REPLACE INTO settings (key, value_json, updatedAt, updatedBy) VALUES ('deleted_posts', ?, datetime('now'), 'system')").bind(JSON.stringify(deletedList)).run();
      }

      await env.DB.prepare("DELETE FROM posts WHERE id = ?").bind(id).run();

      // Also remove from posts_store
      try {
        const storeRow = await env.DB.prepare("SELECT value_json FROM settings WHERE key = 'posts_store'").first();
        if (storeRow && storeRow.value_json) {
          let list = JSON.parse(storeRow.value_json);
          if (Array.isArray(list)) {
            list = list.filter(p => p.id !== id);
            await env.DB.prepare("UPDATE settings SET value_json = ?, updatedAt = datetime('now') WHERE key = 'posts_store'").bind(JSON.stringify(list)).run();
          }
        }
      } catch (e) {}
    } catch (e) {
      console.error("D1 delete error:", e);
    }
  }

  return new Response(JSON.stringify({ success: true, id }), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate"
    }
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}
