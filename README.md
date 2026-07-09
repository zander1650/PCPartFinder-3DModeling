# PCForge

Pick compatible PC parts, get budget-based recommended builds, and preview your
finished PC **running in 3D** — spinning fans, RGB and all.

## Stack

- **Next.js (App Router) + React + Tailwind** — frontend and serverless backend, deploys free on Vercel
- **react-three-fiber + drei** — the 3D "running PC" viewer
- **Supabase** — parts catalog, retailer prices, auth and saved builds (free tier)
- **Zustand** — build state shared between the part picker and the 3D scene

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. **No setup needed** — without Supabase env vars the
app uses the bundled sample catalog in `src/data/parts.json`.

## Wiring up Supabase (optional, free)

1. Create a project at [supabase.com](https://supabase.com).
2. Run `supabase/schema.sql` in the Dashboard → SQL Editor.
3. Copy `.env.local.example` to `.env.local` and fill in the URL + keys
   (Dashboard → Project Settings → API).
4. Seed the catalog: `node --env-file=.env.local scripts/seed.mjs`

## Deploying to Vercel (free)

Push the repo to GitHub, import it at [vercel.com/new](https://vercel.com/new),
and add the two `NEXT_PUBLIC_SUPABASE_*` env vars. That's it.

## Project map

| Path | What it is |
| --- | --- |
| `src/app/builder` | Main builder: part slots + live 3D viewer with power button |
| `src/app/budget` | Budget → recommended build generator |
| `src/app/parts` | Catalog browser |
| `src/components/viewer` | 3D scene: case, motherboard, GPU, fans, RGB materials |
| `src/lib/compatibility.ts` | Rule engine: sockets, RAM type, wattage, clearances |
| `src/lib/budget.ts` | Budget allocator + greedy compatible-part picker |
| `src/lib/catalog.ts` | Data layer: Supabase with sample-data fallback |
| `supabase/schema.sql` | Tables + RLS policies for parts, prices, saved builds |

## Roadmap

- [ ] Live prices: Best Buy API (has local store availability by zip) + eBay Browse API, cached in `retailer_prices`
- [ ] Supabase Auth + saved builds (schema is already in place)
- [ ] Share builds via URL
- [ ] Better 3D: GLTF case/part models, cable details, glass side panel toggle
- [ ] Amazon PA-API once affiliate account qualifies
