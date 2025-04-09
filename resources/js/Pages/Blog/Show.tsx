import React from 'react';
import { Head, Link } from '@inertiajs/react';
import DOMPurify from 'dompurify';
import { BlogShowProps } from '@/types/blog';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { formatDate, createExcerpt } from '@/utils/helpers';

const Show: React.FC<BlogShowProps> = ({ post, relatedPosts }) => {
  const formatDateVN = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).replace(/\//g, '/');
  };

  // Create structured data for the blog post
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "name": post.title,
    "description": post.excerpt || post.meta_description || "",
    "datePublished": post.published_at,
    "dateModified": post.updated_at,
    "author": {
      "@type": "Person",
      "name": post.author?.name || "Admin"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Your Company Name",
      "logo": {
        "@type": "ImageObject",
        "url": "https://yourdomain.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": window.location.href
    }
  };

  if (post.featured_image) {
    (structuredData as any).image = {
      "@type": "ImageObject",
      "url": post.featured_image
    };
  }

  // If there's custom structured data in the post, use it instead
  const finalStructuredData = post.structured_data
    ? (typeof post.structured_data === 'string' ? JSON.parse(post.structured_data) : post.structured_data)
    : structuredData;

  return (
    <AuthenticatedLayout>
      <Head>
        <title>{post.meta_title || post.title}</title>
        <meta name="description" content={post.meta_description || post.excerpt || createExcerpt(post.content)} />
        {post.meta_keywords && <meta name="keywords" content={post.meta_keywords} />}
        {post.canonical_url && <link rel="canonical" href={post.canonical_url} />}

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:title" content={post.meta_title || post.title} />
        <meta property="og:description" content={post.meta_description || post.excerpt || createExcerpt(post.content)} />
        {post.og_image && <meta property="og:image" content={post.og_image} />}
        {post.featured_image && !post.og_image && <meta property="og:image" content={post.featured_image} />}

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={window.location.href} />
        <meta property="twitter:title" content={post.meta_title || post.title} />
        <meta property="twitter:description" content={post.meta_description || post.excerpt || createExcerpt(post.content)} />
        {post.og_image && <meta property="twitter:image" content={post.og_image} />}
        {post.featured_image && !post.og_image && <meta property="twitter:image" content={post.featured_image} />}

        <script type="application/ld+json">
          {JSON.stringify(finalStructuredData)}
        </script>
      </Head>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-6">
          {post.category && (
            <Link
              href={`/blog/category/${post.category.slug}`}
              className="text-primary font-medium hover:underline"
            >
              {post.category.name}
            </Link>
          )}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-neutral mb-4">{post.title}</h1>

        <div className="flex items-center text-charcoal mb-8 text-sm">
          <time dateTime={post.published_at}>{formatDateVN(post.published_at)}</time>
          <span className="mx-2">•</span>
          <span>{post.author?.name || 'Admin'}</span>
        </div>

        {post.featured_image && (
          <div className="mb-8">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-auto rounded-lg"
            />
          </div>
        )}

        <div
          className="prose max-w-none prose-headings:text-neutral prose-a:text-primary prose-strong:text-neutral prose-img:rounded-lg"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
        />

        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <Link
                  key={tag.id}
                  href={`/blog/tag/${tag.slug}`}
                  className="px-3 py-1 bg-accent text-charcoal text-sm rounded-full hover:bg-base-300 transition"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6 text-neutral">Bài viết liên quan</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map(relatedPost => (
                <div key={relatedPost.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  {relatedPost.featured_image && (
                    <Link href={`/blog/${relatedPost.slug}`} className="block relative h-40 overflow-hidden">
                      <img
                        src={relatedPost.featured_image}
                        alt={relatedPost.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </Link>
                  )}
                  <div className="p-4">
                    <Link
                      href={`/blog/${relatedPost.slug}`}
                      className="text-lg font-semibold text-neutral hover:text-primary"
                    >
                      {relatedPost.title}
                    </Link>
                    <p className="text-sm text-charcoal mt-2">
                      {formatDateVN(relatedPost.published_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </article>
    </AuthenticatedLayout>
  );
};

export default Show;
