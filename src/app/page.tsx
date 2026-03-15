import React from 'react';
import { getAllPosts, PostData } from '@/lib/posts';
import Link from 'next/link';

export default function Home() {
  const posts = getAllPosts();

  return (
    <main className="fade-in">
      <section className="hero">
        <h1>O Centro do<br />Universo Desportivo.</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', marginTop: '1.5rem' }}>
          Notícias de última hora processadas por inteligência artificial para lhe trazer a verdade, mais rápido do que ninguém.
        </p>
      </section>

      <section>
        <h2 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Notícias Recentes</h2>
        <div className="news-grid">
          {posts.length > 0 ? (
            posts.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))
          ) : (
            <div style={{ padding: '2rem', border: '1px dashed var(--border)', borderRadius: '12px' }}>
              <p>Ainda não há notícias publicadas. A IA está a processar os dados...</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function ArticleCard({ post }: { post: PostData }) {
  const formattedDate = new Date(post.date).toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return (
    <Link href={`/news/${post.slug}`}>
      <article className="news-card">
        <div className="card-image" style={{ backgroundImage: post.image ? `url(${post.image})` : '' }}></div>
        <div className="card-content">
          <span className="card-meta">{post.category} • {formattedDate}</span>
          <h3 className="card-title">{post.title}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {post.excerpt}
          </p>
        </div>
      </article>
    </Link>
  );
}
