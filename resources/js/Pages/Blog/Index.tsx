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
    "headline": "Our Blog",
    "description": "Check out our latest articles and news",
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
        <title>Blog | Your Store Name</title>
        <meta name="description" content="Check out our latest articles and news about products, trends, and more." />
        <meta name="keywords" content="blog, articles, news, products, trends" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Our Blog</h1>

        {posts.data.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">No blog posts found.</p>
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
