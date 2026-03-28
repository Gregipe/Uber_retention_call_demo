// src/index.js — Cloudflare Worker with Assets binding
// Handles /api/* routes server-side, falls through to static assets for everything else

const HUNAR_BASE = "https://api.voice.hunar.ai/external/v1";

export default {
  async fetch(request, env) {
    const HUNAR_API_KEY = env.HUNAR_API_KEY;
    const url = new URL(request.url);

    // ── OPTIONS preflight for /api/* ──
    if (request.method === "OPTIONS" && url.pathname.startsWith("/api/")) {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

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
          headers: { "Content-Type": "application/json" },
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
          headers: { "Content-Type": "application/json" },
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // ── Everything else → static assets (index.html etc.) ──
    return env.ASSETS.fetch(request);
  },
};
