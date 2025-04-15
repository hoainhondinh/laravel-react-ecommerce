import React from 'react';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DOMPurify from 'dompurify';
import SupportSidebar from '@/Components/App/SupportSideBar';

interface SupportPage {
  id: number;
  title: string;
  slug: string;
  content: string;
  meta_title: string | null;
  meta_description: string | null;
}

interface SupportPageLink {
  id: number;
  title: string;
  slug: string;
}

interface SupportPageProps {
  page: SupportPage;
  supportPages: SupportPageLink[];
}

export default function Show({ page, supportPages }: PageProps<SupportPageProps>) {
  // SEO structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": page.meta_title || page.title,
    "description": page.meta_description || "",
    "url": window.location.href,
    "mainEntity": {
      "@type": "WebContent",
      "headline": page.title,
      "text": page.content.substring(0, 500).replace(/<[^>]*>?/gm, '')
    }
  };

  return (
    <AuthenticatedLayout>
      <Head>
        <title>{page.meta_title || page.title}</title>
        <meta name="description" content={page.meta_description || ""} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Head>

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <SupportSidebar supportPages={supportPages} currentSlug={page.slug} />
            </div>

            {/* Main Content */}
            <div className="md:col-span-3 bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="p-6">
                <h1 className="text-3xl font-bold text-neutral mb-6">{page.title}</h1>
                <div className="w-24 h-1 bg-primary mb-8"></div>

                <div
                  className="prose max-w-none prose-headings:text-neutral prose-a:text-primary prose-strong:text-neutral prose-img:rounded-lg"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(page.content) }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
