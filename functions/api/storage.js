/**
 * Cloudflare Pages Function: /api/storage
 * Image & Video Storage Manager powered by Cloudflare R2 (env.STORAGE) and D1 (env.DB)
 *
 * Capabilities:
 * - GET: List all uploaded images and videos with size, dimensions, timestamps & URLs
 * - POST: Upload new image/video to R2 bucket
 * - DELETE: Permanently delete unnecessary files from R2 bucket
 * - PATCH: Update file metadata / tags
 */

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
      uploadedBy TEXT DEFAULT 'Admin',
      tag TEXT
    )
  `).run().catch(() => {});
}

// 1. GET: List all media objects from R2 & D1
export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const filterType = url.searchParams.get("type"); // 'image', 'video', or null (all)

  let items = [];

  // A. Query R2 Bucket if bound
  if (env && env.STORAGE) {
    try {
      const listed = await env.STORAGE.list({ prefix: "uploads/", limit: 1000 });
      if (listed && listed.objects) {
        items = listed.objects.map(obj => {
          const key = obj.key;
          const ext = key.includes(".") ? key.split(".").pop().toLowerCase() : "";
          const isVideo = ["mp4", "webm", "mov", "m4v"].includes(ext);
          const mime = obj.httpMetadata?.contentType || (isVideo ? `video/${ext === "webm" ? "webm" : "mp4"}` : `image/${ext === "svg" ? "svg+xml" : ext === "png" ? "png" : ext === "webp" ? "webp" : "jpeg"}`);
          const origName = obj.customMetadata?.originalName || key.replace(/^uploads\//, "");

          return {
            id: key,
            key: key,
            url: `/api/images/${key}`,
            filename: origName,
            mimeType: mime,
            isVideo: isVideo,
            size: obj.size || 0,
            uploadedAt: obj.uploaded ? new Date(obj.uploaded).toISOString() : new Date().toISOString(),
            etag: obj.httpEtag
          };
        });
      }
    } catch (err) {
      console.warn("R2 list warning:", err);
    }
  }

  // B. Merge or Fallback to D1 metadata catalog
  if (env && env.DB) {
    try {
      await ensureMediaTable(env.DB);
      const { results } = await env.DB.prepare("SELECT * FROM media_items ORDER BY uploadedAt DESC").all();
      if (results && results.length > 0) {
        const existingKeys = new Set(items.map(i => i.key));
        for (const row of results) {
          if (!existingKeys.has(row.key)) {
            const ext = row.filename.includes(".") ? row.filename.split(".").pop().toLowerCase() : "";
            const isVideo = ["mp4", "webm", "mov"].includes(ext) || (row.mimeType && row.mimeType.startsWith("video/"));
            items.push({
              id: row.id || row.key,
              key: row.key,
              url: row.url || `/api/images/${row.key}`,
              filename: row.filename,
              mimeType: row.mimeType || (isVideo ? "video/mp4" : "image/jpeg"),
              isVideo: !!isVideo,
              size: row.size || 0,
              uploadedAt: row.uploadedAt,
              tag: row.tag
            });
          }
        }
      }
    } catch (e) {
      console.warn("D1 media catalog warning:", e);
    }
  }

  // Fallback defaults if storage is completely empty
  if (items.length === 0) {
    items = [
      {
        id: "default-hero-video",
        key: "assets/hero-bg.mp4",
        url: "/assets/hero-bg.mp4",
        filename: "hero-bg.mp4",
        mimeType: "video/mp4",
        isVideo: true,
        size: 8421000,
        uploadedAt: "2026-01-01T00:00:00.000Z"
      },
      {
        id: "default-logo-png",
        key: "assets/curiomas-no-bg.png",
        url: "/assets/curiomas-no-bg.png",
        filename: "curiomas-no-bg.png",
        mimeType: "image/png",
        isVideo: false,
        size: 132700,
        uploadedAt: "2026-01-01T00:00:00.000Z"
      }
    ];
  }

  // Apply optional filtering
  if (filterType === "image") {
    items = items.filter(i => !i.isVideo);
  } else if (filterType === "video") {
    items = items.filter(i => i.isVideo);
  }

  // Sort newest first
  items.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

  // Compute metrics
  const totalBytes = items.reduce((acc, curr) => acc + (curr.size || 0), 0);
  const imagesCount = items.filter(i => !i.isVideo).length;
  const videosCount = items.filter(i => i.isVideo).length;

  return new Response(JSON.stringify({
    success: true,
    totalFiles: items.length,
    totalBytes: totalBytes,
    imagesCount: imagesCount,
    videosCount: videosCount,
    items: items
  }), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate"
    }
  });
}

// 2. POST: Upload new Image or Video to R2
export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return new Response(JSON.stringify({ error: "Expected multipart/form-data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const formData = await request.formData();
    const file = formData.get("file") || formData.get("image") || formData.get("video");

    if (!file || typeof file === "string") {
      return new Response(JSON.stringify({ error: "No media file provided in upload" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const origName = file.name || "media-file.jpg";
    const rawExt = origName.includes(".") ? origName.split(".").pop().toLowerCase() : "jpg";
    const validExts = ["jpg", "jpeg", "png", "gif", "webp", "svg", "avif", "mp4", "webm", "mov"];
    const ext = validExts.includes(rawExt) ? rawExt : "jpg";
    const isVideo = ["mp4", "webm", "mov"].includes(ext);

    const timestamp = Date.now();
    const randomHex = Math.random().toString(36).substring(2, 8);
    const key = `uploads/${timestamp}-${randomHex}.${ext}`;

    const mimeType = file.type || (isVideo ? `video/${ext === "webm" ? "webm" : "mp4"}` : ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : ext === "svg" ? "image/svg+xml" : "image/jpeg");

    // Put into Cloudflare R2
    if (env && env.STORAGE) {
      await env.STORAGE.put(key, file.stream(), {
        httpMetadata: {
          contentType: mimeType,
          cacheControl: "public, max-age=31536000, immutable",
        },
        customMetadata: {
          originalName: origName,
          uploadedAt: new Date().toISOString()
        }
      });
    }

    const publicUrl = `/api/images/${key}`;

    // Record in D1 catalog
    if (env && env.DB) {
      try {
        await ensureMediaTable(env.DB);
        await env.DB.prepare(`
          INSERT INTO media_items (id, key, url, filename, mimeType, size, uploadedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).bind(key, key, publicUrl, origName, mimeType, file.size || 0, new Date().toISOString()).run();
      } catch (e) {
        console.warn("D1 media insert warning:", e);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      item: {
        id: key,
        key: key,
        url: publicUrl,
        filename: origName,
        mimeType: mimeType,
        isVideo: isVideo,
        size: file.size || 0,
        uploadedAt: new Date().toISOString()
      }
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("Storage upload error:", err);
    return new Response(JSON.stringify({ error: "Upload failed: " + err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

// 3. DELETE: Permanently delete an Image or Video from R2 & D1
export async function onRequestDelete(context) {
  const { request, env } = context;

  try {
    let key = null;

    // Check query params
    const url = new URL(request.url);
    key = url.searchParams.get("key");

    // Check JSON body if not in query
    if (!key) {
      try {
        const body = await request.json();
        key = body.key || body.id;
      } catch (e) {}
    }

    if (!key) {
      return new Response(JSON.stringify({ error: "Missing required 'key' of media file to delete" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // A. Delete from R2
    if (env && env.STORAGE) {
      try {
        await env.STORAGE.delete(key);
      } catch (err) {
        console.warn("R2 delete warning:", err);
      }
    }

    // B. Delete from D1 catalog
    if (env && env.DB) {
      try {
        await ensureMediaTable(env.DB);
        await env.DB.prepare("DELETE FROM media_items WHERE key = ? OR id = ?").bind(key, key).run();
      } catch (e) {
        console.warn("D1 media delete warning:", e);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: `Permanently deleted media object '${key}' from storage.`,
      key: key
    }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: "Delete failed: " + err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

// 4. PATCH: Update file metadata / tags
export async function onRequestPatch(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const { key, filename, tag } = body;

    if (!key) {
      return new Response(JSON.stringify({ error: "Missing required 'key'" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (env && env.DB) {
      await ensureMediaTable(env.DB);
      if (filename) {
        await env.DB.prepare("UPDATE media_items SET filename = ? WHERE key = ?").bind(filename, key).run();
      }
      if (tag) {
        await env.DB.prepare("UPDATE media_items SET tag = ? WHERE key = ?").bind(tag, key).run();
      }
    }

    return new Response(JSON.stringify({ success: true, key, filename, tag }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}
