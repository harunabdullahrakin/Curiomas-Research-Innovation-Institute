const GEMINI_INTERACTIONS_URL = "https://generativelanguage.googleapis.com/v1beta/interactions";
const GEMINI_API_REVISION = "2026-05-20";
const GEMINI_TEXT_FALLBACKS = [
  "gemini-3.8-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemma-4-31b-it"
];
const GEMINI_IMAGE_FALLBACKS = [
  "gemini-nano-banana-2.1",
  "gemini-3.1-flash-lite-image",
  "gemini-3-pro-image"
];
const RATIO_DIMS = {
  "16:9": { w: 1280, h: 720, openaiSize: "1792x1024" },
  "3:2": { w: 1152, h: 768, openaiSize: "1792x1024" },
  "4:3": { w: 1024, h: 768, openaiSize: "1024x1024" },
  "1:1": { w: 1024, h: 1024, openaiSize: "1024x1024" },
  "9:16": { w: 720, h: 1280, openaiSize: "1024x1792" }
};

const BUILTIN_POLLINATIONS = {
  id: "builtin_pollinations",
  vendor: "pollinations",
  label: "Pollinations.ai (Free FLUX)",
  apiKey: "",
  accountId: "",
  baseUrl: "https://image.pollinations.ai",
  textModel: "",
  imageModel: "flux",
  supportsText: false,
  supportsImage: true,
  enabled: true,
  isDefaultText: false,
  isDefaultImage: true,
  builtIn: true
};

function jsonResp(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "Access-Control-Allow-Origin": "*"
    }
  });
}

function maskKey(k) {
  const s = String(k || "").trim();
  if (!s) return "";
  if (s.length <= 8) return "****";
  return s.slice(0, 6) + "..." + s.slice(-4);
}

async function ensureSettingsTable(db) {
  if (!db) return;
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value_json TEXT NOT NULL,
      updatedAt TEXT,
      updatedBy TEXT
    )
  `).run().catch(() => {});
}

async function ensureMediaTable(db) {
  if (!db) return;
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS media_items (
      id TEXT PRIMARY KEY,
      key TEXT UNIQUE NOT NULL,
      url TEXT NOT NULL,
      filename TEXT NOT NULL,
      mimeType TEXT,
      size INTEGER DEFAULT 0,
      uploadedAt TEXT NOT NULL,
      uploadedBy TEXT DEFAULT 'AI Studio',
      tag TEXT
    )
  `).run().catch(() => {});
}

async function loadProviders(env) {
  let list = [];
  if (env && env.DB) {
    try {
      await ensureSettingsTable(env.DB);
      const row = await env.DB.prepare("SELECT value_json FROM settings WHERE key = 'ai_api_providers'").first();
      if (row && row.value_json) {
        const parsed = JSON.parse(row.value_json);
        if (Array.isArray(parsed)) list = parsed;
      }
      if (list.length === 0) {
        const legacy = await env.DB.prepare("SELECT value_json FROM settings WHERE key = 'gemini_ai_config'").first();
        if (legacy && legacy.value_json) {
          try {
            const p = JSON.parse(legacy.value_json);
            if (p && p.apiKey) {
              list.push({
                id: "prov_gemini_migrated",
                vendor: "gemini",
                label: "Google Gemini",
                apiKey: String(p.apiKey).trim(),
                accountId: "",
                baseUrl: GEMINI_INTERACTIONS_URL,
                textModel: "gemini-3.8-flash",
                imageModel: "gemini-nano-banana-2.1",
                supportsText: true,
                supportsImage: true,
                enabled: true,
                isDefaultText: true,
                isDefaultImage: false
              });
            }
          } catch (e) {}
        }
      }
    } catch (e) {}
  }

  if (env && env.GEMINI_API_KEY && !list.some(p => p.vendor === "gemini")) {
    list.push({
      id: "env_gemini",
      vendor: "gemini",
      label: "Google Gemini (Env)",
      apiKey: String(env.GEMINI_API_KEY).trim(),
      accountId: "",
      baseUrl: GEMINI_INTERACTIONS_URL,
      textModel: "gemini-3.8-flash",
      imageModel: "gemini-nano-banana-2.1",
      supportsText: true,
      supportsImage: true,
      enabled: true,
      isDefaultText: !list.some(p => p.isDefaultText),
      isDefaultImage: false
    });
  }

  if (!list.some(p => p.id === BUILTIN_POLLINATIONS.id || p.vendor === "pollinations")) {
    list.unshift({
      ...BUILTIN_POLLINATIONS,
      isDefaultImage: !list.some(p => p.supportsImage && p.isDefaultImage)
    });
  }

  return list;
}

