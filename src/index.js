/**
 * 🌐 Favicon Gateway Worker (public entry for RapidAPI)
 */

export default {
  async fetch(request, env, ctx) {
    try {
      const reqUrl = new URL(request.url);
      const path = reqUrl.pathname;

      // ✅ Health Check
      if (path === "/ping") {
        return new Response(JSON.stringify({
          status: "ok",
          service: "favicon-gateway",
          version: "v1",
          upstream: "favicon-fetcher-worker",
          timestamp: new Date().toISOString(),
        }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }

      // ✅ CORS preflight
      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, X-RapidAPI-Key",
          },
        });
      }

      // ✅ Valid root
      if (path !== "/" && path !== "") {
        return jsonResponse({ error: "Not Found", path }, 404);
      }

      // 🔒 Configuración privada
      const upstream = "https://rapidapi-favicon-fetcher-worker.artxeweb.workers.dev";
      const privateKey = env.PRIVATE_API_KEY;

      // --- Parámetros ---
      const domains = reqUrl.searchParams.get("domains");
      const size = reqUrl.searchParams.get("size") || "64";
      const mode = reqUrl.searchParams.get("mode") || "auto";

      if (!domains) {
        return jsonResponse({ error: "Missing 'domains' parameter." }, 400);
      }

      // --- Construcción de la URL al worker privado ---
      const targetUrl =
        `${upstream}/?key=${encodeURIComponent(privateKey)}` +
        `&domains=${encodeURIComponent(domains)}` +
        `&size=${encodeURIComponent(size)}` +
        `&mode=${encodeURIComponent(mode)}`;

      // --- Llamada ---
      const upstreamResp = await fetch(targetUrl, { headers: { Accept: "application/json" } });
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
