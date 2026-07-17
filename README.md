# Patricio Montes Güemez Portfolio

Static multilingual portfolio built with Next.js App Router, TypeScript, and Tailwind CSS v4.
It is designed for GitHub Pages-style static hosting and exports to `out/`.

## Quick path

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the full local verification:
   ```bash
   npm run verify
   ```
3. Build the static export:
   ```bash
   npm run build
   ```

## Details

| Topic | Decision |
| --- | --- |
| Runtime | Node.js 22.13+ for local verification and GitHub Actions. |
| Rendering | Next.js App Router with `output: "export"` in `next.config.ts`. |
| Styling | Tailwind CSS v4 through `@tailwindcss/postcss` and `@import "tailwindcss"`. |
| Languages | Client-side ES/EN/PT selector; no server-only locale routing. |
| Themes | Client-side visual theme selector with accessible button controls. |
| Content source | Verified CV facts are curated in `src/content/portfolio.ts`. |
| Privacy | DNI, CUIL, birth date, home address, and phone numbers are intentionally omitted. |
| Output | `next build` emits static files into `out/`. |

## GitHub Pages note

Pushes to `main` and manual runs of `.github/workflows/pages.yml` verify and deploy the static export to GitHub Pages.
The workflow builds once with the project-site base path:

```bash
NEXT_PUBLIC_BASE_PATH=/portfolio npm run build
```

It also adds `out/.nojekyll` so Next.js `_next` assets are served correctly.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local Next.js dev server. |
| `npm run typecheck` | Run TypeScript without emitting files. |
| `npm run lint` | Run ESLint. |
| `npm test` | Run content invariant tests with `node:test`. |
| `npm run build` | Build and static-export the site. |
| `npm run verify` | Run typecheck, lint, tests, and build in sequence. |

## Content checklist

- [x] Public identity and contact use verified CV facts.
- [x] Sensitive personal details are excluded from public content.
- [x] Education status avoids unverified graduation/current-status claims.
- [x] English training avoids fluency overclaims.
- [x] No PDF extraction package is added to project dependencies.
