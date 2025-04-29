import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

interface MobileBottomNavProps {
  notificationCount?: number;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
                                                           notificationCount = 0
                                                         }) => {
  // Sử dụng type casting để đảm bảo biến url có type string
  const { url } = usePage<PageProps>();
  const currentUrl = url as string;

  // Xác định xem một đường dẫn có đang active không
  const isActive = (path: string): boolean => {
    if (path === '/') {
      return currentUrl === '/' || (currentUrl.startsWith('/') && currentUrl.indexOf('/', 1) === -1 &&
        !currentUrl.startsWith('/about') &&
        !currentUrl.startsWith('/products') &&
        !currentUrl.startsWith('/blog') &&
        !currentUrl.startsWith('/lien-he') &&
        !currentUrl.startsWith('/department/')
      );
    }
    return currentUrl.startsWith(path);
  };

  // Các class cho mục đang active/không active
  const navActiveClass = "text-primary font-medium";
  const navInactiveClass = "text-neutral";

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="grid grid-cols-4 h-16">
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center ${isActive('/') ? navActiveClass : navInactiveClass}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs mt-1">Trang chủ</span>
        </Link>

        {/* Categories/Products */}
        <Link
          href="/products"
          className={`flex flex-col items-center justify-center ${isActive('/products') || isActive('/department/') ? navActiveClass : navInactiveClass}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span className="text-xs mt-1">Sản phẩm</span>
        </Link>

        {/* Blog */}
        <Link
          href="/blog"
          className={`flex flex-col items-center justify-center relative ${isActive('/blog') ? navActiveClass : navInactiveClass}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <span className="text-xs mt-1">Tin tức</span>

          {/* Hiển thị thông báo nếu có bài đăng mới */}
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-error text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {notificationCount > 99 ? '99+' : notificationCount}
            </span>
          )}
        </Link>

        {/* Account */}
        <Link
          href="/profile/edit"
          className={`flex flex-col items-center justify-center ${isActive('/profile') ? navActiveClass : navInactiveClass}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-xs mt-1">Tài khoản</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileBottomNav;
