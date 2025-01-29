// resources/js/Components/Blog/BlogCard.tsx
import React from 'react';
import { Link } from '@inertiajs/react';
import { BlogPost } from '@/types/blog';
import { formatDate, createExcerpt } from '@/utils/helpers';

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      {post.featured_image && (
        <Link href={`/blog/${post.slug}`}>
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-56 object-cover"
          />
        </Link>
      )}
      <div className="p-5">
        {post.category && (
          <Link
            href={`/blog/category/${post.category.slug}`}
            className="text-blue-600 text-sm font-medium hover:underline"
          >
            {post.category.name}
          </Link>
        )}

        <Link href={`/blog/${post.slug}`}>
          <h2 className="text-xl font-bold mt-2 mb-3 hover:text-blue-600 transition-colors duration-300">
            {post.title}
          </h2>
        </Link>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt || createExcerpt(post.content, 150)}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{post.author?.name || 'Admin'}</span>
          <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
        </div>
      </div>
    </div>
  );
};

export default React.memo(BlogCard);
