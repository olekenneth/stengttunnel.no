# 🏗️ Arkitektursammenligning: Nåværende vs. Next.js SSG

## 📊 Nåværende Arkitektur (React SPA)

```
┌─────────────────────────────────────────────────────────────┐
│                      Bruker (Browser)                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              GitHub Pages (beta.stengttunnel.no)             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  index.html (tom HTML shell)                          │ │
│  │  + React bundle (app.js, flere hundre KB)             │ │
│  └────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
                    Browser laster JS
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                React App starter (client-side)               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  1. Fetch roads.json                                 │   │
│  │  2. Bruker velger tunneler                           │   │
│  │  3. Fetch status.json for hver valgt tunnel          │   │
│  │  4. Render UI                                        │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼ (3-5 API kall)
┌─────────────────────────────────────────────────────────────┐
│            API (api.stengttunnel.no)                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  GET /roads.json                                      │  │
│  │  GET /oslofjordtunnelen/status.json                   │  │
│  │  GET /atlanterhavstunnelen/status.json                │  │
│  │  ...                                                   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### ⏱️ Tidsbruk ved første besøk:
1. Last HTML shell: ~50ms
2. Last React bundle: ~200-500ms (avhengig av tilkobling)
3. Parse og execute JS: ~100-300ms
4. API-kall roads.json: ~100-300ms
5. API-kall status.json (3x): ~300-900ms
6. Render: ~50-100ms

**Total tid til første visning: 1-2 sekunder** (på god forbindelse)

### ❌ Problemer:
- Blank side mens JS laster
- Mange API-kall fra klient
- Dårlig SEO (crawler ser tom HTML)
- Ingen automatisk oppdatering av data
- Høy last på API ved mange besøkende

---

## 🚀 Ny Arkitektur (Next.js SSG)

```
┌─────────────────────────────────────────────────────────────┐
│           GitHub Actions (Daglig kl 06:00 UTC)              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Trigger: Schedule / Push / Manual                     │ │
│  └────────────────┬───────────────────────────────────────┘ │
└───────────────────┼─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│              Next.js Build Process (CI/CD)                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  1. npm run build                                       │ │
│  │     ├─ Hent roads.json fra API                         │ │
│  │     ├─ Hent status.json for ALLE tunneler              │ │
│  │     └─ Generer statiske HTML-filer                     │ │
│  │                                                          │ │
│  │  2. Output /out/ mappe:                                 │ │
│  │     ├─ index.html (full data innebygd)                 │ │
│  │     ├─ oslofjordtunnelen/index.html                    │ │
│  │     ├─ atlanterhavstunnelen/index.html                 │ │
│  │     ├─ ... (én fil per tunnel)                         │ │
│  │     └─ _next/ (JS bundles)                             │ │
│  └────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼ (Deploy)
┌─────────────────────────────────────────────────────────────┐
│              GitHub Pages (beta.stengttunnel.no)             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Pre-genererte HTML-filer med full data               │ │
│  │  + Minimal JS for interaktivitet                       │ │
│  └────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      Bruker (Browser)                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  1. Øyeblikkelig visning (HTML er klar)               │ │
│  │  2. React hydration for interaktivitet                │ │
│  │  3. localStorage for favoritter                        │ │
│  │  4. (Valgfritt) Client-side refresh ved visibility    │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### ⏱️ Tidsbruk ved første besøk:
1. Last pre-generert HTML: ~50-100ms
2. Øyeblikkelig visning (data er allerede i HTML)
3. Last minimal JS: ~100-200ms (mindre bundle)
4. React hydration: ~50-100ms
5. (Valgfritt) Client-side refresh: ~200-400ms

**Total tid til første visning: 50-100ms** (10-20x raskere!)

### ✅ Fordeler:
- Øyeblikkelig visning av data
- Ingen API-kall ved første last
- Perfekt SEO (full HTML)
- Automatisk daglig oppdatering
- Redusert last på API

---

## 🔄 Dataflyt Sammenligning

### Nåværende (Client-side)

```
Bruker → GitHub Pages → Browser
                          │
                          ├─► API: roads.json
                          ├─► API: tunnel1/status.json
                          ├─► API: tunnel2/status.json
                          └─► API: tunnel3/status.json
                          │
                          ▼
                      Render (1-2 sek)
```

### Ny (Build-time + Hydration)

```
GitHub Actions (06:00 UTC)
    │
    ├─► API: roads.json (1 gang)
    ├─► API: status.json for ALLE (1 gang)
    └─► Generer HTML
         │
         ▼
    GitHub Pages (statisk)
         │
         ▼
    Bruker → Øyeblikkelig visning (<100ms)
         │
         └─► (Valgfritt) Client-side refresh hvis nødvendig
```

---

## 📈 Ytelsessammenligning

| Metrikk | Nåværende (SPA) | Ny (SSG) | Forbedring |
|---------|-----------------|----------|------------|
| **Time to First Byte** | 50ms | 50ms | - |
| **First Contentful Paint** | 500-800ms | 100-150ms | **5-8x raskere** |
| **Time to Interactive** | 1-2 sek | 200-400ms | **5x raskere** |
| **API-kall ved last** | 4-10 | 0 | **100% reduksjon** |
| **JavaScript bundle** | ~500KB | ~200KB | **60% mindre** |
| **SEO score** | 60-70 | 95-100 | **40% bedre** |
| **Data freshness** | Alltid nyeste | Maks 24t gammel | Akseptabelt |

---

## 🗂️ Filstruktur Sammenligning

### Nåværende