async function saveProviders(env, list, updatedBy = "Administrator") {
  if (!env || !env.DB) return;
  await ensureSettingsTable(env.DB);
  await env.DB.prepare(`
    INSERT INTO settings (key, value_json, updatedAt, updatedBy)
    VALUES ('ai_api_providers', ?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET
      value_json = excluded.value_json,
      updatedAt = excluded.updatedAt,
      updatedBy = excluded.updatedBy
  `).bind(JSON.stringify(list), new Date().toISOString(), updatedBy).run();
}

function sanitizeProviderForClient(p) {
  return {
    id: p.id,
    vendor: p.vendor,
    label: p.label,
    hasKey: Boolean(p.apiKey && String(p.apiKey).trim()),
    maskedKey: maskKey(p.apiKey),
    accountId: p.accountId || "",
    baseUrl: p.baseUrl || "",
    textModel: p.textModel || "",
    imageModel: p.imageModel || "",
    supportsText: Boolean(p.supportsText),
    supportsImage: Boolean(p.supportsImage),
    enabled: p.enabled !== false,
    isDefaultText: Boolean(p.isDefaultText),
    isDefaultImage: Boolean(p.isDefaultImage),
    builtIn: Boolean(p.builtIn)
  };
}

function base64ToUint8Array(base64) {
  const clean = String(base64 || "").replace(/\s+/g, "");
  const binary = atob(clean);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function extractGeminiText(data) {
  if (!data || typeof data !== "object") return "";
  const chunks = [];
  if (Array.isArray(data.steps)) {
    for (const step of data.steps) {
      if (step && step.type === "model_output" && Array.isArray(step.content)) {
        for (const block of step.content) {
          if (block && block.type === "text" && block.text) chunks.push(block.text);
        }
      }
    }
  }
  if (chunks.length === 0 && Array.isArray(data.outputs)) {
    for (const out of data.outputs) {
      if (out && out.type === "text" && out.text) chunks.push(out.text);
    }
  }
  return chunks.join("\n").trim();
}

function extractGeminiImage(data) {
  if (!data || typeof data !== "object") return null;
  let found = null;
  if (Array.isArray(data.steps)) {
    for (const step of data.steps) {
      if (step && step.type === "model_output" && Array.isArray(step.content)) {
        for (const block of step.content) {
          if (block && block.type === "image" && block.data) {
            found = { data: block.data, mimeType: block.mime_type || block.mimeType || "image/jpeg" };
          }
        }
      }
    }
  }
  if (!found && Array.isArray(data.outputs)) {
    for (const out of data.outputs) {
      if (out && out.type === "image" && out.data) {
        found = { data: out.data, mimeType: out.mime_type || out.mimeType || "image/jpeg" };
      }
    }
  }
  return found;
}

function buildLocalFallbackPrompt({ title, category, excerpt, content, mode, style }) {
  const modeDesc = mode === "diagram"
    ? "Clean modern scientific infographic diagram with crisp visual hierarchy"
    : mode === "illustration"
      ? "Detailed in-article scientific editorial illustration"
      : mode === "banner"
        ? "Wide panoramic editorial research header banner"
        : "High-impact 16:9 editorial scientific publication cover thumbnail";
  const snippet = (excerpt || content || "").replace(/\s+/g, " ").trim().slice(0, 260);
  return [
    `${modeDesc} in ${style} style representing "${title || "Frontier Scientific Discovery"}".`,
    category ? `Discipline atmosphere inspired by ${category}.` : "",
    snippet ? `Core visual themes drawn from the research: ${snippet}.` : "",
    "Dramatic museum-grade studio lighting, crisp focal depth, rich balanced color palette, refined composition, no watermarks or cluttered text overlays."
  ].filter(Boolean).join(" ");
}

async function runTextWithProvider(provider, promptText) {
  const vendor = provider.vendor;
  const apiKey = String(provider.apiKey || "").trim();

  if (vendor === "gemini") {
    if (!apiKey) throw new Error("Gemini API key missing");
    const chain = [provider.textModel, ...GEMINI_TEXT_FALLBACKS].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i);
    let lastErr = "Gemini text request failed";
    for (const model of chain) {
      const res = await fetch(GEMINI_INTERACTIONS_URL, {
        method: "POST",
        headers: {
          "x-goog-api-key": apiKey,
          "Content-Type": "application/json",
          "Api-Revision": GEMINI_API_REVISION
        },
        body: JSON.stringify({ model, input: [{ type: "text", text: promptText }], store: false })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        const text = extractGeminiText(data);
        if (text) return { text, model };
      }
      lastErr = data?.error?.message || `HTTP ${res.status}`;
    }
    throw new Error(lastErr);
  }

  if (vendor === "cloudflare") {
    if (!provider.accountId || !apiKey) throw new Error("Cloudflare Account ID and API Token required");
    const model = provider.textModel || "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(provider.accountId)}/ai/run/${model}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: promptText }] })
    });
    const data = await res.json().catch(() => ({}));
    const text = data?.result?.response || data?.result?.choices?.[0]?.message?.content || "";
    if (!res.ok || !text) throw new Error(data?.errors?.[0]?.message || `Cloudflare AI HTTP ${res.status}`);
    return { text: String(text).trim(), model };
  }

  if (vendor === "huggingface") {
    if (!apiKey) throw new Error("Hugging Face token missing");
    const model = provider.textModel || "meta-llama/Llama-3.3-70B-Instruct";
    const res = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model, messages: [{ role: "user", content: promptText }], max_tokens: 350 })
    });
    const data = await res.json().catch(() => ({}));
    const text = data?.choices?.[0]?.message?.content || "";
    if (!res.ok || !text) throw new Error(data?.error?.message || data?.error || `Hugging Face HTTP ${res.status}`);
    return { text: String(text).trim(), model };
  }

  const defaultUrls = {
    openai: "https://api.openai.com/v1",
    groq: "https://api.groq.com/openai/v1",
    openrouter: "https://openrouter.ai/api/v1",
    together: "https://api.together.xyz/v1",
    custom: provider.baseUrl || "https://api.openai.com/v1"
  };
  const defaultModels = {
    openai: "gpt-4o-mini",
    groq: "llama-3.3-70b-versatile",
    openrouter: "meta-llama/llama-3.3-70b-instruct:free",
    together: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
    custom: provider.textModel || "gpt-4o-mini"
  };
  const base = String(provider.baseUrl || defaultUrls[vendor] || "").replace(/\/+$/, "");
  if (!base || !apiKey) throw new Error(`${provider.label} API key or base URL missing`);
  const model = provider.textModel || defaultModels[vendor] || "gpt-4o-mini";
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json"
  };
  if (vendor === "openrouter") {
    headers["HTTP-Referer"] = "https://www.curiomas.zone.id";
    headers["X-Title"] = "CRII Research Portal";
  }
  const res = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: promptText }],
      temperature: 0.7,
      max_tokens: 350
    })
  });
  const data = await res.json().catch(() => ({}));
  const text = data?.choices?.[0]?.message?.content || "";
  if (!res.ok || !text) throw new Error(data?.error?.message || data?.message || `${provider.label} HTTP ${res.status}`);
  return { text: String(text).trim(), model };
}

