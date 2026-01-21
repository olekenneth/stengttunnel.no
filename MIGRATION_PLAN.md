# 🚀 Migreringsplan: Next.js Static Site Generation

## 📊 Oversikt

Denne planen beskriver hvordan stengttunnel.no skal konverteres fra en React SPA til en Next.js statisk generert side med daglige rebuilds.

**Mål:**
- ✅ Statisk generert HTML for alle sider
- ✅ Automatisk rebuild minst én gang daglig
- ✅ Bedre SEO med pre-rendret innhold
- ✅ Raskere lasting (ingen API-kall på klient-side ved første visning)
- ✅ Beholde interaktive funksjoner (favoritter, deling)

---

## 🏗️ Ny Arkitektur

### Current (React SPA)
```
Bruker → GitHub Pages → React App → API kall → Data vises
         (HTML shell)   (client-side)
```

### New (Next.js SSG)
```
GitHub Actions (daglig kl 06:00)
    ↓
Build: Next.js henter data fra API
    ↓
Genererer statiske HTML-filer
    ↓
Deploy til GitHub Pages
    ↓
Bruker → Statisk HTML (øyeblikkelig visning)
         ↓
Client-side hydration for interaktivitet
```

---

## 📝 Steg-for-steg Migreringsplan

### **Fase 1: Prosjektoppsett (Dag 1)**

#### 1.1 Installer Next.js
```bash
# Opprett ny Next.js app i separat branch
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir

# Eller manuelt:
npm install next@latest react@latest react-dom@latest
npm install --save-dev @types/react @types/node typescript
```

#### 1.2 Oppdater package.json
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "export": "next build && next export"
  }
}
```

#### 1.3 Konfigurer next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Static export for GitHub Pages
  basePath: process.env.NODE_ENV === 'production' ? '' : '',
  images: {
    unoptimized: true // Required for static export
  },
  trailingSlash: true // Better for GitHub Pages
}

module.exports = nextConfig
```

---

### **Fase 2: Mappestruktur (Dag 1)**

#### Ny struktur:
```
/home/user/stengttunnel.no/
├── app/                           # Next.js App Router
│   ├── layout.tsx                 # Root layout (erstatter index.html)
│   ├── page.tsx                   # Hovedside (/)
│   ├── [tunnel]/                  # Dynamiske ruter
│   │   └── page.tsx               # Tunnel-spesifikke sider
│   └── globals.css                # Global CSS
├── components/                    # React komponenter (flyttes fra src/)
│   ├── Header.tsx
│   ├── Road.tsx
│   ├── Roads.tsx
│   ├── Feed.tsx
│   ├── Ad.tsx
│   ├── Annonse.tsx
│   └── StatusSvg.tsx
├── lib/                           # Hjelpefunksjoner
│   ├── api.ts                     # API kall (build-time)
│   ├── types.ts                   # TypeScript types
│   └── utils.ts                   # Utilities
├── public/                        # Statiske filer (uendret)
│   ├── images/
│   ├── status/
│   └── vv_logo.png
└── .github/workflows/
    └── daily-build.yml            # Daglig rebuild

```

---

### **Fase 3: Dataflyt og API-integrasjon (Dag 2)**

#### 3.1 Opprett API-hjelpefunksjoner (`lib/api.ts`)

```typescript
// lib/api.ts
import type { IRoad, IRoadStatus } from './types'

const API_BASE = 'https://api.stengttunnel.no'

export async function getAllRoads(): Promise<IRoad[]> {
  const res = await fetch(`${API_BASE}/roads.json`, {
    next: { revalidate: 0 } // Always fetch fresh during build
  })

  if (!res.ok) {
    throw new Error('Failed to fetch roads')
  }

  return res.json()
}

export async function getRoadStatus(urlFriendly: string): Promise<IRoadStatus> {
  const res = await fetch(`${API_BASE}/${urlFriendly}/status.json`, {
    next: { revalidate: 0 }
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch status for ${urlFriendly}`)
  }

  return res.json()
}

