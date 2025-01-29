import React from 'react';
import { Link } from '@inertiajs/react';
import { PaginationMeta } from '@/types/blog';

interface PaginationProps {
  meta?: PaginationMeta;
  baseUrl: string;
}

const Pagination: React.FC<PaginationProps> = ({ meta, baseUrl }) => {
  // Kiểm tra meta tồn tại trước khi destructure
  if (!meta || !meta.links) {
    return null; // Không hiển thị pagination nếu không có dữ liệu
  }

  const { links, current_page, last_page } = meta;

  // Không hiển thị phân trang nếu chỉ có 1 trang
  if (last_page <= 1) return null;

  return (
    <div className="flex justify-center my-8">
      <nav className="flex items-center space-x-1">
        {links.map((link, i) => {
          // Skip if it's a current page "link"
          if (link.active) {
            return (
              <span
                key={i}
                className="px-3 py-1 rounded-md bg-blue-600 text-white"
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            );
          }

          // Skip if url is null
          if (!link.url) {
            return (
              <span
                key={i}
                className="px-3 py-1 text-gray-400 cursor-not-allowed"
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            );
          }

          return (
            <Link
              key={i}
              href={link.url}
              className="px-3 py-1 rounded-md text-gray-700 hover:bg-gray-200"
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          );
        })}
      </nav>
    </div>
  );
};

export default React.memo(Pagination);
