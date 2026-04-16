# Stratford Grade Finder

A sleek, minimal grade access portal built with Next.js + Vercel KV for persistent storage.

---

## Deploy to Vercel (recommended)

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USERNAME/stratford.git
git push -u origin main
```

### Step 2 — Import on Vercel
1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo — Vercel auto-detects Next.js
3. Click **Deploy**

### Step 3 — Add Vercel KV (persistent storage)
1. In your Vercel project dashboard, go to the **Storage** tab
2. Click **Create Database** → choose **KV**
3. Click **Connect to Project** and select your project
4. Vercel automatically adds all required env vars — **redeploy** once to pick them up

---

## Local Development

```bash
npm install
```

Copy env vars from your Vercel project's **Storage > KV > .env.local** tab:
```bash
cp .env.local.example .env.local
# then fill in the values
```

```bash
npm run dev
# open http://localhost:3000
```

---

## Features
- Login with Stratford Email + Access Code
- Code format validation: `[4 letters][1 digit][4 letters][1 symbol]`
- Admin panel: `email: admin` / `code: Bob`
- All login attempts logged persistently via Vercel KV
- Auto-refreshing admin view (every 5s)
- Smooth transitions, dark minimal UI
