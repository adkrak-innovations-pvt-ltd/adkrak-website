# Deploy Adkrak Innovations — free hosting in 5 minutes

## Option 1 — Cloudflare Pages (recommended)

Best free hosting today: unlimited bandwidth, global CDN, free HTTPS, instant rollbacks.

1. Push this folder to a GitHub repo (e.g. `adkrak/website`).
2. Go to https://dash.cloudflare.com → Pages → **Create a project** → Connect GitHub.
3. Pick the repo. Build settings:
   - **Framework preset:** None
   - **Build command:** *(leave blank)*
   - **Build output directory:** `/`
4. Deploy. Your site is live at `https://adkrak.pages.dev` within 60 seconds.

## Option 2 — GitHub Pages (zero config)

1. Push this folder to a public repo named `adkrak.github.io` (use your org/user name).
2. Repo → Settings → Pages → Source: `main` branch / root.
3. Live at `https://adkrak.github.io` in ~1 minute.

## Option 3 — Netlify drag-and-drop (no Git needed)

1. Visit https://app.netlify.com/drop
2. Drag the `adkrak-website` folder onto the page.
3. Live instantly at `https://<random-name>.netlify.app` — rename in site settings.

---

## When you're ready for a real domain

`adkrak.com` is likely available. Buy from:

- **Porkbun** — ~$10/year, cleanest UX, free WHOIS privacy
- **Namecheap** — ~$10/year, biggest brand
- **Cloudflare Registrar** — at-cost (no markup), the cheapest long-term

Then point it to Cloudflare Pages — takes 5 minutes:
- Pages project → Custom domains → Add `adkrak.com` → follow the DNS prompts.

## "Truly free" domain alternatives (subdomains only)

- `adkrak.pages.dev` (Cloudflare) — production-grade, free forever
- `adkrak.github.io` (GitHub) — same
- `is-a.dev`, `js.org` — free dev-community subdomains (require PR approval)

Avoid Freenom (`.tk`, `.ml`, `.ga`) — service is effectively dead in 2026.