export async function getAllRoadStatuses(): Promise<Map<string, IRoadStatus>> {
  const roads = await getAllRoads()
  const statuses = new Map<string, IRoadStatus>()

  // Fetch all statuses in parallel
  const statusPromises = roads.map(async (road) => {
    try {
      const status = await getRoadStatus(road.urlFriendly)
      statuses.set(road.urlFriendly, status)
    } catch (error) {
      console.error(`Error fetching ${road.urlFriendly}:`, error)
    }
  })

  await Promise.all(statusPromises)
  return statuses
}
```

#### 3.2 Flytt types til lib/types.ts
```typescript
// Kopier alle interfaces fra src/types.ts
export interface IRoad {
  roadName: string
  urlFriendly: string
  url: string
}

export interface IRoadStatus {
  messages: IMessage[]
  status: 'green' | 'yellow' | 'red'
  statusMessage: string
  statusCode: number
  gps?: { lat: number; lon: number }
}

// ... resten av types
```

---

### **Fase 4: Komponenter - Konvertering (Dag 2-3)**

#### 4.1 Root Layout (`app/layout.tsx`)

Erstatter `public/index.html`:

```tsx
import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: 'Stengttunnel.no - Stengte tunneler på Vestlandet',
  description: 'Oversikt over stengte tunneler på Vestlandet',
  keywords: 'tunnel, stengt, vestlandet, trafikk, vegvesen',
  openGraph: {
    title: 'Stengttunnel.no',
    description: 'Oversikt over stengte tunneler på Vestlandet',
    images: ['/images/stengttunnel-logo.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="no">
      <head>
        {/* Semantic UI CSS */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/fomantic-ui@2.9.4/dist/semantic.min.css"
        />
      </head>
      <body>
        {children}

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=UA-XXXXXXXX-X"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'UA-XXXXXXXX-X');
          `}
        </Script>
      </body>
    </html>
  )
}
```

#### 4.2 Hovedside (`app/page.tsx`)

Erstatter `App.tsx`:

```tsx
import { getAllRoads, getAllRoadStatuses } from '@/lib/api'
import Header from '@/components/Header'
import Roads from '@/components/Roads'

export const revalidate = 0 // Disable cache for builds

export default async function HomePage() {
  // Fetch data at build time (server-side)
  const roads = await getAllRoads()
  const statuses = await getAllRoadStatuses()

  // Convert Map to plain object for client components
  const statusesObj = Object.fromEntries(statuses)

  return (
    <main className="ui container">
      <Header roads={roads} />
      <Roads
        roads={roads}
        initialStatuses={statusesObj}
      />
    </main>
  )
}
```

#### 4.3 Dynamiske ruter (`app/[tunnel]/page.tsx`)

For direkte linker som `/oslofjordtunnelen`:

```tsx
import { getAllRoads, getRoadStatus } from '@/lib/api'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Road from '@/components/Road'

// Generate static params for all tunnels
export async function generateStaticParams() {
  const roads = await getAllRoads()

  return roads.map((road) => ({
    tunnel: road.urlFriendly,
  }))
}

export async function generateMetadata({ params }: { params: { tunnel: string } }) {
  const roads = await getAllRoads()
  const road = roads.find(r => r.urlFriendly === params.tunnel)

  if (!road) {
    return {
      title: 'Tunnel ikke funnet',
    }
  }

  return {
    title: `${road.roadName} - Stengttunnel.no`,
    description: `Status for ${road.roadName}`,
  }
}

export default async function TunnelPage({ params }: { params: { tunnel: string } }) {
  const roads = await getAllRoads()
  const road = roads.find(r => r.urlFriendly === params.tunnel)

  if (!road) {
    notFound()
  }

  const status = await getRoadStatus(params.tunnel)

  return (
    <main className="ui container">
      <Header roads={roads} initialSelected={[params.tunnel]} />
      <Road
        road={road}
        initialStatus={status}
        showShare={true}
      />
    </main>
  )
}
```

#### 4.4 Konverter komponenter til Client Components

De fleste UI-komponenter må bruke `'use client'` direktivet siden de har interaktivitet:

**Header.tsx** - Needs client-side for dropdown interaction:
```tsx
'use client'

import { useState, useEffect } from 'react'
import { Dropdown } from 'semantic-ui-react'
import type { IRoad } from '@/lib/types'

interface Props {
  roads: IRoad[]
  initialSelected?: string[]
}

export default function Header({ roads, initialSelected = [] }: Props) {
  const [favorites, setFavorites] = useState<string[]>(initialSelected)

  useEffect(() => {
    // Load from localStorage
    const stored = localStorage.getItem('favorites')
    if (stored) {
      setFavorites(JSON.parse(stored))
    }
  }, [])

  const handleChange = (value: string[]) => {
    setFavorites(value)
    localStorage.setItem('favorites', JSON.stringify(value))
  }

  // ... rest of component
}
```

**Road.tsx** - Needs client-side for visibility updates:
```tsx
'use client'

import { useState, useEffect } from 'react'
import type { IRoad, IRoadStatus } from '@/lib/types'
import StatusSvg from './StatusSvg'
import Feed from './Feed'

interface Props {
  road: IRoad
  initialStatus: IRoadStatus
  showShare?: boolean
}

export default function Road({ road, initialStatus, showShare = false }: Props) {
  const [status, setStatus] = useState<IRoadStatus>(initialStatus)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Re-fetch on visibility change (existing logic)
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        setLoading(true)
        try {
          const res = await fetch(`/api/status/${road.urlFriendly}`)
          const data = await res.json()
          setStatus(data)
        } catch (error) {
          console.error('Failed to fetch status:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [road.urlFriendly])

  // ... rest of component (mostly unchanged)
}
```

---

### **Fase 5: Client-side API Route (for oppdateringer) (Dag 3)**

For å støtte client-side oppdateringer når brukeren kommer tilbake til siden:

#### Opprett `app/api/status/[tunnel]/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getRoadStatus } from '@/lib/api'

export async function GET(
  request: NextRequest,
  { params }: { params: { tunnel: string } }
) {
  try {
    const status = await getRoadStatus(params.tunnel)
    return NextResponse.json(status)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch status' },
      { status: 500 }
    )
  }
}
```

**Viktig:** Denne ruten vil bare fungere i dev-modus. For produksjon med static export, må vi enten:
- Akseptere at oppdateringer går direkte til original API
- Eller sette opp en serverless function (Vercel/Netlify)

For GitHub Pages må vi fortsette å bruke original API for client-side updates.

---

### **Fase 6: Styling (Dag 3)**

#### 6.1 Opprett `app/globals.css`

Flytt all CSS fra `src/index.css`:

```css
/* app/globals.css */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.App {
  text-align: left;
  padding-top: 50px;
}

/* ... rest of CSS from index.css */
```

#### 6.2 PurgeCSS
Flytt PurgeCSS config til Next.js byggesystem eller fjern hvis ikke nødvendig.

---

### **Fase 7: Daglig Rebuild med GitHub Actions (Dag 4)**

#### Opprett `.github/workflows/daily-build.yml`:

```yaml
name: Daily Build and Deploy

on:
  # Daglig rebuild kl 06:00 UTC (07:00/08:00 norsk tid)
  schedule:
    - cron: '0 6 * * *'

  # Også ved push til main (for testing)
  push:
    branches: [ main ]

  # Manuell trigger
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '24'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build Next.js site
        run: npm run build
        env:
          NODE_ENV: production

      - name: Create CNAME
        run: echo "beta.stengttunnel.no" > ./out/CNAME

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './out'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**Forklaring:**
- `schedule: cron: '0 6 * * *'` - Kjører kl 06:00 UTC hver dag
- `workflow_dispatch` - Tillater manuell kjøring fra GitHub UI
- `push: branches: [main]` - Kjører også ved push (for testing/hotfixes)

#### Flere daglige rebuilds (valgfritt)

Hvis du vil ha flere oppdateringer per dag:

```yaml
schedule:
  - cron: '0 6,12,18 * * *'  # Kl 06:00, 12:00, 18:00 UTC
```

---

### **Fase 8: Konfigurasjon og finpuss (Dag 4)**

#### 8.1 TypeScript config

Oppdater `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

#### 8.2 ESLint config

```bash
npm install --save-dev eslint-config-next
```

`.eslintrc.json`:
```json
{
  "extends": ["next/core-web-vitals", "next/typescript"]
}
```

#### 8.3 Oppdater .gitignore

```gitignore
# Next.js
/.next/
/out/
next-env.d.ts

# Old build (kan fjernes etter migrering)
/build/

# Dependencies
/node_modules/

# Testing
/coverage/

# Production
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local

# Vercel
.vercel
```

---

### **Fase 9: Testing (Dag 5)**

#### 9.1 Lokale tester

```bash
# Dev server (med hot reload)
npm run dev
# Besøk http://localhost:3000

# Production build test
npm run build
npx serve out
# Besøk http://localhost:3000
```

#### 9.2 Test-sjekkliste

- [ ] Alle tunneler vises på forsiden
- [ ] Dropdown fungerer (velg tunneler)
- [ ] Favoritter lagres i localStorage
- [ ] Direkte linker fungerer (f.eks. `/oslofjordtunnelen`)
- [ ] Status vises korrekt (grønn/gul/rød)
- [ ] Meldinger fra Statens Vegvesen vises
- [ ] Annonser vises korrekt
- [ ] Share-funksjonalitet fungerer
- [ ] Visibility-based updates fungerer
- [ ]Responsivt design (mobil/desktop)
- [ ] SEO metadata er korrekt

#### 9.3 Oppdater eksisterende tester

Flytt tester fra `src/` til passende plassering og oppdater for Next.js:

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom
```

`jest.config.js`:
```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
}

module.exports = createJestConfig(customJestConfig)
```

---

### **Fase 10: Deployment (Dag 5)**

#### 10.1 Deploy til test-branch først

```bash
git checkout -b nextjs-migration
git add .
git commit -m "feat: migrate to Next.js with SSG"
git push origin nextjs-migration
```

#### 10.2 Test på GitHub Pages

Oppdater workflow til å deploye fra test-branch midlertidig, eller bruk GitHub Pages preview.

#### 10.3 Produksjons-deployment

Når alt er testet:
```bash
git checkout main
git merge nextjs-migration
git push origin main
```

GitHub Actions vil automatisk bygge og deploye.

---

## 🔄 Dataflyt Etter Migrering

### Build-time (GitHub Actions - daglig kl 06:00)

```
1. GitHub Actions trigger (schedule/push)
   ↓
2. npm run build
   ↓
3. Next.js henter data fra API:
   - getAllRoads() → roads.json
   - getAllRoadStatuses() → status for hver tunnel
   ↓
4. Genererer statiske HTML-filer:
   - / (hovedside med alle data)
   - /[tunnel]/ (én side per tunnel)
   ↓
5. Output til /out/ mappe
   ↓
6. Deploy til GitHub Pages
```

### Runtime (Bruker besøker siden)

```
1. Bruker besøker beta.stengttunnel.no
   ↓
2. GitHub Pages serverer pre-generert HTML
   ↓
3. Øyeblikkelig visning (ingen API-kall)
   ↓
4. React hydration for interaktivitet
   ↓
5. Bruker velger favoritter → localStorage
   ↓
6. Hvis bruker forlater og kommer tilbake:
   → Client-side API-kall for oppdatert status
```

---

## 📦 Avhengigheter

### Nye avhengigheter
```bash
npm install next@latest
```

### Kan fjernes (etter migrering)
```bash
npm uninstall react-scripts
```

### Beholdes
- react
- react-dom
- semantic-ui-react
- fomantic-ui-css
- react-ga
- typescript

---

## ⚠️ Potensielle Utfordringer og Løsninger

### 1. **localStorage i Server Components**

**Problem:** Server components kan ikke bruke localStorage.

**Løsning:** Bruk `'use client'` for komponenter som trenger localStorage (Header, Roads).

### 2. **API rate limiting**

**Problem:** Hvis API-en har rate limiting kan build feile.

**Løsning:**
- Legg til retry-logikk i `lib/api.ts`
- Bruk `Promise.all()` med limit (ikke fetche alle på en gang)

### 3. **Build-tid**

**Problem:** Henting av alle tunneler kan ta tid.

**Løsning:**
- Parallel fetching med `Promise.all()`
- Eventuelt cache API-responser med CDN

### 4. **Google AdSense**

**Problem:** AdSense må lastes på klient-siden.

**Løsning:** Bruk Next.js `<Script strategy="afterInteractive">` (allerede i layout).

### 5. **Client-side updates**

**Problem:** Static export støtter ikke API routes i produksjon.

**Løsning:** La client-side updates gå direkte til https://api.stengttunnel.no/

---

## 🎯 Suksesskriterier

- ✅ Siden bygges automatisk minst én gang daglig
- ✅ Alle tunneler får oppdatert status ved hver build
- ✅ Førstegangs visning er øyeblikkelig (pre-rendret HTML)
- ✅ SEO forbedres (alle sider er indexerbare)
- ✅ Alle eksisterende funksjoner fungerer (favoritter, deling, etc.)
- ✅ Backup: Manuell trigger av build er mulig
- ✅ Deployment er automatisk ved push til main

---

## 📅 Tidsestimat

| Fase | Oppgave | Estimat |
|------|---------|---------|
| 1 | Prosjektoppsett | 2 timer |
| 2 | Mappestruktur | 1 time |
| 3 | API-integrasjon | 3 timer |
| 4 | Komponentkonvertering | 6 timer |
| 5 | Client-side API | 1 time |
| 6 | Styling | 2 timer |
| 7 | GitHub Actions | 2 timer |
| 8 | Konfigurasjon | 1 time |
| 9 | Testing | 4 timer |
| 10 | Deployment | 2 timer |
| **Total** | | **~24 timer** |

---

## 🔙 Rollback Plan

Hvis noe går galt:

1. **Rask rollback:**
   ```bash
   git revert HEAD
   git push origin main
   ```

2. **Full rollback:**
   - Merger fra backup-branch
   - Eller revert til siste working commit

3. **Keep old site live:**
   - La gamle React SPA kjøre på beta.stengttunnel.no
   - Deploy Next.js til ny.stengttunnel.no midlertidig
   - Switch DNS når alt er testet

---

## 📚 Neste Steg

1. **Godkjenn denne planen**
2. **Opprett feature branch:** `nextjs-migration`
3. **Start med Fase 1**
4. **Test grundig før merge til main**
5. **Overvåk etter deployment**

---

## 🔍 Fremtidige Forbedringer (Post-migrering)

- **ISR (Incremental Static Regeneration):** Hvis vi flytter fra GitHub Pages til Vercel
- **Edge caching:** CDN for enda raskere lasting
- **PWA:** Offline-støtte
- **Push notifications:** Varsel når favoritt-tunnel stenges
- **Bildoptimalisering:** Next.js Image-komponent
- **Analytics dashboard:** Vis statistikk om tunnelstenging

---

**Oppdatert:** 2026-01-21
**Versjon:** 1.0
