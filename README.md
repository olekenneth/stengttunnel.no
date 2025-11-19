# stengttunnel.no

A small Create React App (TypeScript) site that shows tunnel/road status. The UI is composed of compact React components that fetch JSON from a public API and render per-road cards, feeds and lightweight ads.

Key points
- Framework: Create React App (TypeScript) using `react-scripts`.
- UI: `semantic-ui-react` + `fomantic-ui-css`.
- API: reads road list from `https://api.stengttunnel.no/roads.json` and individual road status JSON from each `IRoad.url`.

Quick start (local)

1. Use the Node version in `.nvmrc` (recommended).
2. Install dependencies:

```bash
npm install
```

3. Start dev server:

```bash
npm start
```

App runs at http://localhost:3000 and reloads on changes.

Scripts
- `npm start` — development server
- `npm test` — CRA test runner
- `npm run build` — production bundle (output in `build/`)
- `npm run github` — runs `./scripts/github.sh`, used in CI to add `CNAME` and `404.html` to `build/`

Build / Postbuild
- `postbuild` runs `purgecss` to trim unused CSS from `build/static/css` using `build/index.html` and `build/static/js/*.js` as content sources. Be careful when renaming CSS classes used only from strings or templates.

Deploy / CI
- GitHub Actions workflow is in `.github/workflows/main.yml` — it installs node (reads `.nvmrc`), runs `npm i`, `npm run build`, `npm run github`, `npm run test`, then publishes the `build/` artifact to GitHub Pages (via `peaceiris/actions-gh-pages`).

Files and patterns to know
- `src/App.tsx` — top-level component: fetches `roads.json`, stores favorites in `localStorage`, and composes `Header` + `Roads`.
- `src/types.ts` — authoritative data shapes (IRoad, IRoadStatus, IMessage, IGPS). Update types first when adding fields.
- `src/Road.tsx` — per-road presentation: fetches `IRoad.url` and renders `IRoadStatus`. Uses `visibilitychange` to trigger updates while page is visible. This file now imports an inline SVG component for the traffic light (status template).
- `src/Roads.tsx` — composes `Road` components and injects `Ad`/`Annonse` alternately; contains mobile-scroll helper.
- `src/Header.tsx` — Dropdown to pick favorites; builds external links like `https://stengttunnel.no/<urlFriendly>`.
- `public/status/` — images for traffic-light; currently the project uses an inline SVG template (moved into `src/` for React import) and previously used PNGs as fallback.
- `scripts/github.sh` — writes `build/CNAME` and symlinks `404.html` for GitHub Pages.

Assets and sharing
- Traffic-light images are under `public/status/`. If you switch to an inline SVG template, move it into `src/` (or import it via SVGR) so React can set `className` on the `<svg>` element.
- `Road.tsx` uses Clipboard API and `navigator.share` when available — tests running in headless CI may need to mock these.

Testing notes
- Tests use the CRA runner (Jest + React Testing Library). See `App.test.tsx` for examples. Keep tests small and component-focused.

Conventions & gotchas
- Keep components small and local-state driven (hooks); there is no global store.
- When adding or renaming classes referenced only inside templates or inline SVGs, remember `purgecss` may strip them during `postbuild` if they're not present in the built HTML/JS.
- For any change to the API contract, update `src/types.ts` first, then consumers.

How to contribute
- Create a branch, add a small unit/component test for behavioral changes, and open a pull request against `main`.

Contact / deployment
- The CI job expects `.nvmrc` to be accurate; update it if you change Node major versions.
- `npm run github` is run in CI before tests to prepare the `build/` directory for deployment.

License
- See `LICENSE` at repository root.

If anything in this README is out of date or you'd like a short developer checklist (pre-merge build/tests/lint hooks), tell me which area to expand and I’ll update it.
