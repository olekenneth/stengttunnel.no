import type { Metadata } from 'next'
import Script from 'next/script'
import ReactDomPolyfill from '@/components/ReactDomPolyfill'
import './globals.css'

export const metadata: Metadata = {
  title: 'Stengt tunnel',
  description: 'En tjeneste for enkelt å kunne sjekke om Oslofjordtunnelen, Atlanterhavstunnelen, Blindheimstunnelen, Bjørgatunnelen, Bragernestunnelen er stengt eller åpen',
  keywords: 'tunnel, stengt, Oslofjordtunnelen, Atlanterhavstunnelen, Blindheimstunnelen, Bjørgatunnelen, Bragernestunnelen',
  metadataBase: new URL('https://beta.stengttunnel.no'),
  openGraph: {
    title: 'Stengt tunnel',
    description: 'Sjekk om tunnelen er åpen eller stengt',
    images: ['/status/fb_yellow.png'],
    type: 'website',
    url: 'https://beta.stengttunnel.no',
  },
  verification: {
    google: '6TY408NTECadAshJUqKLqiDA1HjfRvgGXWkfm64YxpQ',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
  },
  icons: {
    icon: '/favicon.ico',
    apple: [
      { url: '/images/icons/apple-touch-icon.png' },
      { url: '/images/icons/apple-touch-icon-114.png', sizes: '114x114' },
      { url: '/images/icons/apple-touch-icon-72.png', sizes: '72x72' },
    ],
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nb-NO">
      <head>
        <meta name="theme-color" content="#1b1c1d" />
        <meta name="apple-itunes-app" content="app-id=1050495087, affiliate-data=, app-argument=" />

        {/* Semantic UI CSS */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/fomantic-ui@2.9.4/dist/semantic.min.css"
        />

        {/* Preload images */}
        <link rel="preload" href="/status/yellow.png" as="image" />
        <link rel="preload" href="/status/green.png" as="image" />
        <link rel="preload" href="/status/red.png" as="image" />

        {/* Preconnect to external services */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://googleads.g.doubleclick.net/" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      </head>
      <body>
        <ReactDomPolyfill />
        {children}

        {/* Google AdSense */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8133897183984535"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
