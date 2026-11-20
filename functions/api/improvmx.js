const DEFAULT_PRIMARY_KEY = "sk_039b243250cf4b33856cb5cdf95b4509";
const DEFAULT_KEY_ID = "key_primary_improvmx";
const DEFAULT_KEY_LABEL = "Primary Council Account";

async function ensureKeysTable(db) {
  if (!db) return;
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS improvmx_keys (
        id TEXT PRIMARY KEY,
        label TEXT NOT NULL,
        api_key TEXT NOT NULL,
        is_default INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL
      )
    `).run().catch(() => {});
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value_json TEXT NOT NULL,
        updatedAt TEXT,
        updatedBy TEXT
      )
    `).run().catch(() => {});
  } catch (e) {}
}

async function seedPrimaryIfNeverSeeded(db) {
  if (!db) return;
  try {
    const seededRow = await db.prepare("SELECT value_json FROM settings WHERE key = 'improvmx_keys_seeded'").first();
    if (seededRow) return;
    const existing = await db.prepare("SELECT id, is_default FROM improvmx_keys").all();
    const rows = (existing && existing.results) || [];
    const hasPrimary = rows.some(r => r.id === DEFAULT_KEY_ID);
    const hasAnyDefault = rows.some(r => r.is_default === 1);
    if (!hasPrimary) {
      await db.prepare(`
        INSERT OR IGNORE INTO improvmx_keys (id, label, api_key, is_default, createdAt)
        VALUES (?, ?, ?, ?, ?)
      `).bind(DEFAULT_KEY_ID, DEFAULT_KEY_LABEL, DEFAULT_PRIMARY_KEY, hasAnyDefault ? 0 : 1, new Date().toISOString()).run();
    }
    await db.prepare(`
      INSERT INTO settings (key, value_json, updatedAt, updatedBy)
      VALUES ('improvmx_keys_seeded', 'true', ?, 'System')
      ON CONFLICT(key) DO NOTHING
    `).bind(new Date().toISOString()).run();
  } catch (e) {}
}

async function getAllApiKeys(db) {
  if (db) {
    try {
      await ensureKeysTable(db);
      await seedPrimaryIfNeverSeeded(db);
      const { results } = await db.prepare("SELECT * FROM improvmx_keys ORDER BY is_default DESC, createdAt ASC").all();
      if (results && results.length > 0) {
        const mapped = results.map(r => ({
          id: r.id,
          label: r.label,
          api_key: r.api_key,
          is_default: r.is_default === 1,
          createdAt: r.createdAt
        }));
        if (!mapped.some(k => k.is_default)) {
          mapped[0].is_default = true;
          await db.prepare("UPDATE improvmx_keys SET is_default = 1 WHERE id = ?").bind(mapped[0].id).run().catch(() => {});
        }
        return mapped;
      }
      return [];
    } catch (e) {}
  }

  return [
    {
      id: DEFAULT_KEY_ID,
      label: DEFAULT_KEY_LABEL,
      api_key: DEFAULT_PRIMARY_KEY,
      is_default: true,
      createdAt: new Date().toISOString()
    }
  ];
}

function maskApiKey(key) {
  if (!key || key.length < 8) return "sk_****";
  return key.slice(0, 7) + "..." + key.slice(-4);
}

async function getApiKeyById(db, keyId) {
  const allKeys = await getAllApiKeys(db);
  if (keyId) {
    const found = allKeys.find(k => k.id === keyId);
    if (found) return found.api_key;
  }
  const defaultKey = allKeys.find(k => k.is_default);
  if (defaultKey) return defaultKey.api_key;
  if (allKeys.length > 0) return allKeys[0].api_key;
  return null;
}

