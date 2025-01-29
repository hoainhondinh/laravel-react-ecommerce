// resources/js/Pages/Blog/Tag.tsx
import React from 'react';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { BlogPost, Tag, PaginationMeta } from '@/types/blog';
import BlogItem from '@/Components/App/BlogItem';
import Pagination from '@/Components/Blog/Pagination';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface BlogTagProps {
  tag: Tag;
  posts: {
    data: BlogPost[];
    meta: PaginationMeta;
  };
}

export default function BlogTag({ tag, posts }: PageProps<BlogTagProps>) {
  return (
    <AuthenticatedLayout>
      <Head title={`Tag: ${tag.name} - Blog`} />
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h1 className="text-3xl font-bold">Bài viết với tag: {tag.name}</h1>
          </div>

          {posts.data.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.data.map(post => (
                <BlogItem post={post} key={post.id} />
              ))}
            </div>
          ) : (
            <p className="text-center py-16 text-gray-500">Không có bài viết nào với tag này.</p>
          )}

          {posts.meta && posts.meta.last_page > 1 && (
            <Pagination
              meta={posts.meta}
              baseUrl={`/blog/tag/${tag.slug}`}
            />
          )}
        </div>
      </main>
    </AuthenticatedLayout>
  );
}
