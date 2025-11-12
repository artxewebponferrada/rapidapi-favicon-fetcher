/**
 * 🌐 Favicon Gateway Worker (public entry for RapidAPI)
 * -----------------------------------------------------
 * Proxies requests securely to the private worker that actually fetches favicons.
 * The private API key and endpoint are never exposed to the public.
 */

export default {
  async fetch(request, env, ctx) {
    try {
      const reqUrl = new URL(request.url);

      // 🔒 Private API configuration (from secrets)
      const upstream = "https://rapidapi-favicon-fetcher-worker.artxeweb.workers.dev";
      const privateKey = env.PRIVATE_API_KEY;

      // --- Parameters ---
      const domains = reqUrl.searchParams.get("domains");
      const size = reqUrl.searchParams.get("size") || "64";
      const mode = reqUrl.searchParams.get("mode") || "auto";

      if (!domains) {
        return jsonResponse({ error: "Missing 'domains' parameter." }, 400);
      }

      // --- Build target URL for the private worker ---
      const targetUrl =
        `${upstream}/?key=${encodeURIComponent(privateKey)}` +
        `&domains=${encodeURIComponent(domains)}` +
        `&size=${encodeURIComponent(size)}` +
        `&mode=${encodeURIComponent(mode)}`;

      // --- Proxy the request to the private worker ---
      const upstreamResp = await fetch(targetUrl, {
        method: "GET",
        headers: { "Accept": "application/json" },
      });

      // --- Return the upstream response transparently ---
      const contentType = upstreamResp.headers.get("content-type") || "application/json";
      return new Response(upstreamResp.body, {
        status: upstreamResp.status,
        headers: {
          "Content-Type": contentType,
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=86400",
        },
      });
    } catch (err) {
      return jsonResponse({ error: err.message }, 500);
    }
  },
};

function jsonResponse(obj, status = 200) {
  return new Response(JSON.stringify(obj, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
