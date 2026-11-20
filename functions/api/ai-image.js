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
const PROVIDERS_SETTING_KEY = "ai_api_providers";
const LEGACY_SETTING_KEY = "gemini_ai_config";

const BUILTIN_POLLINATIONS = {
  id: "builtin_pollinations",
  vendor: "pollinations",
  adapter: "pollinations",
  label: "Pollinations.ai (Free FLUX Image)",
  apiKey: "",
  accountId: "",
  baseUrl: "https://image.pollinations.ai",
  textModel: "",
  imageModel: "flux",
  supportsText: false,
  supportsImage: true,
  enabled: true,
  isDefaultImage: true,
  isDefaultText: false,
  builtIn: true
};

const BUILTIN_POLLINATIONS_TEXT = {
  id: "builtin_pollinations_text",
  vendor: "pollinations_text",
  adapter: "pollinations_text",
  label: "Pollinations Text AI (Free Writer & Help)",
  apiKey: "",
  accountId: "",
  baseUrl: "https://text.pollinations.ai/openai",
  textModel: "openai",
  imageModel: "",
  supportsText: true,
  supportsImage: false,
  enabled: true,
  isDefaultImage: false,
  isDefaultText: false,
  builtIn: true
};

const BUILTIN_AIHORDE = {
  id: "builtin_aihorde",
  vendor: "aihorde",
  adapter: "aihorde",
  label: "AI Horde (100% Free GPU Cluster)",
  apiKey: "",
  accountId: "",
  baseUrl: "https://aihorde.net/api/v2",
  textModel: "koboldcpp",
  imageModel: "Deliberate",
  supportsText: false,
  supportsImage: true,
  enabled: true,
  isDefaultImage: false,
  isDefaultText: false,
  builtIn: true
};

const BUILTIN_LIST = [BUILTIN_POLLINATIONS, BUILTIN_POLLINATIONS_TEXT, BUILTIN_AIHORDE];

