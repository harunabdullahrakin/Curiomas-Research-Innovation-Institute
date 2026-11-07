/**
 * Cloudflare Pages Functions Global Middleware
 * Adds CORS, Security Headers, SPA Routing, and Edge Cache Prevention
 */

export async function onRequest(context) {
  const { request, next } = context;

  // 1. Handle CORS Preflight OPTIONS requests
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  const url = new URL(request.url);
  const pathname = url.pathname.toLowerCase();

  // 2. Handle /api/* requests with dynamic CORS & Security
  if (pathname.startsWith('/api/')) {
    const response = await next();
    const newResponse = new Response(response.body, response);
    newResponse.headers.set("Access-Control-Allow-Origin", "*");
    newResponse.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    newResponse.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    newResponse.headers.set("X-Content-Type-Options", "nosniff");
    newResponse.headers.set("X-Frame-Options", "DENY");
    newResponse.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    newResponse.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    return newResponse;
  }

  // 3. SPA Route Interception for All Subpages & Direct Page Navigation
  // Prevents Cloudflare Edge from serving stale cached pre-Vite HTML files
  const pageRoutes = ['/research', '/team', '/interns', '/blog', '/contact', '/portal', '/login', '/article'];
  const isPageRoute = pageRoutes.some(p => pathname === p || pathname.startsWith(p + '/')) || pathname.endsWith('.html');

  if (isPageRoute && context.env && context.env.ASSETS) {
    const spaReq = new Request(new URL('/', request.url), request);
    const spaRes = await context.env.ASSETS.fetch(spaReq);
    const newResponse = new Response(spaRes.body, spaRes);
    newResponse.headers.set("Cache-Control", "public, max-age=0, must-revalidate");
    newResponse.headers.set("CDN-Cache-Control", "no-store");
    newResponse.headers.set("Cloudflare-CDN-Cache-Control", "no-store");
    newResponse.headers.set("X-Content-Type-Options", "nosniff");
    newResponse.headers.set("X-Frame-Options", "DENY");
    newResponse.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    return newResponse;
  }

  // 4. Default static assets and other requests
  const response = await next();
  const newResponse = new Response(response.body, response);
  newResponse.headers.set("Access-Control-Allow-Origin", "*");
  newResponse.headers.set("X-Content-Type-Options", "nosniff");
  newResponse.headers.set("X-Frame-Options", "DENY");
  newResponse.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  if (!pathname.startsWith('/assets/')) {
    newResponse.headers.set("Cache-Control", "public, max-age=0, must-revalidate");
    newResponse.headers.set("CDN-Cache-Control", "no-store");
    newResponse.headers.set("Cloudflare-CDN-Cache-Control", "no-store");
  }

  return newResponse;
}
