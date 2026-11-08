/**
 * Cloudflare Pages Function: /api/improvmx
 * Professional Email Alias Manager powered by ImprovMX API
 * 
 * Capabilities:
 * - List accounts and domains dynamically from API key(s)
 * - Check DNS / MX records status for active domains
 * - List, create, update, and delete email aliases (e.g. name@domain -> researcher@gmail.com)
 * - Multi-API-key support with D1 database persistence
 */

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
  } catch (e) {
    // Ignore table creation errors
  }
}

async function getAllApiKeys(db) {
  let keys = [
    {
      id: DEFAULT_KEY_ID,
      label: DEFAULT_KEY_LABEL,
      api_key: DEFAULT_PRIMARY_KEY,
      is_default: 1,
      createdAt: new Date().toISOString()
    }
  ];

  if (db) {
    try {
      await ensureKeysTable(db);
      const { results } = await db.prepare("SELECT * FROM improvmx_keys ORDER BY createdAt ASC").all();
      if (results && results.length > 0) {
        // Merge with custom keys, overriding or appending
        const customKeys = results.map(r => ({
          id: r.id,
          label: r.label,
          api_key: r.api_key,
          is_default: r.is_default === 1,
          createdAt: r.createdAt
        }));
        // If custom keys exist, make sure default key is present if not already added
        const hasPrimary = customKeys.some(k => k.api_key === DEFAULT_PRIMARY_KEY || k.id === DEFAULT_KEY_ID);
        if (!hasPrimary) {
          keys = [keys[0], ...customKeys];
        } else {
          keys = customKeys;
        }
      }
    } catch (e) {
      // Fallback to default in-memory key
    }
  }

  return keys;
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
  return defaultKey ? defaultKey.api_key : DEFAULT_PRIMARY_KEY;
}

async function callImprovMXApi(apiKey, method, endpoint, body) {
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

// -----------------------------------------------------------------------------
// GET Handler
// -----------------------------------------------------------------------------
export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const action = url.searchParams.get("action") || "domains";
  const keyId = url.searchParams.get("keyId");
  const domain = url.searchParams.get("domain");

  const apiKey = await getApiKeyById(env?.DB, keyId);

  // 1. List configured API keys
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

  // 2. Account info & limits
  if (action === "account") {
    const res = await callImprovMXApi(apiKey, "GET", "/account");
    return jsonResponse(res.data, res.status);
  }

  // 3. List Domains associated with this API key
  if (action === "domains") {
    const res = await callImprovMXApi(apiKey, "GET", "/domains");
    return jsonResponse(res.data, res.status);
  }

  // 4. Check DNS / MX records status for a specific domain
  if (action === "check") {
    if (!domain) {
      return jsonResponse({ error: "domain parameter is required" }, 400);
    }
    const res = await callImprovMXApi(apiKey, "GET", `/domains/${encodeURIComponent(domain)}/check`);
    return jsonResponse(res.data, res.status);
  }

  // 5. List all aliases for a domain
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

// -----------------------------------------------------------------------------
// POST Handler
// -----------------------------------------------------------------------------
export async function onRequestPost(context) {
  const { request, env } = context;

  let body = {};
  try {
    body = await request.json();
  } catch (e) {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const action = body.action || "create_alias";
  const apiKey = await getApiKeyById(env?.DB, body.keyId);

  // 1. Add new ImprovMX API Key
  if (action === "add_key") {
    const { label, key } = body;
    if (!key || !key.startsWith("sk_")) {
      return jsonResponse({ error: "Valid ImprovMX API key required (must start with sk_)" }, 400);
    }

    // Validate key by querying /account
    const test = await callImprovMXApi(key.trim(), "GET", "/account");
    if (test.status !== 200 || !test.data.success) {
      return jsonResponse({ error: "API key validation failed. Please check your ImprovMX credentials." }, 400);
    }

    const newId = "key_" + Date.now().toString(36);
    const keyLabel = (label || "Secondary Account").trim();

    if (env?.DB) {
      await ensureKeysTable(env.DB);
      await env.DB.prepare(`
        INSERT INTO improvmx_keys (id, label, api_key, is_default, createdAt)
        VALUES (?, ?, ?, 0, ?)
      `).bind(newId, keyLabel, key.trim(), new Date().toISOString()).run();
    }

    return jsonResponse({
      success: true,
      key: {
        id: newId,
        label: keyLabel,
        maskedKey: maskApiKey(key.trim()),
        accountEmail: test.data?.account?.email || null
      }
    });
  }

  // 2. Create Alias
  if (action === "create_alias") {
    const { domain, alias, forward } = body;
    if (!domain || !alias || !forward) {
      return jsonResponse({ error: "Missing required fields: domain, alias, forward" }, 400);
    }

    // Clean alias: remove leading/trailing @ or spaces
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

// -----------------------------------------------------------------------------
// PUT Handler (Update alias forward destination)
// -----------------------------------------------------------------------------
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

// -----------------------------------------------------------------------------
// DELETE Handler (Delete alias or API key)
// -----------------------------------------------------------------------------
export async function onRequestDelete(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const action = url.searchParams.get("action") || "delete_alias";
  const keyId = url.searchParams.get("keyId");

  if (action === "delete_key") {
    const targetKeyId = url.searchParams.get("targetKeyId");
    if (!targetKeyId || targetKeyId === DEFAULT_KEY_ID) {
      return jsonResponse({ error: "Cannot delete the primary API key" }, 400);
    }
    if (env?.DB) {
      await env.DB.prepare("DELETE FROM improvmx_keys WHERE id = ?").bind(targetKeyId).run();
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