const VENDOR_DEFAULTS = {
  pollinations: { adapter: "pollinations", baseUrl: "https://image.pollinations.ai", imageModel: "flux", textModel: "" },
  pollinations_turbo: { adapter: "pollinations", baseUrl: "https://image.pollinations.ai", imageModel: "turbo", textModel: "" },
  pollinations_gpt: { adapter: "pollinations", baseUrl: "https://image.pollinations.ai", imageModel: "gptimage", textModel: "" },
  pollinations_text: { adapter: "pollinations_text", baseUrl: "https://text.pollinations.ai/openai", imageModel: "", textModel: "openai" },
  aihorde: { adapter: "aihorde", baseUrl: "https://aihorde.net/api/v2", imageModel: "Deliberate", textModel: "koboldcpp" },
  aihorde_sdxl: { adapter: "aihorde", baseUrl: "https://aihorde.net/api/v2", imageModel: "SDXL 1.0", textModel: "" },
  cloudflare: { adapter: "cloudflare", baseUrl: "https://api.cloudflare.com/client/v4", imageModel: "@cf/black-forest-labs/flux-1-schnell", textModel: "@cf/meta/llama-3.3-70b-instruct-fp8-fast" },
  huggingface: { adapter: "huggingface", baseUrl: "https://router.huggingface.co", imageModel: "black-forest-labs/FLUX.1-schnell", textModel: "meta-llama/Llama-3.3-70B-Instruct" },
  gemini: { adapter: "gemini", baseUrl: "https://generativelanguage.googleapis.com/v1beta", imageModel: "gemini-nano-banana-2.1", textModel: "gemini-3.8-flash" },
  groq: { adapter: "openai_compat", baseUrl: "https://api.groq.com/openai/v1", imageModel: "", textModel: "llama-3.3-70b-versatile" },
  cerebras: { adapter: "openai_compat", baseUrl: "https://api.cerebras.ai/v1", imageModel: "", textModel: "llama-3.3-70b" },
  sambanova: { adapter: "openai_compat", baseUrl: "https://api.sambanova.ai/v1", imageModel: "", textModel: "Meta-Llama-3.3-70B-Instruct" },
  openrouter: { adapter: "openai_compat", baseUrl: "https://openrouter.ai/api/v1", imageModel: "", textModel: "meta-llama/llama-3.3-70b-instruct:free" },
  github_models: { adapter: "openai_compat", baseUrl: "https://models.inference.ai.azure.com", imageModel: "", textModel: "gpt-4o-mini" },
  nvidia_nim: { adapter: "openai_compat", baseUrl: "https://integrate.api.nvidia.com/v1", imageModel: "", textModel: "meta/llama-3.3-70b-instruct" },
  mistral: { adapter: "openai_compat", baseUrl: "https://api.mistral.ai/v1", imageModel: "", textModel: "mistral-small-latest" },
  cohere: { adapter: "cohere", baseUrl: "https://api.cohere.com/v2", imageModel: "", textModel: "command-a-03-2025" },
  together: { adapter: "openai_compat", baseUrl: "https://api.together.xyz/v1", imageModel: "black-forest-labs/FLUX.1-schnell-Free", textModel: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free" },
  siliconflow: { adapter: "openai_compat", baseUrl: "https://api.siliconflow.cn/v1", imageModel: "black-forest-labs/FLUX.1-schnell", textModel: "Qwen/Qwen2.5-7B-Instruct" },
  chutes: { adapter: "openai_compat", baseUrl: "https://llm.chutes.ai/v1", imageModel: "", textModel: "deepseek-ai/DeepSeek-V3-0324" },
  zhipu: { adapter: "openai_compat", baseUrl: "https://open.bigmodel.cn/api/paas/v4", imageModel: "", textModel: "glm-4-flash" },
  dashscope: { adapter: "openai_compat", baseUrl: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1", imageModel: "", textModel: "qwen-plus" },
  scaleway: { adapter: "openai_compat", baseUrl: "https://api.scaleway.ai/v1", imageModel: "", textModel: "llama-3.3-70b-instruct" },
  nebius: { adapter: "openai_compat", baseUrl: "https://api.studio.nebius.ai/v1", imageModel: "black-forest-labs/flux-schnell", textModel: "meta-llama/Llama-3.3-70B-Instruct" },
  fireworks: { adapter: "openai_compat", baseUrl: "https://api.fireworks.ai/inference/v1", imageModel: "", textModel: "accounts/fireworks/models/llama-v3p3-70b-instruct" },
  hyperbolic: { adapter: "openai_compat", baseUrl: "https://api.hyperbolic.xyz/v1", imageModel: "", textModel: "meta-llama/Llama-3.3-70B-Instruct" },
  novita: { adapter: "openai_compat", baseUrl: "https://api.novita.ai/v3/openai", imageModel: "", textModel: "meta-llama/llama-3.3-70b-instruct" },
  kluster: { adapter: "openai_compat", baseUrl: "https://api.kluster.ai/v1", imageModel: "", textModel: "klusterai/Meta-Llama-3.3-70B-Instruct-Turbo" },
  inference_net: { adapter: "openai_compat", baseUrl: "https://api.inference.net/v1", imageModel: "", textModel: "meta-llama/llama-3.3-70b-instruct/fp-8" },
  deepinfra: { adapter: "openai_compat", baseUrl: "https://api.deepinfra.com/v1/openai", imageModel: "black-forest-labs/FLUX-1-schnell", textModel: "meta-llama/Llama-3.3-70B-Instruct" },
  segmind: { adapter: "segmind", baseUrl: "https://api.segmind.com/v1", imageModel: "flux-1-schnell", textModel: "" },
  getimg: { adapter: "getimg", baseUrl: "https://api.getimg.ai/v1", imageModel: "flux-schnell", textModel: "" },
  clipdrop: { adapter: "clipdrop", baseUrl: "https://clipdrop-api.co", imageModel: "text-to-image-v1", textModel: "" },
  leonardo: { adapter: "leonardo", baseUrl: "https://cloud.leonardo.ai/api/rest/v1", imageModel: "b24e16ff-06e3-43eb-8d33-4416c2d75876", textModel: "" },
  prodia: { adapter: "prodia", baseUrl: "https://inference.prodia.com/v2", imageModel: "inference.flux-fast.schnell.txt2img.v2", textModel: "" },
  runware: { adapter: "runware", baseUrl: "https://api.runware.ai/v1", imageModel: "runware:100@1", textModel: "" },
  recraft: { adapter: "openai_compat", baseUrl: "https://external.api.recraft.ai/v1", imageModel: "recraftv3", textModel: "" },
  fal: { adapter: "fal", baseUrl: "https://fal.run", imageModel: "fal-ai/flux/schnell", textModel: "" },
  replicate: { adapter: "replicate", baseUrl: "https://api.replicate.com/v1", imageModel: "black-forest-labs/flux-schnell", textModel: "" },
  stability: { adapter: "stability", baseUrl: "https://api.stability.ai/v2beta", imageModel: "core", textModel: "" },
  modelslab: { adapter: "modelslab", baseUrl: "https://modelslab.com/api/v6/images/text2img", imageModel: "flux", textModel: "" },
  aimlapi: { adapter: "openai_compat", baseUrl: "https://api.aimlapi.com/v1", imageModel: "flux/schnell", textModel: "gpt-4o-mini" },
  electronhub: { adapter: "openai_compat", baseUrl: "https://api.electronhub.ai/v1", imageModel: "flux-schnell", textModel: "gpt-4o-mini" },
  nagaai: { adapter: "openai_compat", baseUrl: "https://api.naga.ac/v1", imageModel: "flux-schnell", textModel: "gpt-4o-mini" },
  venice: { adapter: "openai_compat", baseUrl: "https://api.venice.ai/api/v1", imageModel: "fluently-xl", textModel: "llama-3.3-70b" },
  upstage: { adapter: "openai_compat", baseUrl: "https://api.upstage.ai/v1/solar", imageModel: "", textModel: "solar-pro" },
  ai21: { adapter: "openai_compat", baseUrl: "https://api.ai21.com/studio/v1", imageModel: "", textModel: "jamba-mini" },
  glama: { adapter: "openai_compat", baseUrl: "https://glama.ai/api/gateway/openai/v1", imageModel: "", textModel: "gpt-4o-mini" },
  requesty: { adapter: "openai_compat", baseUrl: "https://router.requesty.ai/v1", imageModel: "", textModel: "openai/gpt-4o-mini" },
  featherless: { adapter: "openai_compat", baseUrl: "https://api.featherless.ai/v1", imageModel: "", textModel: "meta-llama/Llama-3.3-70B-Instruct" },
  bfl: { adapter: "bfl", baseUrl: "https://api.bfl.ml/v1", imageModel: "flux-pro-1.1", textModel: "" },
  ideogram: { adapter: "ideogram", baseUrl: "https://api.ideogram.ai", imageModel: "V_2_TURBO", textModel: "" },
  openai: { adapter: "openai_compat", baseUrl: "https://api.openai.com/v1", imageModel: "gpt-image-1", textModel: "gpt-4o-mini" },
  anthropic: { adapter: "anthropic", baseUrl: "https://api.anthropic.com/v1", imageModel: "", textModel: "claude-sonnet-4-20250514" },
  deepseek: { adapter: "openai_compat", baseUrl: "https://api.deepseek.com/v1", imageModel: "", textModel: "deepseek-chat" },
  xai: { adapter: "openai_compat", baseUrl: "https://api.x.ai/v1", imageModel: "grok-2-image", textModel: "grok-3-mini" },
  perplexity: { adapter: "openai_compat", baseUrl: "https://api.perplexity.ai", imageModel: "", textModel: "sonar" },
  moonshot: { adapter: "openai_compat", baseUrl: "https://api.moonshot.ai/v1", imageModel: "", textModel: "kimi-k2-0711-preview" },
  poe: { adapter: "openai_compat", baseUrl: "https://api.poe.com/v1", imageModel: "", textModel: "Claude-Sonnet-4" },
  ollama: { adapter: "openai_compat", baseUrl: "", imageModel: "", textModel: "llama3.2" },
  custom: { adapter: "openai_compat", baseUrl: "", imageModel: "", textModel: "gpt-4o-mini" }
};

const RATIO_DIMS = {
  "16:9": { w: 1280, h: 720, openaiSize: "1536x1024", dalleSize: "1792x1024", ideoRatio: "ASPECT_16_9" },
  "3:2": { w: 1200, h: 800, openaiSize: "1536x1024", dalleSize: "1792x1024", ideoRatio: "ASPECT_3_2" },
  "4:3": { w: 1152, h: 864, openaiSize: "1536x1024", dalleSize: "1024x1024", ideoRatio: "ASPECT_4_3" },
  "1:1": { w: 1024, h: 1024, openaiSize: "1024x1024", dalleSize: "1024x1024", ideoRatio: "ASPECT_1_1" },
  "9:16": { w: 720, h: 1280, openaiSize: "1024x1536", dalleSize: "1024x1792", ideoRatio: "ASPECT_9_16" }
};

function jsonResp(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function maskKey(k) {
  if (!k || typeof k !== "string") return "";
  const t = k.trim();
  if (t.length <= 8) return "••••";
  return t.slice(0, 6) + "••••" + t.slice(-4);
}

function sanitizeProviderForClient(p) {
  const def = VENDOR_DEFAULTS[p.vendor] || {};
  return {
    id: p.id,
    vendor: p.vendor,
    adapter: p.adapter || def.adapter || "openai_compat",
    label: p.label,
    hasKey: Boolean(p.apiKey && p.apiKey.trim().length > 0),
    maskedKey: maskKey(p.apiKey),
    accountId: p.accountId || "",
    baseUrl: p.baseUrl || def.baseUrl || "",
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

async function ensureSettingsTable(db) {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updatedAt TEXT,
      updatedBy TEXT
    )
  `).run();
}

async function ensureMediaTable(db) {
  await db.prepare(`
    CREATE TABLE IF NOT EXISTS media_items (
      id TEXT PRIMARY KEY,
      key TEXT UNIQUE NOT NULL,
      url TEXT NOT NULL,
      filename TEXT NOT NULL,
      mimeType TEXT,
      size INTEGER DEFAULT 0,
      uploadedAt TEXT,
      uploadedBy TEXT,
      tag TEXT
    )
  `).run();
}

async function loadProviders(env) {
  let list = [];
  if (env && env.DB) {
    try {
      await ensureSettingsTable(env.DB);
      const row = await env.DB.prepare("SELECT value FROM settings WHERE key = ?").bind(PROVIDERS_SETTING_KEY).first();
      if (row && row.value) {
        const parsed = JSON.parse(row.value);
        if (Array.isArray(parsed)) list = parsed;
      }
      if (list.length === 0) {
        const legacy = await env.DB.prepare("SELECT value FROM settings WHERE key = ?").bind(LEGACY_SETTING_KEY).first();
        if (legacy && legacy.value) {
          const parsedLegacy = JSON.parse(legacy.value);
          if (parsedLegacy && parsedLegacy.apiKey) {
            list.push({
              id: "prov_gemini_migrated",
              vendor: "gemini",
              adapter: "gemini",
              label: "Google Gemini",
              apiKey: String(parsedLegacy.apiKey).trim(),
              accountId: "",
              baseUrl: "https://generativelanguage.googleapis.com/v1beta",
              textModel: parsedLegacy.textModel || "gemini-3.8-flash",
              imageModel: parsedLegacy.imageModel || "gemini-nano-banana-2.1",
              supportsText: true,
              supportsImage: false,
              enabled: true,
              isDefaultText: true,
              isDefaultImage: false,
              builtIn: false
            });
          }
        }
      }
    } catch (e) {}
  }

  for (const b of BUILTIN_LIST) {
    if (!list.some(p => p.id === b.id)) {
      list.push({
        ...b,
        isDefaultImage: b.id === BUILTIN_POLLINATIONS.id ? !list.some(p => p.supportsImage && p.isDefaultImage) : false,
        isDefaultText: b.id === BUILTIN_POLLINATIONS_TEXT.id ? !list.some(p => p.supportsText && p.isDefaultText) : false
      });
    }
  }

  if (env && env.GEMINI_API_KEY && !list.some(p => p.vendor === "gemini")) {
    list.push({
      id: "prov_gemini_env",
      vendor: "gemini",
      adapter: "gemini",
      label: "Google Gemini (Env)",
      apiKey: String(env.GEMINI_API_KEY).trim(),
      accountId: "",
      baseUrl: "https://generativelanguage.googleapis.com/v1beta",
      textModel: "gemini-3.8-flash",
      imageModel: "gemini-nano-banana-2.1",
      supportsText: true,
      supportsImage: false,
      enabled: true,
      isDefaultText: !list.some(p => p.supportsText && p.isDefaultText && !p.builtIn),
      isDefaultImage: false,
      builtIn: false
    });
  }

  if (!list.some(p => p.enabled !== false && p.supportsText && p.isDefaultText)) {
    const firstTxt = list.find(p => p.enabled !== false && p.supportsText);
    if (firstTxt) firstTxt.isDefaultText = true;
  }
  if (!list.some(p => p.enabled !== false && p.supportsImage && p.isDefaultImage)) {
    const firstImg = list.find(p => p.enabled !== false && p.supportsImage);
    if (firstImg) firstImg.isDefaultImage = true;
  }

  return list;
}

async function saveProviders(env, list, updatedBy = "Administrator") {
  if (!env || !env.DB) return;
  await ensureSettingsTable(env.DB);
  await env.DB.prepare(`
    INSERT INTO settings (key, value, updatedAt, updatedBy)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET
      value = excluded.value,
      updatedAt = excluded.updatedAt,
      updatedBy = excluded.updatedBy
  `).bind(PROVIDERS_SETTING_KEY, JSON.stringify(list), new Date().toISOString(), updatedBy).run();
}

function base64ToUint8Array(base64) {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function uint8ToBase64(bytes) {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function extractGeminiText(data) {
  if (!data || typeof data !== "object") return "";
  const chunks = [];
  if (Array.isArray(data.outputs)) {
    for (const out of data.outputs) {
      if (out && out.type === "text" && typeof out.text === "string") chunks.push(out.text);
    }
  }
  if (chunks.length === 0 && Array.isArray(data.steps)) {
    for (const step of data.steps) {
      if (step && step.type === "model_output" && Array.isArray(step.content)) {
        for (const block of step.content) {
          if (block && block.type === "text" && typeof block.text === "string") chunks.push(block.text);
        }
      }
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

function getAdapter(provider) {
  if (provider.adapter) return provider.adapter;
  const def = VENDOR_DEFAULTS[provider.vendor];
  return (def && def.adapter) || "openai_compat";
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

async function runTextWithProvider(provider, messages, options = {}) {
  const adapter = getAdapter(provider);
  const def = VENDOR_DEFAULTS[provider.vendor] || {};
  const apiKey = String(provider.apiKey || "").trim();
  const maxTokens = options.maxTokens || 1400;
  const temperature = options.temperature !== undefined ? options.temperature : 0.7;

  const msgList = Array.isArray(messages)
    ? messages
    : [{ role: "user", content: String(messages || "") }];
  const systemText = msgList.filter(m => m.role === "system").map(m => m.content).join("\n\n");
  const convoMsgs = msgList.filter(m => m.role !== "system");
  const flatPrompt = [systemText, ...convoMsgs.map(m => (m.role === "assistant" ? `Assistant: ${m.content}` : `User: ${m.content}`))].filter(Boolean).join("\n\n");

  if (adapter === "pollinations_text") {
    const model = provider.textModel || def.textModel || "openai";
    const endpoint = apiKey
      ? "https://gen.pollinations.ai/v1/chat/completions"
      : String(provider.baseUrl || "https://text.pollinations.ai/openai").replace(/\/+$/, "");
    const headers = { "Content-Type": "application/json" };
    if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;
    const res = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({ model, messages: msgList, temperature, max_tokens: maxTokens })
    });
    const data = await res.json().catch(() => ({}));
    const text = data?.choices?.[0]?.message?.content || "";
    if (!res.ok || !text) throw new Error(data?.error?.message || data?.message || `Pollinations Text HTTP ${res.status}`);
    return { text: String(text).trim(), model: `pollinations/${model}` };
  }

  if (adapter === "gemini") {
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
        body: JSON.stringify({ model, input: [{ type: "text", text: flatPrompt }], store: false })
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

  if (adapter === "anthropic") {
    if (!apiKey) throw new Error("Anthropic API key missing");
    const model = provider.textModel || def.textModel || "claude-sonnet-4-20250514";
    const base = String(provider.baseUrl || "https://api.anthropic.com/v1").replace(/\/+$/, "");
    const payload = {
      model,
      max_tokens: maxTokens,
      messages: convoMsgs.length ? convoMsgs : [{ role: "user", content: flatPrompt }]
    };
    if (systemText) payload.system = systemText;
    const res = await fetch(`${base}/messages`, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({}));
    const text = Array.isArray(data?.content) ? data.content.filter(b => b.type === "text").map(b => b.text).join("\n").trim() : "";
    if (!res.ok || !text) throw new Error(data?.error?.message || `Anthropic HTTP ${res.status}`);
    return { text, model };
  }

  if (adapter === "cohere") {
    if (!apiKey) throw new Error("Cohere API key missing");
    const model = provider.textModel || def.textModel || "command-a-03-2025";
    const base = String(provider.baseUrl || "https://api.cohere.com/v2").replace(/\/+$/, "");
    const res = await fetch(`${base}/chat`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model, messages: msgList, max_tokens: maxTokens, temperature })
    });
    const data = await res.json().catch(() => ({}));
    const text = data?.message?.content?.[0]?.text || "";
    if (!res.ok || !text) throw new Error(data?.message || `Cohere HTTP ${res.status}`);
    return { text: String(text).trim(), model };
  }

  if (adapter === "cloudflare") {
    if (!provider.accountId || !apiKey) throw new Error("Cloudflare Account ID and API Token required");
    const model = provider.textModel || def.textModel || "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(provider.accountId)}/ai/run/${model}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ messages: msgList, max_tokens: maxTokens })
    });
    const data = await res.json().catch(() => ({}));
    const text = data?.result?.response || data?.result?.choices?.[0]?.message?.content || "";
    if (!res.ok || !text) throw new Error(data?.errors?.[0]?.message || `Cloudflare AI HTTP ${res.status}`);
    return { text: String(text).trim(), model };
  }

  if (adapter === "huggingface") {
    if (!apiKey) throw new Error("Hugging Face token missing");
    const model = provider.textModel || def.textModel || "meta-llama/Llama-3.3-70B-Instruct";
    const res = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model, messages: msgList, max_tokens: maxTokens, temperature })
    });
    const data = await res.json().catch(() => ({}));
    const text = data?.choices?.[0]?.message?.content || "";
    if (!res.ok || !text) throw new Error(data?.error?.message || data?.error || `Hugging Face HTTP ${res.status}`);
    return { text: String(text).trim(), model };
  }

  if (adapter === "aihorde") {
    const hordeKey = apiKey || "0000000000";
    const subRes = await fetch("https://aihorde.net/api/v2/generate/text/async", {
      method: "POST",
      headers: { apikey: hordeKey, "Client-Agent": "CRII-Portal:2.0:curiomas.zone.id", "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: flatPrompt.slice(0, 3500) + "\n\nAssistant:", params: { max_length: Math.min(maxTokens, 512), temperature } })
    });
    const subData = await subRes.json().catch(() => ({}));
    if (!subRes.ok || !subData.id) throw new Error(subData?.message || `AI Horde Text HTTP ${subRes.status}`);
    for (let attempt = 0; attempt < 18; attempt++) {
      await sleep(1500);
      const stRes = await fetch(`https://aihorde.net/api/v2/generate/text/status/${subData.id}`, {
        headers: { "Client-Agent": "CRII-Portal:2.0:curiomas.zone.id" }
      });
      const stData = await stRes.json().catch(() => ({}));
      if (stData.done && Array.isArray(stData.generations) && stData.generations[0]?.text) {
        return { text: String(stData.generations[0].text).trim(), model: stData.generations[0].model || "aihorde-llm" };
      }
      if (stData.faulted) throw new Error("AI Horde text worker faulted");
    }
    throw new Error("AI Horde text generation timed out");
  }

  const base = String(provider.baseUrl || def.baseUrl || "").replace(/\/+$/, "");
  if (!base) throw new Error(`${provider.label} Base URL missing`);
  if (!apiKey && provider.vendor !== "ollama" && provider.vendor !== "custom") {
    throw new Error(`${provider.label} API key missing`);
  }
  const model = provider.textModel || def.textModel || "gpt-4o-mini";
  const headers = { "Content-Type": "application/json" };
  if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;
  if (provider.vendor === "openrouter") {
    headers["HTTP-Referer"] = "https://www.curiomas.zone.id";
    headers["X-Title"] = "CRII Research Portal";
  }
  const endpoint = base.endsWith("/chat/completions") ? base : `${base}/chat/completions`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({ model, messages: msgList, temperature, max_tokens: maxTokens })
  });
  const data = await res.json().catch(() => ({}));
  const text = data?.choices?.[0]?.message?.content || "";
  if (!res.ok || !text) throw new Error(data?.error?.message || data?.message || `${provider.label} HTTP ${res.status}`);
  return { text: String(text).trim(), model };
}

