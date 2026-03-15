import { getPostBySlug, getAllPosts } from '@/lib/posts';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Script from 'next/script';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: 'Noticia Não Encontrada' };

  const fullUrl = `https://sportshub-news.vercel.app/news/${params.slug}`;

  return {
    title: `${post.title} | SportsHub`,
    description: post.excerpt,
    keywords: post.keywords,
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: ['SportsHub AI'],
      images: post.image ? [{ url: post.image }] : [],
      url: fullUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : [],
    }
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default function PostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const formattedDate = new Date(post.date).toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    'headline': post.title,
    'description': post.excerpt,
    'image': post.image ? [post.image] : [],
    'datePublished': post.date,
    'author': [{
      '@type': 'Person',
      'name': 'SportsHub AI',
    }]
  };

  return (
    <main className="fade-in" style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 5%' }}>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article>
        <header style={{ border: 'none', padding: '0', marginBottom: '2rem', display: 'block', background: 'transparent' }}>
          <span style={{ color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px' }}>
            {post.category}
          </span>
          <h1 style={{ marginTop: '1rem', fontSize: '3rem' }}>{post.title}</h1>
          <div style={{ color: 'var(--text-muted)', marginTop: '1rem', marginBottom: '2rem' }}>
            Publicado em {formattedDate} por SportsHub AI
          </div>
          {post.image && (
            <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: '16px', overflow: 'hidden', marginBottom: '2rem', position: 'relative' }}>
              <Image 
                src={post.image} 
                alt={`Imagem sobre ${post.title}`} 
                fill
                style={{ objectFit: 'cover' }} 
                priority
              />
            </div>
          )}
        </header>

        <div className="article-content" style={{ lineHeight: '1.8', fontSize: '1.1rem' }}>
          {/* In a real app we would use an MDX renderer here */}
          {post.content.split('\n').map((paragraph, i) => (
            paragraph.trim() && <p key={i} style={{ marginBottom: '1.5rem' }}>{paragraph}</p>
          ))}
        </div>
      </article>
    </main>
  );
}
