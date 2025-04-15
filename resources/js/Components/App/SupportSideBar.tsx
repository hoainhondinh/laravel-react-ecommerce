import React from 'react';
import { Link } from '@inertiajs/react';

interface SupportPageLink {
  id: number; // Thêm id cho key duy nhất
  title: string;
  slug: string;
}

interface SupportSidebarProps {
  supportPages: SupportPageLink[];
  currentSlug: string;
}

export default function SupportSidebar({ supportPages, currentSlug }: SupportSidebarProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold text-neutral mb-4 pb-2 border-b border-accent">
        Danh Mục Hỗ Trợ
      </h2>
      <nav>
        <ul className="space-y-2">
          <li key="overview">
            <Link
              href={route('support.index')}
              className={`block py-2 px-3 rounded-md hover:bg-base-200 transition-colors ${
                currentSlug === undefined ? 'bg-primary text-white font-medium' : 'text-charcoal'
              }`}
            >
              Tổng quan
            </Link>
          </li>

          {supportPages.map((page) => (
            <li key={page.id}> {/* Sử dụng id làm key duy nhất */}
              <Link
                href={route('support.show', page.slug)}
                className={`block py-2 px-3 rounded-md hover:bg-base-200 transition-colors ${
                  currentSlug === page.slug ? 'bg-primary text-white font-medium' : 'text-charcoal'
                }`}
              >
                {page.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
