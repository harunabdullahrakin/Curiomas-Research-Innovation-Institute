/**
 * Cloudflare Pages Functions - Image Delivery Proxy
 * Serves stored media directly from Cloudflare R2 (env.STORAGE)
 * Route: GET /api/images/*
 */

export async function onRequestGet(context) {
  const { params, env } = context;
  const keyParts = params.key;
  const key = Array.isArray(keyParts) ? keyParts.join('/') : keyParts;

  if (!key) {
    return new Response("Missing image key", { status: 400 });
  }

  if (!env.STORAGE) {
    return new Response("R2 storage binding 'STORAGE' is not configured", { status: 503 });
  }

  try {
    const object = await env.STORAGE.get(key);

    if (!object) {
      return new Response("Image not found", { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    headers.set("Cache-Control", "public, max-age=31536000, immutable");

    return new Response(object.body, { headers });
  } catch (err) {
    return new Response("Error retrieving image: " + err.message, { status: 500 });
  }
}
