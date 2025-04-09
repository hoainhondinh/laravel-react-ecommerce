import React from 'react';
import { Link } from '@inertiajs/react';
import { BlogPost } from '@/types';

interface Props {
  post: BlogPost;
}

export default function BlogItem({ post }: Props) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).replace(/\//g, '/');
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-duration-300">
      {post.featured_image && post.featured_image.length > 0 && (
        <Link href={`/blog/${post.slug}`} className="block relative h-48 overflow-hidden">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </Link>
      )}
      <div className="p-5">
        <Link href={`/blog/${post.slug}`}>
          <h2 className="text-xl font-bold text-neutral hover:text-primary transition-colors">
            {post.title}
          </h2>
        </Link>

        {post.excerpt && (
          <p className="text-charcoal mt-3 line-clamp-3">{post.excerpt}</p>
        )}

        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-charcoal">{formatDate(post.published_at)}</span>
          <Link
            href={`/blog/${post.slug}`}
            className="text-primary hover:text-primary-dark transition-colors font-medium"
          >
            Đọc thêm
          </Link>
        </div>
      </div>
    </div>
  );
}
