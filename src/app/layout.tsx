import type { Metadata } from 'next'
import './globals.css'

import Script from 'next/script'

export const metadata: Metadata = {
  title: {
    default: 'SportsHub | Notícias Desportivas em Tempo Real',
    template: '%s | SportsHub'
  },
  description: 'O portal de notícias desportivas mais avançado do mundo. Cobertura total de Futebol, F1, NBA e muito mais, com análises geradas por IA em tempo real.',
  keywords: ['notícias desportivas', 'futebol português', 'primeira liga', 'benfica', 'porto', 'sporting', 'desporto ao vivo', 'melhor portal desporto'],
  authors: [{ name: 'SportsHub AI' }],
  metadataBase: new URL('https://sports-news-theta.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'SportsHub | Onde o Desporto Acontece Primeiro',
    description: 'Acompanhe as notícias desportivas mais recentes com a melhor cobertura do mundo.',
    url: 'https://sports-news-theta.vercel.app',
    siteName: 'SportsHub',
    images: [
      {
        url: '/og-image.jpg', // Imagem padrão se não houver notícia
        width: 1200,
        height: 630,
        alt: 'SportsHub Portal',
      },
    ],
    locale: 'pt_PT',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SportsHub | Resumo Desportivo Global',
    description: 'O portal de desporto mais avançado, agora com cobertura total por IA.',
    images: ['/og-image.jpg'],
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
    'url': 'https://sports-news-theta.vercel.app',
    'logo': 'https://sports-news-theta.vercel.app/logo.png',
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