async function callImprovMXApi(apiKey, method, endpoint, body) {
  if (!apiKey) {
    return { status: 400, data: { error: "No ImprovMX API key configured. Please add an API key first." } };
  }
  const authHeader = "Basic " + btoa("api:" + apiKey);
  const url = "https://api.improvmx.com/v3" + endpoint;

  const headers = {
    Authorization: authHeader,
    Accept: "application/json",
    "User-Agent": "curiomas-institute-portal/1.0"
  };

  let reqInit = {
    method,
    headers
  };

  if (body) {
    headers["Content-Type"] = "application/json";
    reqInit.body = JSON.stringify(body);
  }

  const res = await fetch(url, reqInit);
  const text = await res.text();
  try {
    return {
      status: res.status,
      data: JSON.parse(text)
    };
  } catch (e) {
    return {
      status: res.status,
      raw: text,
      data: { error: text || `HTTP ${res.status}` }
    };
  }
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "Access-Control-Allow-Origin": "*"
    }
  });
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const action = url.searchParams.get("action") || "domains";
  const keyId = url.searchParams.get("keyId");
  const domain = url.searchParams.get("domain");

  if (action === "keys") {
    const keys = await getAllApiKeys(env?.DB);
    const masked = keys.map(k => ({
      id: k.id,
      label: k.label,
      maskedKey: maskApiKey(k.api_key),
      isDefault: Boolean(k.is_default),
      createdAt: k.createdAt
    }));
    return jsonResponse({ success: true, keys: masked });
  }

  const apiKey = await getApiKeyById(env?.DB, keyId);

  if (action === "account") {
    const res = await callImprovMXApi(apiKey, "GET", "/account");
    return jsonResponse(res.data, res.status);
  }

  if (action === "domains") {
    const res = await callImprovMXApi(apiKey, "GET", "/domains");
    return jsonResponse(res.data, res.status);
  }

  if (action === "check") {
    if (!domain) {
      return jsonResponse({ error: "domain parameter is required" }, 400);
    }
    const res = await callImprovMXApi(apiKey, "GET", `/domains/${encodeURIComponent(domain)}/check`);
    return jsonResponse(res.data, res.status);
  }

  if (action === "aliases") {
    if (!domain) {
      return jsonResponse({ error: "domain parameter is required" }, 400);
    }
    const limit = url.searchParams.get("limit") || "100";
    const page = url.searchParams.get("page") || "1";
    const res = await callImprovMXApi(apiKey, "GET", `/domains/${encodeURIComponent(domain)}/aliases?limit=${limit}&page=${page}`);
    return jsonResponse(res.data, res.status);
  }

  return jsonResponse({ error: `Unknown action: ${action}` }, 400);
}

export async function onRequestPost(context) {
  const { request, env } = context;

  let body = {};
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const action = body.action || "create_alias";

  if (action === "set_default_key") {
    const { targetKeyId } = body;
    if (!targetKeyId) {
      return jsonResponse({ error: "targetKeyId is required" }, 400);
    }
    if (env?.DB) {
      await ensureKeysTable(env.DB);
      await seedPrimaryIfNeverSeeded(env.DB);
      const exists = await env.DB.prepare("SELECT id FROM improvmx_keys WHERE id = ?").bind(targetKeyId).first();
      if (!exists) {
        return jsonResponse({ error: "API key not found" }, 404);
      }
      await env.DB.prepare("UPDATE improvmx_keys SET is_default = 0").run();
      await env.DB.prepare("UPDATE improvmx_keys SET is_default = 1 WHERE id = ?").bind(targetKeyId).run();
    }
    return jsonResponse({ success: true, defaultKeyId: targetKeyId });
  }

  if (action === "add_key") {
    const { label, key, makeDefault } = body;
    if (!key || !key.startsWith("sk_")) {
      return jsonResponse({ error: "Valid ImprovMX API key required (must start with sk_)" }, 400);
    }

    const test = await callImprovMXApi(key.trim(), "GET", "/account");
    if (test.status !== 200 || !test.data.success) {
      return jsonResponse({ error: "API key validation failed. Please check your ImprovMX credentials." }, 400);
    }

    const newId = "key_" + Date.now().toString(36);
    const keyLabel = (label || "Institute Account").trim();

    if (env?.DB) {
      await ensureKeysTable(env.DB);
      await seedPrimaryIfNeverSeeded(env.DB);
      const existing = await env.DB.prepare("SELECT COUNT(*) as cnt FROM improvmx_keys").first();
      const shouldBeDefault = Boolean(makeDefault) || !existing || existing.cnt === 0;
      if (shouldBeDefault) {
        await env.DB.prepare("UPDATE improvmx_keys SET is_default = 0").run();
      }
      await env.DB.prepare(`
        INSERT INTO improvmx_keys (id, label, api_key, is_default, createdAt)
        VALUES (?, ?, ?, ?, ?)
      `).bind(newId, keyLabel, key.trim(), shouldBeDefault ? 1 : 0, new Date().toISOString()).run();
    }

    return jsonResponse({
      success: true,
      key: {
        id: newId,
        label: keyLabel,
        maskedKey: maskApiKey(key.trim()),
        isDefault: Boolean(makeDefault),
        accountEmail: test.data?.account?.email || null
      }
    });
  }

  const apiKey = await getApiKeyById(env?.DB, body.keyId);

  if (action === "create_alias") {
    const { domain, alias, forward } = body;
    if (!domain || !alias || !forward) {
      return jsonResponse({ error: "Missing required fields: domain, alias, forward" }, 400);
    }

    const cleanAlias = alias.replace(/^@+|@+$/g, "").trim().toLowerCase();
    const cleanForward = forward.trim().toLowerCase();

    const res = await callImprovMXApi(apiKey, "POST", `/domains/${encodeURIComponent(domain)}/aliases`, {
      alias: cleanAlias,
      forward: cleanForward
    });

    return jsonResponse(res.data, res.status);
  }

  return jsonResponse({ error: `Unknown action: ${action}` }, 400);
}

