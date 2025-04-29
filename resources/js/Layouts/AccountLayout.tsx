import React, { ReactNode } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import FlashMessages from '@/Components/Core/FlashMessages';

interface AccountLayoutProps {
  children: ReactNode;
  title: string;
}

export default function AccountLayout({ children, title }: AccountLayoutProps) {
  // Thêm các keyframes animation vào Tailwind
  const animationStyles = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.5s ease-out forwards;
    }
  `;

  const { auth } = usePage<PageProps>().props;
  const user = auth.user;

  const handleLogout = () => {
    router.post(route('logout'), {}, {
      preserveState: false,
      preserveScroll: false,
      only: [],
      headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
      }
    });
  };

  // Xác định route đang active
  const isActive = (routeName: string) => {
    return route().current(routeName) ? 'bg-primary/10 text-primary' : 'hover:bg-base-200';
  };

  // React Hook - Hiệu ứng cuộn gắn kết
  React.useEffect(() => {
    // Scroll đến đúng vị trí nếu có hash
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    }
  }, []);

  // Mobile tab active
  const isMobileActive = (routeName: string) => {
    return route().current(routeName)
      ? 'bg-primary text-white shadow-md scale-105'
      : 'bg-gray-100 text-gray-700';
  };

  // Thêm Haptic Feedback cho mobile
  const handleTabClick = () => {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(30); // Rung nhẹ 30ms để phản hồi
    }
  };

  return (
    <AuthenticatedLayout>
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      <Head title={title} />
      <FlashMessages />

      <div className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <nav className="text-sm">
              <ol className="list-none p-0 inline-flex">
                <li className="flex items-center">
                  <Link href="/" className="text-gray-500 hover:text-primary">
                    Trang chủ
                  </Link>
                  <svg className="fill-current w-3 h-3 mx-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                    <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"></path>
                  </svg>
                </li>
                <li className="flex items-center">
                  <span className="text-gray-800 font-medium">Tài khoản của tôi</span>
                </li>
              </ol>
            </nav>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar - Ẩn trên mobile và hiển thị trên tablet/desktop */}
            <div className="hidden md:block w-full md:w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {/* User info */}
                <div className="p-4 flex items-center border-b border-gray-200">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden border border-gray-300">
                    <img
                      src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-3 overflow-hidden">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">
                      <Link href={route('profile.edit')} className="text-primary hover:underline">
                        Sửa hồ sơ
                      </Link>
                    </p>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="divide-y divide-gray-200">
                  <div className="py-2">
                    <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tài khoản của tôi
                    </div>
                    <Link
                      href={route('profile.edit')}
                      className={`block px-4 py-2.5 text-sm ${isActive('profile.edit')} transition-colors`}
                    >
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Hồ sơ của tôi
                      </div>
                    </Link>
                    <Link
                      href={route('profile.addresses')}
                      className={`block px-4 py-2.5 text-sm ${isActive('profile.addresses')} transition-colors`}
                    >
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Địa chỉ của tôi
                      </div>
                    </Link>
                    <Link
                      href={route('profile.edit') + '#update-password'}
                      className="block px-4 py-2.5 text-sm hover:bg-base-200 transition-colors"
                    >
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Đổi mật khẩu
                      </div>
                    </Link>
                  </div>

                  <div className="py-2">
                    <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Đơn hàng của tôi
                    </div>
                    <Link
                      href={route('orders.index')}
                      className={`block px-4 py-2.5 text-sm ${isActive('orders.index')} transition-colors`}
                    >
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Tất cả đơn hàng
                      </div>
                    </Link>
                  </div>

                  <div className="py-2">
                    <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Khác
                    </div>
                    <Link
                      href="#"
                      className="block px-4 py-2.5 text-sm hover:bg-base-200 transition-colors"
                    >
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none"
                             viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        Trung tâm hỗ trợ
                      </div>
                    </Link>
                    <form
                      action={route('logout')}
                      method="POST"
                      className="w-full"
                      key={Date.now()} // Đảm bảo form luôn được render mới
                    >
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-base-200 transition-colors"
                      >
                        <div className="flex items-center text-red-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none"
                               viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                          </svg>
                          Đăng xuất
                        </div>
                      </button>
                    </form>
                  </div>
                </nav>
              </div>
            </div>

            {/* Mobile tab selector - Cải tiến cho giao diện mobile */}
            <div className="md:hidden mb-4">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-fadeIn">
                {/* User info cho mobile */}
                <div className="p-4 flex items-center border-b border-gray-200 bg-gradient-to-r from-beige to-light-gold">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden border border-gray-300">
                    <img
                      src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-3 overflow-hidden">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                  </div>
                  <div className="ml-auto">
                    <button
                      onClick={handleLogout}
                      className="text-red-500 p-1.5 rounded-full hover:bg-red-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Tab navigation nâng cao cho mobile */}
                <div className="grid grid-cols-4 gap-0.5 bg-gray-100 p-1.5 sticky top-0 z-10">
                  <Link
                    href={route('profile.edit')}
                    className={`flex flex-col items-center justify-center px-1 py-2 rounded-lg text-xs transition-all duration-300 transform hover:scale-105 ${isMobileActive('profile.edit')}`}
                    onClick={handleTabClick}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Hồ sơ
                  </Link>
                  <Link
                    href={route('profile.addresses')}
                    className={`flex flex-col items-center justify-center px-1 py-2 rounded-lg text-xs transition-all duration-300 transform hover:scale-105 ${isMobileActive('profile.addresses')}`}
                    onClick={handleTabClick}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Địa chỉ
                  </Link>
                  <Link
                    href={route('orders.index')}
                    className={`flex flex-col items-center justify-center px-1 py-2 rounded-lg text-xs transition-all duration-300 transform hover:scale-105 ${isMobileActive('orders.index')}`}
                    onClick={handleTabClick}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Đơn hàng
                  </Link>
                  <Link
                    href={route('profile.edit') + '#update-password'}
                    className={`flex flex-col items-center justify-center px-1 py-2 rounded-lg text-xs transition-all duration-300 transform hover:scale-105 ${window.location.hash === '#update-password' ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-700'}`}
                    onClick={handleTabClick}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Mật khẩu
                  </Link>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow p-6 animate-fadeIn">
                <h2 className="text-xl font-bold text-neutral border-b pb-4 mb-4">{title}</h2>
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