async function fetchImageUrlToBytes(url, headers = {}) {
  const imgRes = await fetch(url, { headers });
  if (!imgRes.ok) throw new Error(`Failed to fetch generated image (${imgRes.status})`);
  const ct = imgRes.headers.get("content-type") || "image/jpeg";
  const buf = new Uint8Array(await imgRes.arrayBuffer());
  if (buf.byteLength < 512) throw new Error("Generated image payload was empty");
  return { bytes: buf, mimeType: ct.split(";")[0] };
}

async function runImageWithProvider(provider, prompt, aspectRatio, imageSize) {
  const adapter = getAdapter(provider);
  const def = VENDOR_DEFAULTS[provider.vendor] || {};
  const apiKey = String(provider.apiKey || "").trim();
  const dims = RATIO_DIMS[aspectRatio] || RATIO_DIMS["16:9"];
  const scale = imageSize === "2K" ? 1.25 : 1;
  const width = Math.round((dims.w * scale) / 16) * 16;
  const height = Math.round((dims.h * scale) / 16) * 16;

  if (adapter === "pollinations") {
    const model = provider.imageModel || def.imageModel || "flux";
    const seed = Math.floor(Math.random() * 10000000);
    const cleanPrompt = prompt.slice(0, 950);
    const url = apiKey
      ? `https://gen.pollinations.ai/image/${encodeURIComponent(cleanPrompt)}?width=${width}&height=${height}&model=${encodeURIComponent(model)}&nologo=true&seed=${seed}`
      : `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=${width}&height=${height}&model=${encodeURIComponent(model)}&nologo=true&seed=${seed}`;
    const headers = { "User-Agent": "curiomas-crii-portal/2.0" };
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

  if (adapter === "aihorde") {
    const hordeKey = apiKey || "0000000000";
    const isAnon = hordeKey === "0000000000";
    const model = provider.imageModel || def.imageModel || "Deliberate";
    const hw = isAnon ? (aspectRatio === "9:16" ? 384 : 512) : Math.min(1024, Math.round(dims.w / 64) * 64);
    const hh = isAnon ? (aspectRatio === "16:9" ? 320 : aspectRatio === "4:3" || aspectRatio === "3:2" ? 384 : 512) : Math.min(1024, Math.round(dims.h / 64) * 64);
    const subRes = await fetch("https://aihorde.net/api/v2/generate/async", {
      method: "POST",
      headers: { apikey: hordeKey, "Client-Agent": "CRII-Portal:2.0:curiomas.zone.id", "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        models: [model],
        nsfw: false,
        censor_nsfw: true,
        r2: true,
        params: { width: hw, height: hh, steps: isAnon ? 20 : 25, n: 1 }
      })
    });
    const subData = await subRes.json().catch(() => ({}));
    if (!subRes.ok || !subData.id) throw new Error(subData?.message || `AI Horde HTTP ${subRes.status}`);
    for (let i = 0; i < 16; i++) {
      await sleep(1600);
      const chk = await fetch(`https://aihorde.net/api/v2/generate/check/${subData.id}`, {
        headers: { "Client-Agent": "CRII-Portal:2.0:curiomas.zone.id" }
      }).then(r => r.json()).catch(() => ({}));
      if (chk.faulted) throw new Error("AI Horde worker faulted");
      if (chk.done) {
        const st = await fetch(`https://aihorde.net/api/v2/generate/status/${subData.id}`, {
          headers: { "Client-Agent": "CRII-Portal:2.0:curiomas.zone.id" }
        }).then(r => r.json()).catch(() => ({}));
        const gen = st?.generations?.[0];
        if (gen && gen.img) {
          if (gen.img.startsWith("http")) {
            const fetched = await fetchImageUrlToBytes(gen.img);
            return { ...fetched, model: `aihorde/${gen.model || model}` };
          }
          return { bytes: base64ToUint8Array(gen.img), mimeType: "image/webp", model: `aihorde/${gen.model || model}` };
        }
      }
    }
    throw new Error("AI Horde queue busy (try again or add a free personal key from stablehorde.net)");
  }

  if (adapter === "cloudflare") {
    if (!provider.accountId || !apiKey) throw new Error("Cloudflare Account ID and API Token required");
    const model = provider.imageModel || def.imageModel || "@cf/black-forest-labs/flux-1-schnell";
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

  if (adapter === "huggingface") {
    if (!apiKey) throw new Error("Hugging Face token missing");
    const model = provider.imageModel || def.imageModel || "black-forest-labs/FLUX.1-schnell";
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

  if (adapter === "segmind") {
    if (!apiKey) throw new Error("Segmind API key missing");
    const model = provider.imageModel || def.imageModel || "flux-1-schnell";
    const res = await fetch(`https://api.segmind.com/v1/${encodeURIComponent(model)}`, {
      method: "POST",
      headers: { "x-api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, steps: 4, aspect_ratio: aspectRatio, base64: false })
    });
    const ct = res.headers.get("content-type") || "";
    if (!res.ok || !ct.startsWith("image/")) {
      const txt = await res.text().catch(() => "");
      throw new Error(txt.slice(0, 220) || `Segmind HTTP ${res.status}`);
    }
    return { bytes: new Uint8Array(await res.arrayBuffer()), mimeType: ct.split(";")[0], model };
  }

  if (adapter === "clipdrop") {
    if (!apiKey) throw new Error("Clipdrop API key missing");
    const fd = new FormData();
    fd.append("prompt", prompt);
    const res = await fetch("https://clipdrop-api.co/text-to-image/v1", {
      method: "POST",
      headers: { "x-api-key": apiKey },
      body: fd
    });
    const ct = res.headers.get("content-type") || "";
    if (!res.ok || !ct.startsWith("image/")) {
      const txt = await res.text().catch(() => "");
      throw new Error(txt.slice(0, 220) || `Clipdrop HTTP ${res.status}`);
    }
    return { bytes: new Uint8Array(await res.arrayBuffer()), mimeType: ct.split(";")[0], model: "clipdrop-v1" };
  }

  if (adapter === "getimg") {
    if (!apiKey) throw new Error("GetImg.ai API key missing");
    const model = provider.imageModel || def.imageModel || "flux-schnell";
    const res = await fetch(`https://api.getimg.ai/v1/${encodeURIComponent(model)}/text-to-image`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, width: Math.min(1024, dims.w), height: Math.min(1024, dims.h), output_format: "jpeg", response_format: "b64" })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.image) throw new Error(data?.error?.message || `GetImg HTTP ${res.status}`);
    return { bytes: base64ToUint8Array(data.image), mimeType: "image/jpeg", model };
  }

  if (adapter === "prodia") {
    if (!apiKey) throw new Error("Prodia API key missing");
    const model = provider.imageModel || def.imageModel || "inference.flux-fast.schnell.txt2img.v2";
    const res = await fetch("https://inference.prodia.com/v2/job", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, Accept: "image/jpeg", "Content-Type": "application/json" },
      body: JSON.stringify({ type: model, config: { prompt, width: Math.min(1024, dims.w), height: Math.min(1024, dims.h) } })
    });
    const ct = res.headers.get("content-type") || "";
    if (!res.ok || !ct.startsWith("image/")) {
      const txt = await res.text().catch(() => "");
      throw new Error(txt.slice(0, 220) || `Prodia HTTP ${res.status}`);
    }
    return { bytes: new Uint8Array(await res.arrayBuffer()), mimeType: ct.split(";")[0], model };
  }

  if (adapter === "runware") {
    if (!apiKey) throw new Error("Runware API key missing");
    const model = provider.imageModel || def.imageModel || "runware:100@1";
    const rw = Math.min(1024, Math.round(dims.w / 64) * 64);
    const rh = Math.min(1024, Math.round(dims.h / 64) * 64);
    const taskUUID = crypto.randomUUID ? crypto.randomUUID() : "11111111-2222-4333-8444-555555555555";
    const res = await fetch("https://api.runware.ai/v1", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify([{ taskType: "imageInference", taskUUID, positivePrompt: prompt, model, width: rw, height: rh, numberResults: 1, outputFormat: "JPG" }])
    });
    const data = await res.json().catch(() => ({}));
    const url = data?.data?.[0]?.imageURL;
    if (!res.ok || !url) throw new Error(data?.errors?.[0]?.message || `Runware HTTP ${res.status}`);
    const fetched = await fetchImageUrlToBytes(url);
    return { ...fetched, model };
  }

  if (adapter === "fal") {
    if (!apiKey) throw new Error("fal.ai API key missing");
    const model = provider.imageModel || def.imageModel || "fal-ai/flux/schnell";
    const res = await fetch(`https://fal.run/${model}`, {
      method: "POST",
      headers: { Authorization: `Key ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, image_size: { width: Math.min(1280, dims.w), height: Math.min(1280, dims.h) }, num_images: 1 })
    });
    const data = await res.json().catch(() => ({}));
    const url = data?.images?.[0]?.url;
    if (!res.ok || !url) throw new Error(data?.detail || data?.message || `fal.ai HTTP ${res.status}`);
    const fetched = await fetchImageUrlToBytes(url);
    return { ...fetched, model };
  }

  if (adapter === "replicate") {
    if (!apiKey) throw new Error("Replicate API token missing");
    const model = provider.imageModel || def.imageModel || "black-forest-labs/flux-schnell";
    const res = await fetch(`https://api.replicate.com/v1/models/${model}/predictions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", Prefer: "wait=50" },
      body: JSON.stringify({ input: { prompt, aspect_ratio: aspectRatio, output_format: "jpg" } })
    });
    const data = await res.json().catch(() => ({}));
    const out = Array.isArray(data?.output) ? data.output[0] : data?.output;
    if (!res.ok || !out) throw new Error(data?.detail || data?.error || `Replicate HTTP ${res.status}`);
    const fetched = await fetchImageUrlToBytes(out);
    return { ...fetched, model };
  }

  if (adapter === "bfl") {
    if (!apiKey) throw new Error("Black Forest Labs API key missing");
    const model = provider.imageModel || def.imageModel || "flux-pro-1.1";
    const subRes = await fetch(`https://api.bfl.ml/v1/${encodeURIComponent(model)}`, {
      method: "POST",
      headers: { "x-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, width: Math.min(1280, Math.round(dims.w / 32) * 32), height: Math.min(1280, Math.round(dims.h / 32) * 32) })
    });
    const subData = await subRes.json().catch(() => ({}));
    if (!subRes.ok || !subData.id) throw new Error(subData?.detail || `BFL HTTP ${subRes.status}`);
    for (let i = 0; i < 16; i++) {
      await sleep(1200);
      const st = await fetch(`https://api.bfl.ml/v1/get_result?id=${encodeURIComponent(subData.id)}`, {
        headers: { "x-key": apiKey }
      }).then(r => r.json()).catch(() => ({}));
      if (st.status === "Ready" && st.result?.sample) {
        const fetched = await fetchImageUrlToBytes(st.result.sample);
        return { ...fetched, model };
      }
      if (st.status === "Error" || st.status === "Failed") throw new Error("BFL image generation failed");
    }
    throw new Error("Black Forest Labs generation timed out");
  }

  if (adapter === "ideogram") {
    if (!apiKey) throw new Error("Ideogram API key missing");
    const model = provider.imageModel || def.imageModel || "V_2_TURBO";
    const res = await fetch("https://api.ideogram.ai/generate", {
      method: "POST",
      headers: { "Api-Key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ image_request: { prompt, aspect_ratio: dims.ideoRatio || "ASPECT_16_9", model } })
    });
    const data = await res.json().catch(() => ({}));
    const url = data?.data?.[0]?.url;
    if (!res.ok || !url) throw new Error(data?.message || `Ideogram HTTP ${res.status}`);
    const fetched = await fetchImageUrlToBytes(url);
    return { ...fetched, model };
  }

  if (adapter === "leonardo") {
    if (!apiKey) throw new Error("Leonardo.ai API key missing");
    const modelId = provider.imageModel || def.imageModel || "b24e16ff-06e3-43eb-8d33-4416c2d75876";
    const subRes = await fetch("https://cloud.leonardo.ai/api/rest/v1/generations", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, modelId, width: Math.min(1024, Math.round(dims.w / 8) * 8), height: Math.min(1024, Math.round(dims.h / 8) * 8), num_images: 1 })
    });
    const subData = await subRes.json().catch(() => ({}));
    const genId = subData?.sdGenerationJob?.generationId;
    if (!subRes.ok || !genId) throw new Error(subData?.error || `Leonardo HTTP ${subRes.status}`);
    for (let i = 0; i < 16; i++) {
      await sleep(1500);
      const st = await fetch(`https://cloud.leonardo.ai/api/rest/v1/generations/${genId}`, {
        headers: { Authorization: `Bearer ${apiKey}` }
      }).then(r => r.json()).catch(() => ({}));
      const url = st?.generations_by_pk?.generated_images?.[0]?.url;
      if (url) {
        const fetched = await fetchImageUrlToBytes(url);
        return { ...fetched, model: "leonardo" };
      }
      if (st?.generations_by_pk?.status === "FAILED") throw new Error("Leonardo generation failed");
    }
    throw new Error("Leonardo generation timed out");
  }

  if (adapter === "modelslab") {
    if (!apiKey) throw new Error("ModelsLab API key missing");
    const model = provider.imageModel || def.imageModel || "flux";
    const res = await fetch("https://modelslab.com/api/v6/images/text2img", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: apiKey, model_id: model, prompt, width: Math.min(1024, dims.w), height: Math.min(1024, dims.h), samples: 1 })
    });
    const data = await res.json().catch(() => ({}));
    const url = data?.output?.[0];
    if (!res.ok || !url) throw new Error(data?.message || data?.messege || `ModelsLab HTTP ${res.status}`);
    const fetched = await fetchImageUrlToBytes(url);
    return { ...fetched, model };
  }

  if (adapter === "stability") {
    if (!apiKey) throw new Error("Stability AI key missing");
    const model = provider.imageModel || def.imageModel || "core";
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
    const ct = res.headers.get("content-type") || "";
    if (!res.ok || !ct.startsWith("image/")) {
      const errTxt = await res.text().catch(() => "");
      throw new Error(errTxt.slice(0, 220) || `Stability HTTP ${res.status}`);
    }
    return { bytes: new Uint8Array(await res.arrayBuffer()), mimeType: ct.split(";")[0], model: `stability/${model}` };
  }

  if (adapter === "gemini") {
    if (!apiKey) throw new Error("Gemini API key missing");
    const chain = [provider.imageModel, ...GEMINI_IMAGE_FALLBACKS].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i);
    let lastErr = "Gemini image generation failed";
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
          response_modalities: ["IMAGE"],
          generation_config: { image_config: { aspect_ratio: aspectRatio, image_size: imageSize } },
          response_format: { mime_type: "image/jpeg" },
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
      lastErr = data?.error?.message || `HTTP ${res.status}`;
    }
    throw new Error(lastErr);
  }

  const base = String(provider.baseUrl || def.baseUrl || "https://api.openai.com/v1").replace(/\/+$/, "");
  if (!apiKey && provider.vendor !== "custom" && provider.vendor !== "ollama") {
    throw new Error(`${provider.label} API key missing`);
  }
  const model = provider.imageModel || def.imageModel || "gpt-image-1";
  const payload = { model, prompt, n: 1 };
  if (provider.vendor === "together") {
    payload.width = Math.min(1440, dims.w);
    payload.height = Math.min(1440, dims.h);
    payload.steps = 4;
    payload.response_format = "b64_json";
  } else if (provider.vendor === "openai") {
    payload.size = model === "dall-e-3" ? dims.dalleSize : dims.openaiSize;
    if (model === "dall-e-3") payload.response_format = "b64_json";
  } else if (provider.vendor === "recraft") {
    payload.size = aspectRatio === "16:9" ? "1820x1024" : aspectRatio === "9:16" ? "1024x1820" : "1024x1024";
    payload.response_format = "b64_json";
  } else {
    payload.size = `${Math.min(1024, dims.w)}x${Math.min(1024, dims.h)}`;
    payload.response_format = "b64_json";
  }

  const headers = { "Content-Type": "application/json" };
  if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;
  const endpoint = base.endsWith("/images/generations") ? base : `${base}/images/generations`;
  const res = await fetch(endpoint, { method: "POST", headers, body: JSON.stringify(payload) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error?.message || data?.message || `${provider.label} HTTP ${res.status}`);
  const item = data?.data?.[0];
  if (item && item.b64_json) {
    return { bytes: base64ToUint8Array(item.b64_json), mimeType: "image/png", model };
  }
  if (item && item.url) {
    const fetched = await fetchImageUrlToBytes(item.url);
    return { ...fetched, model };
  }
  throw new Error(`${provider.label} returned no image payload`);
}

