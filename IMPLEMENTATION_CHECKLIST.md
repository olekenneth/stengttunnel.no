# ✅ Next.js Migreringssjekkliste

Bruk denne sjekklisten under implementering av migreringen til Next.js SSG.

## 📋 Pre-implementering

- [ ] Les gjennom `MIGRATION_PLAN.md`
- [ ] Opprett feature branch: `git checkout -b nextjs-migration`
- [ ] Ta backup av nåværende `package.json`
- [ ] Dokumenter nåværende build-kommandoer

---

## 🔧 Fase 1: Oppsett (2 timer)

- [ ] Installer Next.js: `npx create-next-app@latest --help` (for å se opsjoner)
- [ ] Eller installer manuelt: `npm install next react react-dom`
- [ ] Installer dev dependencies: `npm install -D @types/react @types/node typescript`
- [ ] Opprett `next.config.js` med `output: 'export'`
- [ ] Oppdater `package.json` scripts:
  - [ ] `"dev": "next dev"`
  - [ ] `"build": "next build"`
  - [ ] `"start": "next start"`
- [ ] Test at Next.js kjører: `npm run dev`

---

## 📁 Fase 2: Mappestruktur (1 time)

- [ ] Opprett `app/` mappe i root
- [ ] Opprett `components/` mappe i root
- [ ] Opprett `lib/` mappe i root
- [ ] Kopier `public/` (ingen endring nødvendig)
- [ ] **Ikke slett `src/` ennå** (bruk som referanse)

---

## 🔌 Fase 3: API og Types (3 timer)

### lib/types.ts
- [ ] Kopier `src/types.ts` til `lib/types.ts`
- [ ] Verifiser at alle interfaces er eksportert

### lib/api.ts
- [ ] Opprett fil
- [ ] Implementer `getAllRoads()`
- [ ] Implementer `getRoadStatus(urlFriendly: string)`
- [ ] Implementer `getAllRoadStatuses()`
- [ ] Test med simple node script eller i dev mode

---

## 🎨 Fase 4: Layout og Sider (6 timer)

### app/layout.tsx
- [ ] Opprett root layout
- [ ] Legg til `<html>` og `<body>` tags
- [ ] Inkluder Semantic UI CSS link
- [ ] Legg til metadata (title, description, keywords)
- [ ] Legg til Google Analytics script
- [ ] Test at siden rendrer i browser

### app/globals.css
- [ ] Opprett fil
- [ ] Kopier CSS fra `src/index.css`
- [ ] Importer i `layout.tsx`

### app/page.tsx
- [ ] Opprett hovedside
- [ ] Hent data med `getAllRoads()` og `getAllRoadStatuses()`
- [ ] Render `<Header>` og `<Roads>` komponenter
- [ ] Test at siden bygger: `npm run build`

### app/[tunnel]/page.tsx
- [ ] Opprett dynamisk rute
- [ ] Implementer `generateStaticParams()`
- [ ] Implementer `generateMetadata()`
- [ ] Hent data for spesifikk tunnel
- [ ] Test at alle tunnel-sider genereres

---

## 🧩 Fase 5: Komponenter (6 timer)

For hver komponent, følg denne prosessen:

### Header.tsx
- [ ] Kopier fra `src/Header.tsx` til `components/Header.tsx`
- [ ] Legg til `'use client'` øverst
- [ ] Oppdater imports (bruk `@/lib/types`)
- [ ] Test interaktivitet (dropdown)

### Road.tsx
- [ ] Kopier fra `src/Road.tsx`
- [ ] Legg til `'use client'`
- [ ] Legg til `initialStatus` prop
- [ ] Oppdater API-kall for client-side updates
- [ ] Test visibility-based updates

### Roads.tsx
- [ ] Kopier fra `src/Roads.tsx`
- [ ] Legg til `'use client'`
- [ ] Legg til `initialStatuses` prop
- [ ] Test liste-rendering

### StatusSvg.tsx
- [ ] Kopier fra `src/StatusSvg.tsx`
- [ ] Kan være server component (ingen interaktivitet)
- [ ] Test rendering

### Feed.tsx
- [ ] Kopier fra `src/Feed.tsx`
- [ ] Test melding-visning

### Ad.tsx
- [ ] Kopier fra `src/Ad.tsx`
- [ ] Legg til `'use client'`
- [ ] Test Google AdSense

### Annonse.tsx
- [ ] Kopier fra `src/Annonse.tsx`
- [ ] Legg til `'use client'`
- [ ] Test iframe-annonse

---

## 🔧 Fase 6: Konfigurasjon (2 timer)

### tsconfig.json
- [ ] Oppdater for Next.js
- [ ] Legg til paths: `"@/*": ["./*"]`
- [ ] Verifiser at TypeScript fungerer

### .gitignore
- [ ] Legg til `/.next/`
- [ ] Legg til `/out/`
- [ ] Legg til `next-env.d.ts`