export async function onRequestPut(context) {
  const { request, env } = context;

  let body = {};
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const { domain, aliasId, forward, keyId } = body;
  if (!domain || !aliasId || !forward) {
    return jsonResponse({ error: "Missing required fields: domain, aliasId, forward" }, 400);
  }

  const apiKey = await getApiKeyById(env?.DB, keyId);
  const cleanForward = forward.trim().toLowerCase();

  const res = await callImprovMXApi(apiKey, "PUT", `/domains/${encodeURIComponent(domain)}/aliases/${aliasId}`, {
    forward: cleanForward
  });

  return jsonResponse(res.data, res.status);
}

export async function onRequestDelete(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const action = url.searchParams.get("action") || "delete_alias";
  const keyId = url.searchParams.get("keyId");

  if (action === "delete_key") {
    const targetKeyId = url.searchParams.get("targetKeyId");
    if (!targetKeyId) {
      return jsonResponse({ error: "targetKeyId is required" }, 400);
    }
    if (env?.DB) {
      await ensureKeysTable(env.DB);
      await seedPrimaryIfNeverSeeded(env.DB);
      const targetRow = await env.DB.prepare("SELECT * FROM improvmx_keys WHERE id = ?").bind(targetKeyId).first();
      await env.DB.prepare("DELETE FROM improvmx_keys WHERE id = ?").bind(targetKeyId).run();
      if (targetRow && targetRow.is_default === 1) {
        const nextRow = await env.DB.prepare("SELECT id FROM improvmx_keys ORDER BY createdAt ASC LIMIT 1").first();
        if (nextRow && nextRow.id) {
          await env.DB.prepare("UPDATE improvmx_keys SET is_default = 1 WHERE id = ?").bind(nextRow.id).run();
        }
      }
    }
    return jsonResponse({ success: true, deletedKeyId: targetKeyId });
  }

  if (action === "delete_alias") {
    const domain = url.searchParams.get("domain");
    const aliasId = url.searchParams.get("aliasId");

    if (!domain || !aliasId) {
      return jsonResponse({ error: "Missing required parameters: domain, aliasId" }, 400);
    }

    const apiKey = await getApiKeyById(env?.DB, keyId);
    const res = await callImprovMXApi(apiKey, "DELETE", `/domains/${encodeURIComponent(domain)}/aliases/${aliasId}`);
    return jsonResponse(res.data, res.status);
  }

  return jsonResponse({ error: `Unknown delete action: ${action}` }, 400);
}
