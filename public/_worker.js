// _worker.js — Cloudflare Pages Advanced Mode
// Handles /api/* routes server-side, passes everything else to static assets

const HUNAR_API_KEY = "hunar_va_live_sk_nLOtbcN-jdKk4OPa7_prT7NAa0UWJ7TrSEHDWrDsy9-QNUDwlQ8hFQ";
const HUNAR_BASE = "https://api.voice.hunar.ai/external/v1";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ── POST /api/calls — Create a call ──
    if (url.pathname === "/api/calls" && request.method === "POST") {
      try {
        const body = await request.json();
        const resp = await fetch(`${HUNAR_BASE}/calls/`, {
          method: "POST",
          headers: {
            "X-API-Key": HUNAR_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
        const data = await resp.text();
        return new Response(data, {
          status: resp.status,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // ── GET /api/calls/:id — Poll call status ──
    if (url.pathname.startsWith("/api/calls/") && request.method === "GET") {
      const callId = url.pathname.replace("/api/calls/", "").replace(/\/$/, "");
      try {
        const resp = await fetch(`${HUNAR_BASE}/calls/${callId}/`, {
          headers: { "X-API-Key": HUNAR_API_KEY },
        });
        const data = await resp.text();
        return new Response(data, {
          status: resp.status,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // ── OPTIONS preflight ──
    if (request.method === "OPTIONS" && url.pathname.startsWith("/api/")) {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // ── Everything else → static assets ──
    return env.ASSETS.fetch(request);
  },
};
