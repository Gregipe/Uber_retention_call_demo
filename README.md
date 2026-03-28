# Uber × Hunar.ai — Voice AI Playground

## Project Structure

```
public/
├── index.html       ← Full React frontend (single file, CDN-loaded React)
└── _worker.js       ← Cloudflare Pages advanced-mode worker (API proxy)
```

## How It Works

The `_worker.js` intercepts all requests:
- `POST /api/calls` → proxied server-side to Hunar's create call API
- `GET /api/calls/:id` → proxied server-side to Hunar's poll call API  
- Everything else → served from static assets (index.html)

API key stays server-side. No CORS issues.

## Deploy to Cloudflare Pages

### Via Dashboard

1. Push this repo to GitHub
2. Cloudflare Dashboard → **Pages** → Create project → Connect to Git
3. Build settings:
   - **Build command:** (leave empty)
   - **Build output directory:** `public`
4. Deploy

### Via Wrangler CLI

```bash
npm install -g wrangler
wrangler login
wrangler pages deploy public --project-name uber-hunar-voice-ai
```

## ⚠️  Important: This is Pages, not Workers

Deploy via **Cloudflare Pages**, not Workers. Pages auto-detects `_worker.js` in the output directory and handles routing. Workers would require a different setup.

Your URL will be: `https://your-project.pages.dev`

## Security: Move API key to env vars (recommended)

1. Dashboard → Pages project → Settings → Environment variables
2. Add: `HUNAR_API_KEY` = your key
3. In `_worker.js`, replace the hardcoded key with: `context.env.HUNAR_API_KEY`
