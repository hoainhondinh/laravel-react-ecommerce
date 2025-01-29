import React from 'react';
import { Head, Link } from '@inertiajs/react';
import DOMPurify from 'dompurify';
import { BlogShowProps } from '@/types/blog';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { formatDate, createExcerpt } from '@/utils/helpers';

const Show: React.FC<BlogShowProps> = ({ post, relatedPosts }) => {
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
        {post.category && (
          <Link
            href={`/blog/category/${post.category.slug}`}
            className="text-blue-600 font-medium hover:underline"
          >
            {post.category.name}
          </Link>
        )}

        <h1 className="text-4xl font-bold mt-2 mb-4">{post.title}</h1>

        <div className="flex flex-wrap items-center text-gray-600 mb-8">
          <span>By {post.author?.name || 'Admin'}</span>
          <span className="mx-2">•</span>
          <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>

          {post.tags && post.tags.length > 0 && (
            <>
              <span className="mx-2">•</span>
              <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                {post.tags.map(tag => (
                  <Link
                    key={tag.id}
                    href={`/blog/tag/${tag.slug}`}
                    className="text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            </>
          )}
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
          className="prose lg:prose-xl max-w-none"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
        />

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map(relatedPost => (
                <div key={relatedPost.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {relatedPost.featured_image && (
                    <Link href={`/blog/${relatedPost.slug}`}>
                      <img
                        src={relatedPost.featured_image}
                        alt={relatedPost.title}
                        className="w-full h-48 object-cover"
                      />
                    </Link>
                  )}
                  <div className="p-4">
                    <Link
                      href={`/blog/${relatedPost.slug}`}
                      className="text-xl font-semibold hover:text-blue-600"
                    >
                      {relatedPost.title}
                    </Link>
                    <p className="text-gray-600 mt-2 line-clamp-2">
                      {relatedPost.excerpt || createExcerpt(relatedPost.content, 100)}
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
