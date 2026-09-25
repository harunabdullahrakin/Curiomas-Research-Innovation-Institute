/**
 * Cloudflare Pages Functions - Image & Asset Upload Endpoint
 * Receives multipart/form-data image, stores in Cloudflare R2 bucket (env.STORAGE),
 * and returns public access URL.
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  // 1. Verify R2 Storage Binding
  if (!env.STORAGE) {
    return new Response(JSON.stringify({
      error: "Cloudflare R2 Image Storage binding 'STORAGE' is not configured.",
      details: "Please go to Cloudflare Pages -> Settings -> Functions -> R2 bucket bindings, and bind your bucket with variable name 'STORAGE'."
    }), {
      status: 503,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return new Response(JSON.stringify({ error: "Expected multipart/form-data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const formData = await request.formData();
    const file = formData.get("file") || formData.get("image");

    if (!file || typeof file === "string") {
      return new Response(JSON.stringify({ error: "No image file provided in upload" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Determine extension and mime type
    const origName = file.name || "image.jpg";
    const rawExt = origName.includes(".") ? origName.split(".").pop().toLowerCase() : "jpg";
    const validExts = ["jpg", "jpeg", "png", "gif", "webp", "svg", "avif", "mp4", "webm", "pdf"];
    const ext = validExts.includes(rawExt) ? rawExt : "jpg";

    const timestamp = Date.now();
    const randomHex = Math.random().toString(36).substring(2, 8);
    const key = `uploads/${timestamp}-${randomHex}.${ext}`;

    const mimeType = file.type || (ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : ext === "svg" ? "image/svg+xml" : ext === "mp4" ? "video/mp4" : "image/jpeg");

    // Put object into Cloudflare R2
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

    // We serve the image directly via /api/images/[key] so public R2 URL or custom domain is NOT required!
    const publicUrl = `/api/images/${key}`;

    return new Response(JSON.stringify({
      success: true,
      url: publicUrl,
      key: key,
      filename: origName,
      size: file.size,
      mimeType: mimeType
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({
      error: "Upload failed",
      details: err.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
