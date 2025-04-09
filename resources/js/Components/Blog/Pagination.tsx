import React from 'react';
import { Link } from '@inertiajs/react';
import { PaginationMeta } from '@/types/blog';

interface PaginationProps {
  meta?: PaginationMeta;
  baseUrl: string;
}

const Pagination: React.FC<PaginationProps> = ({ meta, baseUrl }) => {
  // Check if meta exists before destructuring
  if (!meta || !meta.links) {
    return null; // Don't display pagination if there's no data
  }

  const { links, current_page, last_page } = meta;

  // Don't display pagination if there's only 1 page
  if (last_page <= 1) return null;

  return (
    <div className="flex justify-center mt-12">
      <nav className="flex items-center space-x-1">
        {links.map((link, i) => {
          // For active/current page
          if (link.active) {
            return (
              <span
                key={i}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white font-medium"
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            );
          }

          // For disabled links (no URL)
          if (!link.url) {
            return (
              <span
                key={i}
                className="w-10 h-10 flex items-center justify-center text-gray-400 cursor-not-allowed"
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            );
          }

          // For regular links
          return (
            <Link
              key={i}
              href={link.url}
              className="w-10 h-10 flex items-center justify-center rounded-full text-charcoal hover:bg-base-200 transition-colors"
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          );
        })}
      </nav>
    </div>
  );
};

export default React.memo(Pagination);
