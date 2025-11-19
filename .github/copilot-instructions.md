Purpose
This repository is a small Create-React-App (TypeScript) site that shows tunnel/road status. The UI is composed of simple, small React components that fetch JSON from a public API and render cards, feeds and ads. The main intent of this instruction file is to give an AI coding agent the high-impact facts to be productive immediately.

Quick facts
- Framework: Create React App (TypeScript) using `react-scripts`.
- Styling: plain CSS files in `src/` and images in `public/` (uses `semantic-ui-react` + `fomantic-ui-css`).
- Build system: `npm run build` (see `package.json`). Post-build step runs `purgecss` via `postbuild` script.
- CI/CD: `.github/workflows/main.yml` builds, runs `npm run github` (deploy helper) and deploys the `build/` artifact to `gh-pages`.

Key commands
- Install and run locally: `npm install` then `npm start` (dev server at http://localhost:3000).
- Run tests: `npm test` (CRA test runner).
- Build: `npm run build` (produces `build/`). Note: `postbuild` runs `purgecss` to trim CSS.
- Deploy helper: `npm run github` runs `scripts/github.sh` (creates `build/CNAME` and a `404.html` symlink).

Important files / patterns (examples)
- `src/App.tsx` — top-level component: fetches the list of roads from https://api.stengttunnel.no/roads.json, stores favorites in `localStorage`, and wires `Header` + `Roads`.
- `src/types.ts` — authoritative shape for data: `IRoad`, `IRoadStatus`, `IMessage`, `IGPS`. When adding code that handles road data, follow these types.
- `src/Road.tsx` — per-road status component: fetches the individual road URL (from `IRoad.url`) and renders `IRoadStatus`. Uses `visibilitychange` to trigger updates while the page is visible.
- `src/Roads.tsx` — composes multiple `Road` components and injects ads; note random selection between `Ad` and `Annonse` and mobile scrolling behavior.
- `src/Header.tsx` — Dropdown that maps `IRoad` entries to selectable favorites; uses `urlFriendly` to build paths like `https://stengttunnel.no/<urlFriendly>`.
- `scripts/github.sh` — small deploy helper that writes `CNAME` and a `404.html` symlink used by GitHub Pages.
- `.github/workflows/main.yml` — CI: installs node (reads version from `.nvmrc`), runs `npm i`, `npm run build`, `npm run github`, `npm run test`, then publishes `build/` to GitHub Pages.

Integration & runtime notes
- External API: the app expects a roads index at `https://api.stengttunnel.no/roads.json` and that each `IRoad.url` returns the `IRoadStatus` JSON that matches `src/types.ts`.
- Assets: status images are referenced at `/status/<green|yellow|red>.png` (in `public/`), and other images live under `public/images/`.
- Sharing: `Road.tsx` uses Clipboard API + `navigator.share` when available — be careful when testing in headless browsers or CI.

Conventions & gotchas for code changes
- Keep components small and local-state driven (hooks). There is no centralized global store.
- Avoid changing class names or CSS selectors without checking the `postbuild` `purgecss` step: it scans `build/index.html` and `build/static/js/*.js` only. Dynamically generated class names or classes only referenced in strings could be removed in production.
- Tests use CRA's test runner (Jest + React Testing Library). `App.test.tsx` exists as an example; follow its patterns for component tests.
- For new endpoints or data fields, update `src/types.ts` first and then the components that consume those types.

When modifying CI/deploy
- The workflow uses `.nvmrc` to select Node version (see `.nvmrc` at repo root). Keep that in sync if you change runtime requirements.
- `npm run github` is executed in CI before tests; it alters the `build/` directory (adds `CNAME` and `404.html`) and is expected by the deploy job which uploads `build/` as an artifact.

If you need more context
- Inspect: `src/*` (App, Header, Roads, Road, Ad, Annonse, Status) and `public/` (images, manifest).
- Data contract: `src/types.ts` is the single source of truth for road-related JSON.

If anything above is unclear or you want the instructions adjusted (more/less detail, examples, or run commands), tell me which parts to expand and I'll iterate.