function getOrderedTextProviders(providers, requestedProviderId) {
  const enabled = providers.filter(p => {
    if (p.enabled === false || !p.supportsText) return false;
    const adapter = getAdapter(p);
    if (adapter === "pollinations_text" || adapter === "aihorde" || p.vendor === "ollama") return true;
    return Boolean(p.apiKey && p.apiKey.trim());
  });
  let ordered = [];
  if (requestedProviderId && requestedProviderId !== "auto") {
    const exact = enabled.find(p => p.id === requestedProviderId);
    if (exact) ordered.push(exact);
  }
  const rest = enabled
    .filter(p => !ordered.some(x => x.id === p.id))
    .sort((a, b) => {
      if (a.isDefaultText !== b.isDefaultText) return b.isDefaultText ? 1 : -1;
      if (a.builtIn !== b.builtIn) return a.builtIn ? 1 : -1;
      return 0;
    });
  ordered = [...ordered, ...rest];
  if (!ordered.some(p => p.id === BUILTIN_POLLINATIONS_TEXT.id)) {
    ordered.push(BUILTIN_POLLINATIONS_TEXT);
  }
  return ordered;
}

export async function onRequestGet(context) {
  const { env } = context;
  const providers = await loadProviders(env);
  const safeList = providers.map(sanitizeProviderForClient);
  const defaultImg = safeList.find(p => p.enabled && p.supportsImage && p.isDefaultImage) || safeList.find(p => p.enabled && p.supportsImage) || null;
  const defaultTxt = safeList.find(p => p.enabled && p.supportsText && p.isDefaultText) || safeList.find(p => p.enabled && p.supportsText) || null;

  return jsonResp({
    configured: safeList.some(p => p.enabled),
    providers: safeList,
    defaultImageProviderId: defaultImg ? defaultImg.id : null,
    defaultTextProviderId: defaultTxt ? defaultTxt.id : null
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  let body;
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

    const vendor = String(body.vendor || prev?.vendor || "custom").trim();
    const def = VENDOR_DEFAULTS[vendor] || {};

    const record = {
      id,
      vendor,
      adapter: String(body.adapter || prev?.adapter || def.adapter || "openai_compat").trim(),
      label: String(body.label || prev?.label || "Custom AI Provider").trim(),
      apiKey: rawKey,
      accountId: String(body.accountId !== undefined ? body.accountId : (prev?.accountId || "")).trim(),
      baseUrl: String(body.baseUrl !== undefined ? body.baseUrl : (prev?.baseUrl || def.baseUrl || "")).trim(),
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
    if (BUILTIN_LIST.some(b => b.id === targetId)) {
      return jsonResp({ error: "Built-in free fallback cannot be deleted (you can disable it instead)." }, 400);
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
        const res = await runTextWithProvider(target, [{ role: "user", content: "Reply with the single word OK." }], { maxTokens: 32, temperature: 0 });
        return jsonResp({ success: true, latencyMs: Date.now() - started, detail: `Text OK (${res.model})` });
      }
      if (target.supportsImage) {
        const adapter = getAdapter(target);
        if (adapter === "aihorde") {
          const chk = await fetch("https://aihorde.net/api/v2/status/models?type=image");
          const models = await chk.json().catch(() => []);
          return jsonResp({ success: true, latencyMs: Date.now() - started, detail: `AI Horde Online (${Array.isArray(models) ? models.length : 0} live GPU models)` });
        }
        const res = await runImageWithProvider(target, "Minimalist glowing blue sphere on dark background", "1:1", "1K");
        return jsonResp({ success: true, latencyMs: Date.now() - started, detail: `Image OK (${res.model}, ${Math.round(res.bytes.byteLength / 1024)} KB)` });
      }
      return jsonResp({ error: "Provider has neither text nor image enabled" }, 400);
    } catch (err) {
      const ad = getAdapter(target);
      if ((ad === "pollinations" || ad === "pollinations_text") && !target.apiKey && /402|Free limit|FREE_LIMIT/i.test(err.message || "")) {
        return jsonResp({
          success: true,
          latencyMs: Date.now() - started,
          detail: ad === "pollinations_text"
            ? "Ready via Browser-Direct Free Text AI (shared Worker IP rate-limited; add a free Groq/Cerebras/Gemini/Pollinations key for server-side)"
            : "Ready via Browser-Direct Free FLUX (shared Worker IP rate-limited; add optional key from enter.pollinations.ai for server-side)"
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

    const textProviders = getOrderedTextProviders(providers, body.providerId);

    for (let i = 0; i < textProviders.length; i++) {
      const prov = textProviders[i];
      try {
        const result = await runTextWithProvider(prov, [{ role: "user", content: synthesisInput }], { maxTokens: 450, temperature: 0.7 });
        if (result && result.text) {
          return jsonResp({
            success: true,
            prompt: result.text,
            providerLabel: prov.label,
            modelUsed: result.model,
            usedFallback: i > 0
          });
        }
      } catch (e) {}
    }

    const localPrompt = buildLocalFallbackPrompt({ title, category, excerpt, content, mode, style });
    return jsonResp({
      success: true,
      prompt: localPrompt,
      providerLabel: "CRII Local Prompt Synthesizer",
      modelUsed: "local-fallback",
      usedFallback: true
    });
  }

  if (action === "write_assist") {
    const mode = String(body.mode || "full_draft").trim();
    const title = String(body.title || "").trim();
    const category = String(body.category || "").trim();
    const tags = String(body.tags || "").trim();
    const excerpt = String(body.excerpt || "").trim();
    const content = String(body.content || "").trim().slice(0, 14000);
    const instruction = String(body.instruction || "").trim();
    const tone = String(body.tone || "Academic & Peer-Reviewed").trim();
    const length = String(body.length || "Medium").trim();

    if (!title && !excerpt && !content && !instruction) {
      return jsonResp({ error: "Provide an article title, some draft content, or a custom instruction first." }, 400);
    }

    const lengthHint = length === "Short"
      ? "Keep it concise (~250-400 words)."
      : length === "Comprehensive"
        ? "Write a thorough, publication-ready deep dive (~900-1400 words)."
        : "Aim for a well-structured medium length (~500-750 words).";

    const modePrompts = {
      full_draft: `Write a complete, well-structured scientific research article draft using Markdown headings (## for sections, ### for subsections), clear paragraphs, bullet lists where helpful, and one insightful blockquote (>). ${lengthHint}`,
      outline: "Create a rigorous academic research article outline with ## section headings, ### subheadings, and concise bullet points explaining what each section should cover.",
      continue: `Seamlessly continue writing the article from where it currently ends, maintaining the exact scientific voice, rigor, and flow. Do NOT repeat existing paragraphs. ${lengthHint}`,
      expand: `Expand and deepen the existing article content with richer scientific explanations, methodology details, concrete examples, and implications while keeping clean Markdown structure. ${lengthHint}`,
      polish: "Rewrite and polish the existing article text for publication quality: improve academic clarity, transitions, precision, and grammar while preserving all factual claims and Markdown structure.",
      simplify: "Rewrite the article so high-school and undergraduate students can understand it effortlessly, using intuitive analogies while remaining scientifically accurate.",
      abstract_tags: "Read the article and output EXACTLY in this structured format (no extra commentary):\nSUMMARY: <1-2 crisp sentences for article cards and search>\nABSTRACT: <4-6 sentence formal academic abstract covering background, methodology/findings, and significance>\nTAGS: <6 to 8 comma-separated scientific keywords>",
      key_takeaways: "Generate a crisp '## Key Takeaways & Research Impact' section with 4-6 high-signal bullet points and a concluding callout quote (>).",
      translate_bn: "Translate the article accurately into natural, scholarly Bengali (বাংলা), preserving technical scientific terminology (keeping standard English scientific terms in parentheses where appropriate) and Markdown headings.",
      translate_en: "Translate the article into polished, publication-grade academic English, preserving Markdown structure.",
      custom: instruction || "Improve and enrich this scientific research article."
    };

    const sysPrompt = `You are the senior scientific editor & research co-author for Curiomas Research & Innovation Institute (CRII). Tone: ${tone}. Output clean Markdown (## headings, ### subheadings, paragraphs, - bullets, > quotes) with zero preamble like "Here is your draft:".`;
    const userMsg = [
      `TASK: ${modePrompts[mode] || modePrompts.custom}`,
      instruction && mode !== "custom" ? `ADDITIONAL AUTHOR INSTRUCTIONS: ${instruction}` : "",
      title ? `ARTICLE TITLE: ${title}` : "",
      category ? `RESEARCH DIVISION: ${category}` : "",
      tags ? `EXISTING TAGS: ${tags}` : "",
      excerpt ? `EXISTING SUMMARY: ${excerpt}` : "",
      content ? `CURRENT ARTICLE CONTENT:\n${content}` : ""
    ].filter(Boolean).join("\n\n");

    const textProviders = getOrderedTextProviders(providers, body.providerId);
    const errs = [];
    for (let i = 0; i < textProviders.length; i++) {
      const prov = textProviders[i];
      try {
        const result = await runTextWithProvider(
          prov,
          [{ role: "system", content: sysPrompt }, { role: "user", content: userMsg }],
          { maxTokens: length === "Comprehensive" ? 2400 : 1400, temperature: 0.65 }
        );
        if (result && result.text) {
          const out = {
            success: true,
            text: result.text,
            mode,
            providerLabel: prov.label,
            modelUsed: result.model,
            usedFallback: i > 0
          };
          if (mode === "abstract_tags") {
            const sumM = result.text.match(/SUMMARY:\s*([\s\S]*?)(?=\nABSTRACT:|$)/i);
            const absM = result.text.match(/ABSTRACT:\s*([\s\S]*?)(?=\nTAGS:|$)/i);
            const tagM = result.text.match(/TAGS:\s*([^\n]+)/i);
            out.summary = sumM ? sumM[1].trim() : "";
            out.abstract = absM ? absM[1].trim() : "";
            out.tags = tagM ? tagM[1].trim() : "";
          }
          return jsonResp(out);
        }
      } catch (err) {
        errs.push(`${prov.label}: ${err.message}`);
      }
    }

    return jsonResp({
      error: errs.join(" | ") || "All configured text AI providers failed.",
      clientTextFallback: {
        endpoint: "https://text.pollinations.ai/openai",
        model: "openai",
        messages: [{ role: "system", content: sysPrompt }, { role: "user", content: userMsg }]
      }
    }, 503);
  }

  if (action === "ai_help") {
    const incoming = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
    const activeTab = String(body.activeTab || "overview").trim();
    const connectedSummary = providers
      .filter(p => p.enabled !== false)
      .map(p => `${p.label} (${[p.supportsImage ? "Image" : "", p.supportsText ? "Text" : ""].filter(Boolean).join("+")})`)
      .join(", ");

    const helpSystemPrompt = [
      "You are the built-in AI Help Assistant for the Curiomas Research & Innovation Institute (CRII) Admin & Researcher Portal (www.curiomas.zone.id).",
      "Give concise, practical, step-by-step guidance. Format answers clearly with bullet points or numbered steps.",
      `Current portal tab open: ${activeTab}.`,
      `Currently enabled AI APIs in this portal: ${connectedSummary || "Built-in Free Pollinations & AI Horde"}.`,
      "Portal capabilities you know inside-out:",
      "- Publications & Blog (Write tab): Supports BOTH Word-style Document Editor and Modular Block Editor. Has '✍ AI Writer' (draft full articles, outlines, continue, polish, simplify, translate Bengali/English, auto-fill summary/abstract/tags) and '✨ AI Image Studio' (reads article to craft editable prompts and generate thumbnails/figures saved straight to Cloudflare R2).",
      "- Settings → AI & External APIs Management Hub: Supports 60+ AI & Image providers including zero-key free engines (Pollinations FLUX, Pollinations Text AI, AI Horde GPU cluster) AND best free-tier no-credit-card APIs: Groq (14.4k req/day), Cerebras (1M tok/day), Cloudflare Workers AI (10k neurons/day FLUX + Llama), Hugging Face (FLUX.1-schnell + Llama), Google AI Studio Gemini (free text), GitHub Models (free GPT-4o-mini with GitHub PAT), OpenRouter (:free models), Together AI (FLUX.1-schnell-Free), SiliconFlow, Segmind (free daily FLUX), GetImg.ai (100 free/mo), Zhipu GLM-4-Flash (100% free), Mistral, Cohere, NVIDIA NIM.",
      "- Media & R2 Storage: Every image/video field across the portal defaults to Upload (Cloudflare R2) with a toggleable URL button supporting relative server paths (/assets/..., /api/images/...).",
      "- Who Can Join Us & Application Form Builder: Supports Open/Close toggle, Start & End deadlines, 14 custom field types (rating, image, pfp, video, url, number, id, text, textarea, select, etc.), and automatic Unique value duplicate checking.",
      "- Packages & Recruit Pages: Create custom /recruit?page=<slug> landing pages with student fees, benefits, and payment TrxID/receipt submission.",
      "- Researcher Emails (ImprovMX): Provision @scholar.zone.id / custom domain aliases forwarding to Gmail, and Super Admins can add/remove/set default ImprovMX API keys.",
      "- D1 SQL Studio & EmailJS Dispatcher: Query Cloudflare D1 directly and send fellowship/custom emails."
    ].join("\n");

    const convo = [{ role: "system", content: helpSystemPrompt }];
    incoming.forEach(m => {
      if (m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim()) {
        convo.push({ role: m.role, content: m.content.trim().slice(0, 4000) });
      }
    });
    if (convo.length === 1) {
      convo.push({ role: "user", content: "Give me a quick overview of what I can do with AI in this portal." });
    }

    const textProviders = getOrderedTextProviders(providers, body.providerId);
    const errs = [];
    for (let i = 0; i < textProviders.length; i++) {
      const prov = textProviders[i];
      try {
        const result = await runTextWithProvider(prov, convo, { maxTokens: 900, temperature: 0.55 });
        if (result && result.text) {
          return jsonResp({
            success: true,
            reply: result.text,
            providerLabel: prov.label,
            modelUsed: result.model,
            usedFallback: i > 0
          });
        }
      } catch (err) {
        errs.push(`${prov.label}: ${err.message}`);
      }
    }

    return jsonResp({
      error: errs.join(" | ") || "AI Help providers are currently unavailable.",
      clientTextFallback: {
        endpoint: "https://text.pollinations.ai/openai",
        model: "openai",
        messages: convo
      }
    }, 503);
  }

  if (action === "generate") {
    const prompt = String(body.prompt || "").trim();
    if (!prompt) return jsonResp({ error: "Image prompt cannot be empty." }, 400);

    const aspectRatio = ["16:9", "4:3", "3:2", "1:1", "9:16"].includes(body.aspectRatio) ? body.aspectRatio : "16:9";
    const imageSize = ["1K", "2K"].includes(body.imageSize) ? body.imageSize : "1K";
    const requestedProviderId = String(body.providerId || "auto").trim();
    const slugHint = String(body.slugHint || "article").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "article";

    const enabledImageProviders = providers.filter(p => {
      if (p.enabled === false || !p.supportsImage) return false;
      const adapter = getAdapter(p);
      if (adapter === "pollinations" || adapter === "aihorde") return true;
      return Boolean(p.apiKey && p.apiKey.trim());
    });

    let ordered = [];
    if (requestedProviderId && requestedProviderId !== "auto") {
      const exact = enabledImageProviders.find(p => p.id === requestedProviderId);
      if (exact) ordered.push(exact);
    }

    const rest = enabledImageProviders
      .filter(p => !ordered.some(x => x.id === p.id))
      .sort((a, b) => {
        if (a.isDefaultImage !== b.isDefaultImage) return b.isDefaultImage ? 1 : -1;
        if (a.builtIn !== b.builtIn) return a.builtIn ? 1 : -1;
        return 0;
      });
    ordered = [...ordered, ...rest];

    if (!ordered.some(p => getAdapter(p) === "pollinations")) {
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
      const polProv = providers.find(p => getAdapter(p) === "pollinations");
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
