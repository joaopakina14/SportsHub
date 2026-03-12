import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SportsHub | As Melhores Notícias Desportivas do Mundo',
  description: 'O seu portal número um para notícias desportivas de última hora, análises profundas e resultados em direto. Gerado por IA avançada para cobertura total.',
  keywords: ['desporto', 'notícias desportivas', 'futebol', 'basquetebol', 'ténis', 'gemini ai', 'blog desporto'],
  authors: [{ name: 'SportsHub Team' }],
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
  return (
    <html lang="pt">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        <header>
          <div className="logo">SPORTSHUB</div>
          <nav>
            {/* Nav links could go here */}
          </nav>
        </header>
        {children}
        <footer>
          <p>&copy; 2026 SportsHub - O Melhor SEO do Mundo</p>
        </footer>
      </body>
    </html>
  )
}
