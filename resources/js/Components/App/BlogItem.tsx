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
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="card bg-base-100 shadow-xl h-full">
      {post.featured_image && post.featured_image.length > 0 && (
        <Link href={`/blog/${post.slug}`}>
          <img
            src={post.featured_image}
            alt={post.title}
            className="h-48 w-full object-cover"
          />
        </Link>
      )}
      <div className="card-body">
        {post.category && (
          <Link
            href={`/blog/category/${post.category.slug}`}
            className="text-primary text-sm font-medium hover:underline"
          >
            {post.category.name}
          </Link>
        )}
        <Link href={`/blog/${post.slug}`}>
          <h2 className="card-title hover:text-primary transition-colors">{post.title}</h2>
        </Link>
        {post.excerpt && (
          <p className="text-gray-600 line-clamp-2">{post.excerpt}</p>
        )}
        <div className="flex justify-between items-center text-sm text-gray-500 mt-auto">
          <span>{post.author?.name || 'Admin'}</span>
          <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
        </div>
      </div>
    </div>
  );
}
