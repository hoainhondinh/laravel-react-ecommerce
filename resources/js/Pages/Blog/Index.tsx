import React from 'react';
import { Head } from '@inertiajs/react';
import { BlogIndexProps } from '@/types/blog';
import BlogCard from '@/Components/Blog/BlogCard';
import Pagination from '@/Components/Blog/Pagination';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const Index: React.FC<BlogIndexProps> = ({ posts }) => {
  // SEO structured data for blog index
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "headline": "Tin Tức",
    "description": "Cập nhật tin tức, thông tin mới nhất về sản phẩm",
    "url": window.location.href,
    "publisher": {
      "@type": "Organization",
      "name": "Your Company Name",
      "logo": {
        "@type": "ImageObject",
        "url": "https://yourdomain.com/logo.png"
      }
    }
  };

  return (
    <AuthenticatedLayout>
      <Head>
        <title>Tin Tức | Your Store Name</title>
        <meta name="description" content="Cập nhật tin tức, thông tin mới nhất về sản phẩm." />
        <meta name="keywords" content="tin tức, thông tin, sản phẩm, cập nhật" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-10 text-neutral text-center">
          TIN TỨC
          <div className="w-24 h-1 bg-primary mt-4 mx-auto"></div>
        </h1>

        {posts.data.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-charcoal">Không tìm thấy bài viết nào.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.data.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}

        <Pagination meta={posts.meta} baseUrl="/blog" />
      </div>
    </AuthenticatedLayout>
  );
};

export default Index;
