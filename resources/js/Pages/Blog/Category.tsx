import React from 'react';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { BlogPost, Category, PaginationMeta } from '@/types/blog';
import BlogItem from '@/Components/App/BlogItem';
import Pagination from '@/Components/Blog/Pagination';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface BlogCategoryProps {
  category: Category;
  posts: {
    data: BlogPost[];
    meta: PaginationMeta;
  };
}

export default function BlogCategory({ category, posts }: PageProps<BlogCategoryProps>) {
  return (
    <AuthenticatedLayout>
      <Head title={`${category.name} - Tin Tức`} />
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-neutral">{category.name}</h1>
            <div className="w-24 h-1 bg-primary mt-4 mx-auto"></div>
            {category.description && (
              <p className="text-lg text-charcoal mt-4">{category.description}</p>
            )}
          </div>

          {posts.data.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.data.map(post => (
                <BlogItem post={post} key={post.id} />
              ))}
            </div>
          ) : (
            <p className="text-center py-16 text-charcoal">Không có bài viết nào trong danh mục này.</p>
          )}

          {posts.meta && posts.meta.last_page > 1 && (
            <Pagination
              meta={posts.meta}
              baseUrl={`/blog/category/${category.slug}`}
            />
          )}
        </div>
      </main>
    </AuthenticatedLayout>
  );
}
