import { getPostBySlug, getAllPosts, PostData } from '@/lib/posts';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: 'Noticia Não Encontrada' };

  return {
    title: `${post.title} | SportsHub`,
    description: post.excerpt,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: ['SportsHub Team'],
    },
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

  return (
    <main className="fade-in" style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 5%' }}>
      <article>
        <header style={{ border: 'none', padding: '0', marginBottom: '2rem', display: 'block', background: 'transparent' }}>
          <span style={{ color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px' }}>
            {post.category}
          </span>
          <h1 style={{ marginTop: '1rem', fontSize: '3rem' }}>{post.title}</h1>
          <div style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>
            Publicado em {formattedDate} por SportsHub AI
          </div>
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
