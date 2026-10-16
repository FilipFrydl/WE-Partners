# Partners

A small offline-first PWA for tracking business partners and when you last contacted them.
Built with Vite, React, TypeScript, Tailwind CSS, Dexie (IndexedDB) and vite-plugin-pwa.
All data stays on the device; there is no backend.

## Run locally

```bash
npm install
npm run dev       # http://localhost:5173
npm test          # unit tests (Vitest)
npm run build     # type-check + production build into dist/
npm run preview   # serve the production build (service worker is active here)
```

The service worker is only generated in production builds, so use `npm run build && npm run preview` to test offline behavior.

## Try it on an iPad

Service workers and "Add to Home Screen" need HTTPS (localhost is the only exception), so the easiest route is to deploy (see below) and open the URL in Safari:

1. Open the deployed URL in **Safari** on the iPad.
2. Tap **Share → Add to Home Screen → Add**.
3. Launch "Partners" from the Home Screen. After the first load it works offline.

To test a local build on the iPad without deploying, expose it over HTTPS with a tunnel such as `npx localtunnel --port 4173` or Cloudflare Tunnel while `npm run preview` is running.

## Features

- **Contact-age rule** (`src/lib/contactAge.ts`): under 7 days = normal, 7–13 days = yellow ("Follow up"), 14+ days = red ("Follow up").
- **Dashboard** (`/`): Overview, Follow up and Partners widgets. Add a widget by creating a component that takes `partners` and listing it in `src/pages/Dashboard.tsx`.
- **Partner list** (`/partners`): search, status filter, sorting, add/edit/delete, "Contacted today".
- **Backup**: open **Settings** (gear icon, top right) for "Export backup" / "Import backup" (JSON). It shows when you last exported; importing replaces all data after confirmation.
- Five sample partners are created on first launch; remove them from the banner on the dashboard or in Settings.
- "Contacted today" shows an Undo toast; tap a partner row on the Partners page to edit or delete it.

## Code layout

- `src/data/partners.ts`: the only data-access module the UI uses (list/get/create/update/delete). Replace its internals to add server sync later.
- `src/data/db.ts`, `seed.ts`, `backup.ts`: Dexie schema, sample data, backup import/export.
- `src/widgets/`, `src/pages/`, `src/components/`: UI.

## Deploy

Both options serve a static site with an SPA fallback to `index.html` (already configured in `netlify.toml` / `vercel.json`).

**Netlify**: push to Git, then "Add new site → Import from Git". Build command `npm run build`, publish directory `dist`. Or: `npm run build && npx netlify deploy --prod --dir=dist`.

**Vercel**: import the repository; the Vite preset is detected automatically (build `npm run build`, output `dist`). Or: `npx vercel --prod`.

## Notes

Data lives in the browser's IndexedDB. Clearing Safari website data, or not opening a Home Screen app for a long time, can delete it, so export backups regularly.
Icons are generated from `public/favicon.svg` with `npm run icons`.