async function runImageWithProvider(provider, prompt, aspectRatio, imageSize) {
  const vendor = provider.vendor;
  const apiKey = String(provider.apiKey || "").trim();
  const dims = RATIO_DIMS[aspectRatio] || RATIO_DIMS["16:9"];
  const scale = imageSize === "2K" ? 1.25 : 1;
  const width = Math.round((dims.w * scale) / 16) * 16;
  const height = Math.round((dims.h * scale) / 16) * 16;

  if (vendor === "pollinations") {
    const model = provider.imageModel || "flux";
    const seed = Math.floor(Math.random() * 10000000);
    const cleanPrompt = prompt.slice(0, 950);
    const url = apiKey
      ? `https://gen.pollinations.ai/image/${encodeURIComponent(cleanPrompt)}?width=${width}&height=${height}&model=${encodeURIComponent(model)}&nologo=true&seed=${seed}`
      : `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=${width}&height=${height}&model=${encodeURIComponent(model)}&nologo=true&seed=${seed}`;
    const headers = { "User-Agent": "curiomas-crii-portal/1.0" };
    if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;
    const res = await fetch(url, { headers });
    if (!res.ok) {
      const errBody = await res.json().catch(() => null);
      const errMsg = errBody?.error?.message || errBody?.message || `Pollinations HTTP ${res.status}`;
      throw new Error(errMsg);
    }
    const ct = res.headers.get("content-type") || "image/jpeg";
    if (!ct.startsWith("image/")) throw new Error("Pollinations returned non-image response");
    const buf = new Uint8Array(await res.arrayBuffer());
    if (buf.byteLength < 1024) throw new Error("Pollinations returned empty image");
    return { bytes: buf, mimeType: ct.split(";")[0], model: `pollinations/${model}` };
  }

  if (vendor === "cloudflare") {
    if (!provider.accountId || !apiKey) throw new Error("Cloudflare Account ID and API Token required");
    const model = provider.imageModel || "@cf/black-forest-labs/flux-1-schnell";
    const isFlux = model.includes("flux");
    const payload = isFlux ? { prompt, steps: 4 } : { prompt, width: dims.w, height: dims.h };
    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(provider.accountId)}/ai/run/${model}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const ct = res.headers.get("content-type") || "";
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson?.errors?.[0]?.message || `Cloudflare AI HTTP ${res.status}`);
    }
    if (ct.startsWith("image/")) {
      return { bytes: new Uint8Array(await res.arrayBuffer()), mimeType: ct.split(";")[0], model };
    }
    const data = await res.json().catch(() => ({}));
    const b64 = data?.result?.image;
    if (!b64) throw new Error("Cloudflare Workers AI returned no image data");
    return { bytes: base64ToUint8Array(b64), mimeType: "image/jpeg", model };
  }

  if (vendor === "huggingface") {
    if (!apiKey) throw new Error("Hugging Face token missing");
    const model = provider.imageModel || "black-forest-labs/FLUX.1-schnell";
    const res = await fetch(`https://router.huggingface.co/hf-inference/models/${model}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", Accept: "image/jpeg" },
      body: JSON.stringify({ inputs: prompt, parameters: { width: dims.w, height: dims.h } })
    });
    const ct = res.headers.get("content-type") || "";
    if (!res.ok || !ct.startsWith("image/")) {
      const errTxt = await res.text().catch(() => "");
      throw new Error(errTxt.slice(0, 220) || `Hugging Face HTTP ${res.status}`);
    }
    return { bytes: new Uint8Array(await res.arrayBuffer()), mimeType: ct.split(";")[0], model };
  }

  if (vendor === "stability") {
    if (!apiKey) throw new Error("Stability AI key missing");
    const model = provider.imageModel || "core";
    const endpoint = model === "core"
      ? "https://api.stability.ai/v2beta/stable-image/generate/core"
      : "https://api.stability.ai/v2beta/stable-image/generate/sd3";
    const fd = new FormData();
    fd.append("prompt", prompt);
    fd.append("aspect_ratio", aspectRatio);
    fd.append("output_format", "jpeg");
    if (model !== "core") fd.append("model", model);
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, Accept: "image/*" },
      body: fd
    });
    if (!res.ok) {
      const errTxt = await res.text().catch(() => "");
      throw new Error(errTxt.slice(0, 220) || `Stability AI HTTP ${res.status}`);
    }
    return { bytes: new Uint8Array(await res.arrayBuffer()), mimeType: "image/jpeg", model: `stability/${model}` };
  }

  if (vendor === "gemini") {
    if (!apiKey) throw new Error("Gemini API key missing");
    const chain = [provider.imageModel, ...GEMINI_IMAGE_FALLBACKS].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i);
    let lastErr = "Gemini image request failed";
    for (const model of chain) {
      const res = await fetch(GEMINI_INTERACTIONS_URL, {
        method: "POST",
        headers: {
          "x-goog-api-key": apiKey,
          "Content-Type": "application/json",
          "Api-Revision": GEMINI_API_REVISION
        },
        body: JSON.stringify({
          model,
          input: [{ type: "text", text: prompt }],
          response_format: { type: "image", mime_type: "image/jpeg", aspect_ratio: aspectRatio, image_size: imageSize },
          store: false
        })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        const img = extractGeminiImage(data);
        if (img && img.data) {
          return { bytes: base64ToUint8Array(img.data), mimeType: img.mimeType || "image/jpeg", model };
        }
      }
      lastErr = data?.error?.message || `Gemini HTTP ${res.status}`;
    }
    throw new Error(lastErr);
  }

  const defaultImgUrls = {
    openai: "https://api.openai.com/v1",
    together: "https://api.together.xyz/v1",
    custom: provider.baseUrl || "https://api.openai.com/v1"
  };
  const defaultImgModels = {
    openai: "gpt-image-1",
    together: "black-forest-labs/FLUX.1-schnell-Free",
    custom: provider.imageModel || "gpt-image-1"
  };
  const base = String(provider.baseUrl || defaultImgUrls[vendor] || "").replace(/\/+$/, "");
  if (!base || !apiKey) throw new Error(`${provider.label} API key or base URL missing`);
  const model = provider.imageModel || defaultImgModels[vendor];
  const reqBody = vendor === "together"
    ? { model, prompt, width: dims.w, height: dims.h, steps: 4, n: 1, response_format: "b64_json" }
    : model === "gpt-image-1"
      ? { model, prompt, n: 1, size: dims.openaiSize }
      : { model, prompt, n: 1, size: dims.openaiSize, response_format: "b64_json" };

  const res = await fetch(`${base}/images/generations`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(reqBody)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error?.message || data?.message || `${provider.label} HTTP ${res.status}`);
  const item = data?.data?.[0];
  if (item && item.b64_json) {
    return { bytes: base64ToUint8Array(item.b64_json), mimeType: "image/png", model };
  }
  if (item && item.url) {
    const imgRes = await fetch(item.url);
    if (!imgRes.ok) throw new Error("Failed to download generated image");
    return { bytes: new Uint8Array(await imgRes.arrayBuffer()), mimeType: (imgRes.headers.get("content-type") || "image/png").split(";")[0], model };
  }
  throw new Error(`${provider.label} returned no image payload`);
}

function uint8ToBase64(bytes) {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

export async function onRequestGet(context) {
  const { env } = context;
  const providers = await loadProviders(env);
  return jsonResp({
    success: true,
    configured: providers.some(p => p.enabled !== false),
    providers: providers.map(sanitizeProviderForClient)
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  let body = {};
  try {
    body = await request.json();
  } catch (e) {
    return jsonResp({ error: "Invalid JSON payload" }, 400);
  }

  const action = body.action || "generate";

  if (action === "save_provider") {
    const providers = await loadProviders(env);
    const id = body.id || ("prov_" + Date.now().toString(36));
    const idx = providers.findIndex(p => p.id === id);
    const prev = idx >= 0 ? providers[idx] : null;
    const rawKey = body.apiKey !== undefined && String(body.apiKey).trim() !== ""
      ? String(body.apiKey).trim()
      : (prev ? prev.apiKey : "");

    const record = {
      id,
      vendor: String(body.vendor || prev?.vendor || "custom").trim(),
      label: String(body.label || prev?.label || "Custom AI Provider").trim(),
      apiKey: rawKey,
      accountId: String(body.accountId !== undefined ? body.accountId : (prev?.accountId || "")).trim(),
      baseUrl: String(body.baseUrl !== undefined ? body.baseUrl : (prev?.baseUrl || "")).trim(),
      textModel: String(body.textModel !== undefined ? body.textModel : (prev?.textModel || "")).trim(),
      imageModel: String(body.imageModel !== undefined ? body.imageModel : (prev?.imageModel || "")).trim(),
      supportsText: body.supportsText !== undefined ? Boolean(body.supportsText) : Boolean(prev?.supportsText),
      supportsImage: body.supportsImage !== undefined ? Boolean(body.supportsImage) : Boolean(prev?.supportsImage),
      enabled: body.enabled !== undefined ? Boolean(body.enabled) : (prev ? prev.enabled !== false : true),
      isDefaultText: Boolean(body.isDefaultText),
      isDefaultImage: Boolean(body.isDefaultImage),
      builtIn: Boolean(prev?.builtIn)
    };

    if (record.isDefaultText) providers.forEach(p => { p.isDefaultText = false; });
    if (record.isDefaultImage) providers.forEach(p => { p.isDefaultImage = false; });

    if (idx >= 0) providers[idx] = record;
    else providers.push(record);

    if (!providers.some(p => p.enabled !== false && p.supportsImage && p.isDefaultImage)) {
      const firstImg = providers.find(p => p.enabled !== false && p.supportsImage);
      if (firstImg) firstImg.isDefaultImage = true;
    }
    if (!providers.some(p => p.enabled !== false && p.supportsText && p.isDefaultText)) {
      const firstTxt = providers.find(p => p.enabled !== false && p.supportsText);
      if (firstTxt) firstTxt.isDefaultText = true;
    }

    await saveProviders(env, providers, body.updatedBy || "Administrator");
    return jsonResp({ success: true, provider: sanitizeProviderForClient(record), providers: providers.map(sanitizeProviderForClient) });
  }

  if (action === "delete_provider") {
    const targetId = String(body.id || "").trim();
    if (!targetId) return jsonResp({ error: "Provider ID required" }, 400);
    if (targetId === BUILTIN_POLLINATIONS.id) {
      return jsonResp({ error: "Built-in free Pollinations fallback cannot be deleted (you can disable it instead)." }, 400);
    }
    let providers = await loadProviders(env);
    providers = providers.filter(p => p.id !== targetId);
    if (!providers.some(p => p.supportsImage && p.isDefaultImage)) {
      const firstImg = providers.find(p => p.enabled !== false && p.supportsImage);
      if (firstImg) firstImg.isDefaultImage = true;
    }
    if (!providers.some(p => p.supportsText && p.isDefaultText)) {
      const firstTxt = providers.find(p => p.enabled !== false && p.supportsText);
      if (firstTxt) firstTxt.isDefaultText = true;
    }
    await saveProviders(env, providers, body.updatedBy || "Administrator");
    return jsonResp({ success: true, providers: providers.map(sanitizeProviderForClient) });
  }

  if (action === "set_default_provider") {
    const targetId = String(body.id || "").trim();
    const kind = body.kind === "text" ? "text" : "image";
    const providers = await loadProviders(env);
    const target = providers.find(p => p.id === targetId);
    if (!target) return jsonResp({ error: "Provider not found" }, 404);
    if (kind === "text") {
      providers.forEach(p => { p.isDefaultText = p.id === targetId; });
    } else {
      providers.forEach(p => { p.isDefaultImage = p.id === targetId; });
    }
    target.enabled = true;
    await saveProviders(env, providers, body.updatedBy || "Administrator");
    return jsonResp({ success: true, providers: providers.map(sanitizeProviderForClient) });
  }

  if (action === "toggle_provider") {
    const targetId = String(body.id || "").trim();
    const providers = await loadProviders(env);
    const target = providers.find(p => p.id === targetId);
    if (!target) return jsonResp({ error: "Provider not found" }, 404);
    target.enabled = body.enabled !== undefined ? Boolean(body.enabled) : !target.enabled;
    await saveProviders(env, providers, body.updatedBy || "Administrator");
    return jsonResp({ success: true, providers: providers.map(sanitizeProviderForClient) });
  }

  if (action === "test_provider") {
    const targetId = String(body.id || "").trim();
    const providers = await loadProviders(env);
    const target = providers.find(p => p.id === targetId);
    if (!target) return jsonResp({ error: "Provider not found" }, 404);
    const started = Date.now();
    try {
      if (target.supportsText) {
        const res = await runTextWithProvider(target, "Reply with the single word OK.");
        return jsonResp({ success: true, latencyMs: Date.now() - started, detail: `Text OK (${res.model})` });
      }
      if (target.supportsImage) {
        const res = await runImageWithProvider(target, "Minimalist glowing blue sphere on dark background", "1:1", "1K");
        return jsonResp({ success: true, latencyMs: Date.now() - started, detail: `Image OK (${res.model}, ${Math.round(res.bytes.byteLength / 1024)} KB)` });
      }
      return jsonResp({ error: "Provider has neither text nor image enabled" }, 400);
    } catch (err) {
      if (target.vendor === "pollinations" && !target.apiKey && /402|Free limit|FREE_LIMIT/i.test(err.message || "")) {
        return jsonResp({
          success: true,
          latencyMs: Date.now() - started,
          detail: "Ready via Browser-Direct Free FLUX (Cloudflare shared IP rate-limited; add optional key from enter.pollinations.ai for server-side)"
        });
      }
      return jsonResp({ success: false, error: err.message, latencyMs: Date.now() - started }, 400);
    }
  }

  const providers = await loadProviders(env);

  if (action === "draft_prompt") {
    const title = String(body.title || "").trim();
    const category = String(body.category || "").trim();
    const excerpt = String(body.excerpt || "").trim();
    const tags = String(body.tags || "").trim();
    const content = String(body.content || "").trim().slice(0, 12000);
    const mode = String(body.mode || "thumbnail").trim();
    const style = String(body.style || "Editorial Scientific Photography").trim();

    if (!title && !excerpt && !content) {
      return jsonResp({ error: "Write a title, summary, or article content first so AI can read it." }, 400);
    }

    const modeDirectives = {
      thumbnail: "Design a wide 16:9 high-impact editorial cover thumbnail for a scientific research publication. Clean visual focal point, dramatic lighting, museum-grade composition, NO cluttered watermarks or messy text overlays.",
      illustration: "Design a clear, rich in-article scientific illustration depicting the core mechanism, phenomenon, or discovery described in the article.",
      banner: "Design a sleek panoramic editorial header banner evoking the research atmosphere and discipline of the article.",
      diagram: "Design a clean, crisp, modern scientific visual infographic or schematic diagram with clear visual hierarchy illustrating the article's main findings."
    };

    const synthesisInput = [
      "You are an award-winning scientific art director for Curiomas Research & Innovation Institute (CRII).",
      "Read the entire research article below and write ONE concise, vivid, highly detailed image generation prompt (3 to 5 sentences, plain text only, no markdown quotes or preamble) that captures the article's exact scientific subject, atmosphere, lighting, color palette, and visual composition.",
      `Target Asset Purpose: ${modeDirectives[mode] || modeDirectives.thumbnail}`,
      `Requested Visual Style: ${style}`,
      `Article Title: ${title || "Untitled Research Dispatch"}`,
      category ? `Research Division / Category: ${category}` : "",
      tags ? `Keywords / Tags: ${tags}` : "",
      excerpt ? `Abstract / Summary: ${excerpt}` : "",
      content ? `Full Article Content:\n${content}` : ""
    ].filter(Boolean).join("\n\n");

    const textProviders = providers
      .filter(p => p.enabled !== false && p.supportsText && (p.apiKey || p.vendor === "pollinations"))
      .sort((a, b) => (b.isDefaultText ? 1 : 0) - (a.isDefaultText ? 1 : 0));

    let lastErr = "";
    for (let i = 0; i < textProviders.length; i++) {
      const prov = textProviders[i];
      try {
        const result = await runTextWithProvider(prov, synthesisInput);
        if (result && result.text) {
          return jsonResp({
            success: true,
            prompt: result.text,
            providerLabel: prov.label,
            modelUsed: result.model,
            usedFallback: i > 0
          });
        }
      } catch (err) {
        lastErr = `${prov.label}: ${err.message}`;
      }
    }

    const fallbackPrompt = buildLocalFallbackPrompt({ title, category, excerpt, content, mode, style });
    return jsonResp({
      success: true,
      prompt: fallbackPrompt,
      providerLabel: "CRII Smart Local Synthesizer",
      modelUsed: "smart-local-fallback",
      usedFallback: true,
      fallbackNotice: lastErr
    });
  }

  if (action === "generate") {
    const prompt = String(body.prompt || "").trim();
    if (!prompt) return jsonResp({ error: "Image prompt is required." }, 400);

    const aspectRatio = RATIO_DIMS[body.aspectRatio] ? body.aspectRatio : "16:9";
    const imageSize = body.imageSize === "2K" ? "2K" : "1K";
    const requestedProviderId = String(body.providerId || "auto").trim();
    const slugHint = String(body.slugHint || "article").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 36) || "article";

    const enabledImageProviders = providers.filter(p => p.enabled !== false && p.supportsImage);
    let ordered = [];

    if (requestedProviderId && requestedProviderId !== "auto") {
      const exact = enabledImageProviders.find(p => p.id === requestedProviderId);
      if (exact) ordered.push(exact);
    }

    const rest = enabledImageProviders
      .filter(p => !ordered.some(x => x.id === p.id))
      .sort((a, b) => {
        if (a.isDefaultImage !== b.isDefaultImage) return b.isDefaultImage ? 1 : -1;
        if (a.vendor === "pollinations") return 1;
        if (b.vendor === "pollinations") return -1;
        return 0;
      });
    ordered = [...ordered, ...rest];

    if (!ordered.some(p => p.vendor === "pollinations")) {
      ordered.push(BUILTIN_POLLINATIONS);
    }

    let generated = null;
    let usedProvider = null;
    let usedFallback = false;
    const errors = [];

    for (let i = 0; i < ordered.length; i++) {
      const prov = ordered[i];
      try {
        generated = await runImageWithProvider(prov, prompt, aspectRatio, imageSize);
        usedProvider = prov;
        usedFallback = i > 0;
        break;
      } catch (err) {
        errors.push(`${prov.label}: ${err.message}`);
      }
    }

    if (!generated || !generated.bytes) {
      const dims = RATIO_DIMS[aspectRatio] || RATIO_DIMS["16:9"];
      const scale = imageSize === "2K" ? 1.25 : 1;
      const w = Math.round((dims.w * scale) / 16) * 16;
      const h = Math.round((dims.h * scale) / 16) * 16;
      const polProv = providers.find(p => p.vendor === "pollinations");
      const polModel = (polProv && polProv.imageModel) || "flux";
      const seed = Math.floor(Math.random() * 10000000);
      const clientPollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt.slice(0, 950))}?width=${w}&height=${h}&model=${encodeURIComponent(polModel)}&nologo=true&seed=${seed}`;
      return jsonResp({
        error: errors.join(" | ") || "All configured image providers failed. Please check Settings > AI & API Management.",
        clientPollinationsUrl,
        clientPollinationsModel: `pollinations/${polModel}`
      }, 503);
    }

    const mimeType = generated.mimeType || "image/jpeg";
    const ext = mimeType.includes("png") ? "png" : mimeType.includes("webp") ? "webp" : "jpg";
    const filename = `ai-${slugHint}-${Date.now()}.${ext}`;
    const r2Key = `uploads/${filename}`;
    let finalUrl = `data:${mimeType};base64,${uint8ToBase64(generated.bytes)}`;
    let storedInR2 = false;

    if (env && env.STORAGE) {
      try {
        await env.STORAGE.put(r2Key, generated.bytes, {
          httpMetadata: { contentType: mimeType },
          customMetadata: { originalName: filename, source: usedProvider.vendor, model: generated.model }
        });
        finalUrl = `/api/images/${r2Key}`;
        storedInR2 = true;

        if (env.DB) {
          await ensureMediaTable(env.DB);
          await env.DB.prepare(`
            INSERT OR REPLACE INTO media_items (id, key, url, filename, mimeType, size, uploadedAt, uploadedBy, tag)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            r2Key,
            r2Key,
            finalUrl,
            filename,
            mimeType,
            generated.bytes.byteLength,
            new Date().toISOString(),
            body.createdBy || "AI Studio",
            "ai-generated"
          ).run().catch(() => {});
        }
      } catch (storageErr) {}
    }

    return jsonResp({
      success: true,
      url: finalUrl,
      key: storedInR2 ? r2Key : null,
      storedInR2,
      mimeType,
      size: generated.bytes.byteLength,
      providerId: usedProvider.id,
      providerLabel: usedProvider.label,
      model: generated.model,
      usedFallback,
      fallbackErrors: usedFallback ? errors : [],
      aspectRatio,
      prompt
    });
  }

  return jsonResp({ error: `Unknown action: ${action}` }, 400);
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}
