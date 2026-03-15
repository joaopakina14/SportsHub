import React from 'react';
import { getAllPosts, PostData } from '@/lib/posts';
import Link from 'next/link';
import slugify from 'slugify';

export const generateMetadata = ({ params }: { params: { slug: string } }) => {
  const categoryName = params.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  return {
    title: `${categoryName} | SportsHub`,
    description: `Últimas notícias sobre ${categoryName}.`,
  };
};

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const allPosts = getAllPosts();
  
  // Filter posts where the slugified category matches the url slug
  // Handle some special cases for category strings that might differ slightly
  const posts = allPosts.filter(post => {
    const postCatSlug = slugify(post.category || 'geral', { lower: true, strict: true });
    return postCatSlug === params.slug;
  });

  const categoryName = params.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <main className="fade-in">
      <section className="hero" style={{ marginBottom: '2rem' }}>
        <h1>Notícias: {categoryName}</h1>
      </section>

      <section>
        <div className="news-grid">
          {posts.length > 0 ? (
            posts.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))
          ) : (
            <div style={{ padding: '2rem', border: '1px dashed var(--border)', borderRadius: '12px', gridColumn: '1 / -1' }}>
              <p>Ainda não há notícias publicadas para a categoria &quot;{categoryName}&quot;.</p>
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
        <div className="card-image"></div>
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