```
stengttunnel.no/
├── public/
│   ├── index.html (tom shell)
│   └── images/
├── src/
│   ├── App.tsx (fetch logic)
│   ├── Road.tsx
│   ├── Roads.tsx
│   ├── Header.tsx
│   └── types.ts
└── build/ (output)
    ├── index.html (tom shell)
    ├── static/js/main.*.js (stort bundle)
    └── static/css/main.*.css
```

### Ny (Next.js)

```
stengttunnel.no/
├── app/
│   ├── layout.tsx (root layout)
│   ├── page.tsx (hovedside med data)
│   ├── [tunnel]/
│   │   └── page.tsx (dynamiske tunnel-sider)
│   └── globals.css
├── components/
│   ├── Header.tsx (client component)
│   ├── Road.tsx (client component)
│   ├── Roads.tsx (client component)
│   └── StatusSvg.tsx (server component)
├── lib/
│   ├── api.ts (build-time fetch)
│   └── types.ts
├── public/ (uendret)
└── out/ (output)
    ├── index.html (full data!)
    ├── oslofjordtunnelen/index.html
    ├── atlanterhavstunnelen/index.html
    └── _next/ (optimalisert JS)
```

---

## 🔁 Update Strategi

### Nåværende
```
Bruker besøker → Alltid nyeste data (API-kall)
Ulempe: Treg lasting, høy API-last
```

### Ny (Hybrid)
```
Daglig 06:00: Build → Nye data bakt inn i HTML
              ↓
Bruker besøk: Viser siste build (maks 24t gammel)
              ↓
(Optional) Visibility change → Client-side API-kall for sanntidsdata
```

**Best of both worlds:**
- Rask første visning (static)
- Oppdatert data når bruker kommer tilbake (dynamic)

---

## 🎯 Hvorfor Next.js over alternativer?

| Framework | Fordeler | Ulemper |
|-----------|----------|---------|
| **Next.js** ✅ | - Beste SSG støtte<br>- Hybrid (static + dynamic)<br>- Stort community<br>- Enkel å lære | - Litt overkill for enkel site |
| Gatsby | - Bra for blogs<br>- GraphQL layer | - Tungt oppsett<br>- Tregt build<br>- Community mindre aktivt |
| Astro | - Ultra-rask<br>- Minimal JS | - Nyere, mindre mature<br>- Vanskeligere React integrasjon |
| Vite + Plugin | - Raskest dev server<br>- Minimal config | - Mer manuelt arbeid<br>- Ingen built-in SSG |

**Konklusjon:** Next.js er den tryggeste og mest fremtidsrettede løsningen.

---

## 📅 Oppdateringsfrekvens

### Anbefalt Schedule

```yaml
# Daglig kl 06:00 UTC (07:00/08:00 norsk tid)
schedule:
  - cron: '0 6 * * *'
```

**Hvorfor kl 06:00?**
- Før morgentrafikken
- Etter nattlige veg-arbeider
- Lav trafikk på nettsiden
- Tid til å fikse feil før rush

### Alternative Schedules

```yaml
# Tre ganger daglig
schedule:
  - cron: '0 6,14,22 * * *'  # 06:00, 14:00, 22:00 UTC

# Hver 6. time
schedule:
  - cron: '0 */6 * * *'

# Kun hverdager
schedule:
  - cron: '0 6 * * 1-5'  # Mandag-fredag
```

---

## 🔐 Sikkerhet og Pålitelighet

### Nåværende
- **SPOF:** API må være oppe for at siden skal fungere
- **Ingen fallback:** Hvis API feiler, blank side
- **DDoS risiko:** Mange klienter → mange API-kall

### Ny
- **Resilient:** Siden fungerer selv om API er nede (vis siste data)
- **Fallback:** Hvis build feiler, gammel site er fortsatt live
- **DDoS beskyttelse:** GitHub Pages CDN + statisk innhold
- **Backup trigger:** Manuell rebuild hvis nødvendig

---

## 💰 Kostnads-/Ressurssammenligning

| Ressurs | Nåværende | Ny | Besparelse |
|---------|-----------|-----|------------|
| **API-kall/dag** | ~1000-5000 (bruker-drevet) | ~50 (build-time) | **~99%** |
| **Båndbredde** | Høy (mange requests) | Lav (CDN cache) | **~70%** |
| **Server last** | Høy (real-time) | Minimal (scheduled) | **~95%** |
| **Build tid** | 2 min/deploy | 3-5 min/daglig | Litt mer |
| **Hosting kostnad** | Gratis (Pages) | Gratis (Pages) | - |

---

## 🎓 Læringskurve

### For utviklere som kjenner React:

```
React SPA → Next.js SSG
  │
  ├─ Kjent: React components (95% likt)
  ├─ Nytt: Server vs Client Components
  ├─ Nytt: App Router file-based routing
  ├─ Nytt: Build-time data fetching
  └─ Estimert læretid: 2-4 timer
```

**Dokumentasjon:**
- https://nextjs.org/docs
- https://nextjs.org/learn

---

## ✅ Sjekkliste: Er Next.js SSG riktig valg?

- [x] Vil ha raskere lasting
- [x] Trenger bedre SEO
- [x] Kan akseptere data som er maks 24t gammel
- [x] Vil redusere API-last
- [x] Har GitHub Actions tilgjengelig
- [x] Bruker allerede React
- [x] Vil ha moderne utvikleropplevelse

**Alle punkter er krysset av - Next.js SSG er riktig valg! ✨**

---

**Neste steg:** Les `MIGRATION_PLAN.md` for detaljert implementering.
