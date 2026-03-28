# Uber × Hunar.ai — Voice AI Playground

## Project Structure

```
cloudflare-project/
├── public/
│   └── index.html          ← Full React frontend (single file, CDN-loaded)
├── functions/
│   └── api/
│       └── calls/
│           ├── index.js     ← POST /api/calls → proxies to Hunar create call API
│           └── [id].js      ← GET /api/calls/:id → proxies to Hunar poll call API
└── README.md
```

## How It Works

The frontend calls `/api/calls` (same origin), which Cloudflare Pages Functions proxy server-side to `https://api.voice.hunar.ai/external/v1/calls/`. This avoids all CORS issues since the API key and external call happen on the server, not the browser.

## Deploy to Cloudflare Pages

### Option A: Dashboard (easiest)

1. Push this folder to a GitHub/GitLab repo
2. Go to [Cloudflare Dashboard → Pages](https://dash.cloudflare.com/?to=/:account/pages)
3. Click **Create a project** → **Connect to Git**
4. Select your repo
5. Set build settings:
   - **Build command:** (leave empty — no build step needed)
   - **Build output directory:** `public`
6. Click **Save and Deploy**

### Option B: Wrangler CLI

```bash
# Install wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy (run from this folder)
wrangler pages deploy public --project-name uber-hunar-voice-ai
```

The Functions in `/functions/` are auto-detected and deployed alongside.

## Configuration

### API Key
The Hunar API key is hardcoded in both function files (`functions/api/calls/index.js` and `functions/api/calls/[id].js`). For production, move these to [Cloudflare environment variables](https://developers.cloudflare.com/pages/functions/bindings/#environment-variables):

1. In the Cloudflare Dashboard, go to your Pages project → Settings → Environment variables
2. Add `HUNAR_API_KEY` with your key
3. Update the functions to use `context.env.HUNAR_API_KEY` instead of the hardcoded string

### Agent IDs
Update the `AGENTS` array in `public/index.html` with your actual agent UUIDs for Spanish, Tamil, and Telugu.

## Adding Agents

To add a new agent, add an entry to the `AGENTS` array in `index.html`:

```js
{
  id: "your-agent-uuid-here",
  lang: "Kannada",
  langNative: "ಕನ್ನಡ",
  flag: "🇮🇳",
  color: "#FF6B6B",
  desc: "Retain Kannada-speaking drivers with local language outreach.",
}
```
