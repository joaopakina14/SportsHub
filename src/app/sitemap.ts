import { getAllPosts } from '@/lib/posts';
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  
  const postEntries = posts.map((post) => ({
    url: `https://sportshub-news.vercel.app/news/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  return [
    {
      url: 'https://sportshub-news.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1,
    },
    ...postEntries,
  ];
}
