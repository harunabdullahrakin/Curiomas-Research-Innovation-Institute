const GEMINI_INTERACTIONS_URL = "https://generativelanguage.googleapis.com/v1beta/interactions";
const GEMINI_API_REVISION = "2026-05-20";
const TEXT_MODEL_FALLBACKS = [
  "gemini-3.8-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemma-4-31b-it"
];
const ALLOWED_IMAGE_MODELS = [
  "gemini-nano-banana-2.1",
  "gemini-3.1-flash-lite-image",
  "gemini-3-pro-image"
];
const ALLOWED_RATIOS = ["16:9", "4:3", "3:2", "1:1", "9:16"];
const ALLOWED_SIZES = ["1K", "2K"];

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
  if (!k || k.length < 10) return "";
  return k.slice(0, 6) + "..." + k.slice(-4);
}

function isRetryableAiError(status, errMsg) {
  if ([429, 500, 502, 503, 504].includes(status)) return true;
  const m = String(errMsg || "").toLowerCase();
  return m.includes("high demand") ||
    m.includes("overloaded") ||
    m.includes("unavailable") ||
    m.includes("temporarily") ||
    m.includes("rate limit") ||
    m.includes("resource_exhausted") ||
    m.includes("quota") ||
    m.includes("try again") ||
    m.includes("not found");
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
  const parts = [
    `${modeDesc} in ${style} style representing "${title || "Frontier Scientific Discovery"}".`,
    category ? `Discipline atmosphere inspired by ${category}.` : "",
    snippet ? `Core visual themes drawn from the research: ${snippet}.` : "",
    "Dramatic museum-grade studio lighting, crisp focal depth, rich balanced color palette, refined composition, no watermarks or cluttered text overlays."
  ].filter(Boolean);
  return parts.join(" ");
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

async function resolveGeminiKey(env) {
  if (env && env.DB) {
    try {
      await ensureSettingsTable(env.DB);
      const row = await env.DB.prepare("SELECT value_json FROM settings WHERE key = 'gemini_ai_config'").first();
      if (row && row.value_json) {
        const parsed = JSON.parse(row.value_json);
        if (parsed && parsed.apiKey && String(parsed.apiKey).trim()) {
          return { key: String(parsed.apiKey).trim(), source: "db" };
        }
      }
    } catch (e) {}
  }
  if (env && env.GEMINI_API_KEY && String(env.GEMINI_API_KEY).trim()) {
    return { key: String(env.GEMINI_API_KEY).trim(), source: "env" };
  }
  return { key: "", source: "none" };
}

function extractTextFromInteraction(data) {
  if (!data || typeof data !== "object") return "";
  const chunks = [];
  if (Array.isArray(data.steps)) {
    for (const step of data.steps) {
      if (step && step.type === "model_output" && Array.isArray(step.content)) {
        for (const block of step.content) {
          if (block && block.type === "text" && block.text) {
            chunks.push(block.text);
          }
        }
      }
    }
  }
  if (chunks.length === 0 && Array.isArray(data.outputs)) {
    for (const out of data.outputs) {
      if (out && out.type === "text" && out.text) {
        chunks.push(out.text);
      }
    }
  }
  return chunks.join("\n").trim();
}

function extractImageFromInteraction(data) {
  if (!data || typeof data !== "object") return null;
  let found = null;
  if (Array.isArray(data.steps)) {
    for (const step of data.steps) {
      if (step && step.type === "model_output" && Array.isArray(step.content)) {
        for (const block of step.content) {
          if (block && block.type === "image" && block.data) {
            found = {
              data: block.data,
              mimeType: block.mime_type || block.mimeType || "image/png"
            };
          }
        }
      }
    }
  }
  if (!found && Array.isArray(data.outputs)) {
    for (const out of data.outputs) {
      if (out && out.type === "image" && out.data) {
        found = {
          data: out.data,
          mimeType: out.mime_type || out.mimeType || "image/png"
        };
      }
    }
  }
  return found;
}

function base64ToUint8Array(base64) {
  const clean = base64.replace(/\s+/g, "");
  const binary = atob(clean);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function callGeminiInteractions(apiKey, payload) {
  const res = await fetch(GEMINI_INTERACTIONS_URL, {
    method: "POST",
    headers: {
      "x-goog-api-key": apiKey,
      "Content-Type": "application/json",
      "Api-Revision": GEMINI_API_REVISION
    },
    body: JSON.stringify(payload)
  });
  const rawText = await res.text();
  let parsed = {};
  try {
    parsed = JSON.parse(rawText);
  } catch (e) {
    parsed = { error: { message: rawText || `HTTP ${res.status}` } };
  }
  return { ok: res.ok, status: res.status, data: parsed };
}

export async function onRequestGet(context) {
  const { env } = context;
  const resolved = await resolveGeminiKey(env);
  return jsonResp({
    success: true,
    configured: Boolean(resolved.key),
    source: resolved.source,
    maskedKey: maskKey(resolved.key)
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

  if (action === "save_key") {
    const rawKey = String(body.apiKey || "").trim();
    if (env && env.DB) {
      await ensureSettingsTable(env.DB);
      await env.DB.prepare(`
        INSERT INTO settings (key, value_json, updatedAt, updatedBy)
        VALUES ('gemini_ai_config', ?, ?, ?)
        ON CONFLICT(key) DO UPDATE SET
          value_json = excluded.value_json,
          updatedAt = excluded.updatedAt,
          updatedBy = excluded.updatedBy
      `).bind(JSON.stringify({ apiKey: rawKey }), new Date().toISOString(), body.updatedBy || "Administrator").run();
    }
    const resolved = await resolveGeminiKey(env);
    return jsonResp({
      success: true,
      configured: Boolean(resolved.key),
      source: resolved.source,
      maskedKey: maskKey(resolved.key)
    });
  }

  const resolved = await resolveGeminiKey(env);
  const apiKey = String(body.apiKeyOverride || "").trim() || resolved.key;
  if (!apiKey) {
    return jsonResp({
      error: "Google Gemini API key is not configured. Click 'Gemini API Key' in the AI Studio modal to add your Google AI Studio key."
    }, 400);
  }

  if (action === "draft_prompt") {
    const title = String(body.title || "").trim();
    const category = String(body.category || "").trim();
    const excerpt = String(body.excerpt || "").trim();
    const tags = String(body.tags || "").trim();
    const content = String(body.content || "").trim().slice(0, 12000);
    const mode = String(body.mode || "thumbnail").trim();
    const style = String(body.style || "Editorial Scientific Photography").trim();

    if (!title && !excerpt && !content) {
      return jsonResp({ error: "Write a title, summary, or article content first so Gemini can read it." }, 400);
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

    let lastError = "";
    let lastStatus = 500;

    for (let i = 0; i < TEXT_MODEL_FALLBACKS.length; i++) {
      const candidateModel = TEXT_MODEL_FALLBACKS[i];
      const aiRes = await callGeminiInteractions(apiKey, {
        model: candidateModel,
        input: [{ type: "text", text: synthesisInput }],
        store: false
      });

      if (aiRes.ok) {
        const draftedPrompt = extractTextFromInteraction(aiRes.data);
        if (draftedPrompt) {
          return jsonResp({
            success: true,
            prompt: draftedPrompt,
            modelUsed: candidateModel,
            usedFallback: i > 0
          });
        }
      }

      lastStatus = aiRes.status;
      lastError = aiRes.data?.error?.message || aiRes.data?.message || `HTTP ${aiRes.status}`;
      if (!isRetryableAiError(aiRes.status, lastError)) {
        return jsonResp({ error: lastError }, aiRes.status >= 400 && aiRes.status < 600 ? aiRes.status : 500);
      }
    }

    const fallbackPrompt = buildLocalFallbackPrompt({ title, category, excerpt, content, mode, style });
    return jsonResp({
      success: true,
      prompt: fallbackPrompt,
      modelUsed: "smart-local-fallback",
      usedFallback: true,
      fallbackNotice: lastError
    });
  }

  if (action === "generate") {
    const prompt = String(body.prompt || "").trim();
    if (!prompt) {
      return jsonResp({ error: "Image prompt is required." }, 400);
    }

    const requestedModel = ALLOWED_IMAGE_MODELS.includes(body.model) ? body.model : "gemini-nano-banana-2.1";
    const imageModelChain = [requestedModel, ...ALLOWED_IMAGE_MODELS.filter(m => m !== requestedModel)];
    const aspectRatio = ALLOWED_RATIOS.includes(body.aspectRatio) ? body.aspectRatio : "16:9";
    const imageSize = ALLOWED_SIZES.includes(body.imageSize) ? body.imageSize : "1K";
    const slugHint = String(body.slugHint || "article").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 36) || "article";

    let imgObj = null;
    let modelUsed = requestedModel;
    let usedFallback = false;
    let lastError = "";
    let lastStatus = 500;

    for (let i = 0; i < imageModelChain.length; i++) {
      const candidateModel = imageModelChain[i];
      const aiRes = await callGeminiInteractions(apiKey, {
        model: candidateModel,
        input: [{ type: "text", text: prompt }],
        response_format: {
          type: "image",
          mime_type: "image/jpeg",
          aspect_ratio: aspectRatio,
          image_size: imageSize
        },
        store: false
      });

      if (aiRes.ok) {
        const extracted = extractImageFromInteraction(aiRes.data);
        if (extracted && extracted.data) {
          imgObj = extracted;
          modelUsed = candidateModel;
          usedFallback = i > 0;
          break;
        }
        lastError = extractTextFromInteraction(aiRes.data) || "No image returned by model.";
        lastStatus = 422;
      } else {
        lastStatus = aiRes.status;
        lastError = aiRes.data?.error?.message || aiRes.data?.message || `HTTP ${aiRes.status}`;
        if (!isRetryableAiError(aiRes.status, lastError)) {
          return jsonResp({ error: lastError }, aiRes.status >= 400 && aiRes.status < 600 ? aiRes.status : 500);
        }
      }
    }

    if (!imgObj || !imgObj.data) {
      return jsonResp({
        error: lastError || "All Gemini image models are currently experiencing high demand. Please retry in a moment."
      }, lastStatus >= 400 && lastStatus < 600 ? lastStatus : 503);
    }

    const mimeType = imgObj.mimeType || "image/png";
    const ext = mimeType.includes("jpeg") || mimeType.includes("jpg") ? "jpg" : mimeType.includes("webp") ? "webp" : "png";
    const bytes = base64ToUint8Array(imgObj.data);
    const filename = `ai-${slugHint}-${Date.now()}.${ext}`;
    const r2Key = `uploads/${filename}`;
    let finalUrl = `data:${mimeType};base64,${imgObj.data}`;
    let storedInR2 = false;

    if (env && env.STORAGE) {
      try {
        await env.STORAGE.put(r2Key, bytes, {
          httpMetadata: { contentType: mimeType },
          customMetadata: { originalName: filename, source: "gemini_ai_studio", model: modelUsed }
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
            bytes.byteLength,
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
      size: bytes.byteLength,
      model: modelUsed,
      usedFallback,
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
