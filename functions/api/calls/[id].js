// functions/api/calls/[id].js
// Proxies GET requests to poll Hunar call status

const HUNAR_API_KEY = "hunar_va_live_sk_nLOtbcN-jdKk4OPa7_prT7NAa0UWJ7TrSEHDWrDsy9-QNUDwlQ8hFQ";
const HUNAR_BASE = "https://api.voice.hunar.ai/external/v1";

export async function onRequestGet(context) {
  const callId = context.params.id;

  try {
    const response = await fetch(`${HUNAR_BASE}/calls/${callId}/`, {
      headers: { "X-API-Key": HUNAR_API_KEY },
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