### ESLint
- [ ] Installer: `npm install -D eslint-config-next`
- [ ] Opprett `.eslintrc.json`
- [ ] Kjør: `npm run lint` (hvis du legger til script)

---

## 🤖 Fase 7: GitHub Actions (2 timer)

### .github/workflows/daily-build.yml
- [ ] Opprett fil
- [ ] Legg til schedule cron: `'0 6 * * *'`
- [ ] Legg til workflow_dispatch for manuell trigger
- [ ] Legg til build-steg
- [ ] Legg til deploy-steg
- [ ] Opprett CNAME fil i workflow
- [ ] Test workflow manuelt fra GitHub UI

---

## 🧪 Fase 8: Testing (4 timer)

### Lokal testing
- [ ] Kjør dev server: `npm run dev`
- [ ] Test alle routes:
  - [ ] `/` (hovedside)
  - [ ] `/oslofjordtunnelen` (eksempel tunnel-side)
  - [ ] `/atlanterhavstunnelen` (annen tunnel)

### Funksjonstesting
- [ ] Velg tunneler fra dropdown
- [ ] Verifiser localStorage (favoritter)
- [ ] Test direkte linker
- [ ] Test status-ikoner (grønn/gul/rød)
- [ ] Test melding-visning
- [ ] Test annonser
- [ ] Test share-funksjonalitet
- [ ] Test på mobil (responsivt design)

### Build testing
- [ ] Kjør production build: `npm run build`
- [ ] Verifiser at `/out/` mappe inneholder:
  - [ ] `index.html`
  - [ ] Alle tunnel-sider
  - [ ] Static assets
- [ ] Serve lokalt: `npx serve out`
- [ ] Test alle funksjoner i production mode

### SEO testing
- [ ] Sjekk `<title>` tags
- [ ] Sjekk `<meta>` tags
- [ ] Verifiser OpenGraph metadata
- [ ] Test at sider er crawlable (view source)

---

## 🚀 Fase 9: Deployment (2 timer)

### Test-deployment
- [ ] Push branch til GitHub
- [ ] Sjekk at workflow kjører
- [ ] Verifiser deployment på GitHub Pages
- [ ] Test live site grundig

### Production deployment
- [ ] Merge til `main` branch
- [ ] Overvåk deployment
- [ ] Test beta.stengttunnel.no
- [ ] Sjekk at daglig cron er aktiv

---

## 📊 Post-deployment

### Overvåking (første uke)
- [ ] Sjekk at daglig build kjører (kl 06:00 UTC)
- [ ] Verifiser at nye data vises
- [ ] Overvåk Google Analytics
- [ ] Sjekk feillogger i GitHub Actions

### Opprydding
- [ ] Slett `src/` mappe (når alt er bekreftet fungerende)
- [ ] Slett `build/` mappe
- [ ] Fjern `react-scripts` fra dependencies
- [ ] Oppdater README.md med nye instruksjoner
- [ ] Arkiver gamle workflow-filer (hvis noen)

---

## 🆘 Feilsøking

### Build feiler
- [ ] Sjekk TypeScript errors: `npx tsc --noEmit`
- [ ] Sjekk console for API errors
- [ ] Verifiser at alle deps er installert
- [ ] Sjekk `next.config.js` syntax

### GitHub Actions feiler
- [ ] Sjekk workflow logs i GitHub
- [ ] Verifiser at GitHub Pages er aktivert
- [ ] Sjekk at permissions er korrekt satt
- [ ] Test build lokalt først

### Data vises ikke
- [ ] Verifiser API-endepunkter
- [ ] Sjekk network tab i browser
- [ ] Sjekk at `revalidate: 0` er satt
- [ ] Verifiser JSON parsing

### Client-side ikke fungerer
- [ ] Sjekk at `'use client'` er lagt til
- [ ] Verifiser at hydration ikke feiler
- [ ] Sjekk console for React errors
- [ ] Test at JavaScript er aktivert i browser

---

## ⏱️ Tidsestimater per fase

- **Fase 1-2:** ~3 timer (oppsett og struktur)
- **Fase 3-4:** ~9 timer (data og sider)
- **Fase 5:** ~6 timer (komponenter)
- **Fase 6-7:** ~4 timer (config og CI/CD)
- **Fase 8-9:** ~6 timer (testing og deployment)

**Total:** ~28 timer (inkl. buffer for debugging)

---

## 💡 Tips

1. **Commit ofte** - Små commits gjør rollback enklere
2. **Test underveis** - Ikke vent til slutten
3. **Behold `src/` som referanse** - Slett først når alt fungerer
4. **Bruk TypeScript** - Catch feil tidlig
5. **Les Next.js docs** - https://nextjs.org/docs

---

## 📞 Hjelp

Hvis du står fast:
- Next.js dokumentasjon: https://nextjs.org/docs
- GitHub Actions docs: https://docs.github.com/en/actions
- Community: https://github.com/vercel/next.js/discussions

---

**Lykke til med migreringen! 🚀**
