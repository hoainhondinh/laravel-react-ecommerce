import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface SupportPage {
  id: number;
  title: string;
  slug: string;
  meta_description: string | null;
}

interface SupportIndexProps {
  supportPages: SupportPage[];
}

export default function Index({ supportPages }: PageProps<SupportIndexProps>) {
  // SEO structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": supportPages.map(page => ({
      "@type": "Question",
      "name": page.title,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": page.meta_description || page.title
      }
    }))
  };

  return (
    <AuthenticatedLayout>
      <Head>
        <title>Hỗ Trợ Khách Hàng</title>
        <meta name="description" content="Thông tin hỗ trợ khách hàng, chính sách và hướng dẫn mua hàng." />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Head>

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-neutral text-center mb-4">HỖ TRỢ KHÁCH HÀNG</h1>
          <div className="w-24 h-1 bg-primary mx-auto mb-10"></div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {supportPages.map((page) => (
              <Link
                key={page.id}
                href={route('support.show', page.slug)}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex flex-col h-full"
              >
                <h2 className="text-xl font-semibold text-neutral hover:text-primary transition-colors">
                  {page.title}
                </h2>
                {page.meta_description && (
                  <p className="mt-2 text-charcoal flex-grow">
                    {page.meta_description}
                  </p>
                )}
                <div className="mt-4 text-primary font-medium">Xem chi tiết</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
