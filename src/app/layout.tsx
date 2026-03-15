import type { Metadata } from 'next'
import './globals.css'

import Script from 'next/script'

export const metadata: Metadata = {
  title: {
    default: 'SportsHub | As Melhores Notícias Desportivas do Mundo',
    template: '%s | SportsHub'
  },
  description: 'O seu portal número um para notícias desportivas de última hora, análises profundas e resultados em direto. Gerado por IA avançada para cobertura total.',
  keywords: ['desporto', 'notícias desportivas', 'futebol', 'basquetebol', 'ténis', 'gemini ai', 'blog desporto'],
  authors: [{ name: 'SportsHub AI' }],
  metadataBase: new URL('https://sportshub-news.vercel.app'), // Placeholder URL
  openGraph: {
    title: 'SportsHub | Notícias Desportivas em Tempo Real',
    description: 'Acompanhe as notícias desportivas mais recentes com a melhor cobertura do mundo.',
    url: 'https://sportshub-news.vercel.app',
    siteName: 'SportsHub',
    locale: 'pt-PT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SportsHub | Notícias Desportivas em Tempo Real',
    description: 'Acompanhe as notícias desportivas mais recentes com a melhor cobertura do mundo.',
    creator: '@sportshub',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'SportsHub',
    'url': 'https://sportshub-news.vercel.app',
    'logo': 'https://sportshub-news.vercel.app/logo.png',
  };

  return (
    <html lang="pt">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <Script
          id="org-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <header>
          <div className="header-container">
            <a href="/" className="logo">SPORTSHUB</a>
            <nav className="main-nav">
              <a href="/">Geral</a>
              <div className="nav-dropdown">
                <button className="dropbtn">Futebol (Big 5 + PT) ▾</button>
                <div className="dropdown-content">
                  <a href="/category/primeira-liga">Portugal - Primeira Liga</a>
                  <a href="/category/laliga">Espanha - LaLiga</a>
                  <a href="/category/premier-league">Inglaterra - Premier League</a>
                  <a href="/category/ligue-1">França - Ligue 1</a>
                  <a href="/category/serie-a">Itália - Serie A</a>
                  <a href="/category/bundesliga">Alemanha - Bundesliga</a>
                </div>
              </div>
              <div className="nav-dropdown">
                <button className="dropbtn">Outros Desportos ▾</button>
                <div className="dropdown-content">
                  <a href="/category/andebol">Andebol</a>
                  <a href="/category/futsal">Futsal</a>
                  <a href="/category/voleibol">Voleibol</a>
                  <a href="/category/basquetebol">Basquetebol</a>
                  <a href="/category/f1">F1</a>
                  <a href="/category/motogp">MotoGP</a>
                </div>
              </div>
            </nav>
          </div>
        </header>
        {children}
        <footer>
          <p>&copy; 2026 SportsHub - O Melhor SEO do Mundo</p>
        </footer>
      </body>
    </html>
  )
}
