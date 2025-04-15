import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';
import MiniCartDropDown from "@/Components/App/MiniCartDropDown";
import { PageProps } from '@/types';
import { getResourceData } from '@/helper';

interface Category {
  id: number;
  name: string;
  slug: string;
  posts_count?: number;
}

interface Department {
  id: number;
  name: string;
  slug: string;
  products_count?: number;
  active: boolean;
}

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
  const { auth, blogCategories = { data: [] }, departments = { data: [] } } = usePage<PageProps & {
    blogCategories: any;
    departments: any;
  }>().props;

  // Sử dụng utility để trích xuất dữ liệu từ resource
  const departmentsList = getResourceData<Department>(departments);
  const categoriesList = getResourceData<Category>(blogCategories);

  const { user } = auth;
  const { url } = usePage();

  // States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [blogSubmenuOpen, setBlogSubmenuOpen] = useState(false);
  const [productSubmenuOpen, setProductSubmenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Refs for detecting clicks outside
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Determine if a path is active
  const isActive = (path: string): boolean => {
    if (path === '/') {
      // Chỉ trả về true cho trang chủ nếu URL chính xác là "/" hoặc có tham số query
      return url === '/' || (url.startsWith('/') && url.indexOf('/', 1) === -1 && !url.startsWith('/about') && !url.startsWith('/products') && !url.startsWith('/blog') && !url.startsWith('/lien-he') && !url.startsWith('/department/'));
    }
    return url.startsWith(path);
  };

  // Handle click outside to close menus
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setBlogSubmenuOpen(false);
    setProductSubmenuOpen(false);
  }, [url]);

  return (
    <>
      {/* Top info bar - Dark Brown */}
      <div className="bg-[#4E3629] text-white text-sm py-1">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <a href="tel:0123456789" className="flex items-center hover:text-[#D9C97E]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Hotline: 0123 456 789
            </a>
            <a href="mailto:info@yensaigon.vn" className="hidden md:flex items-center hover:text-[#D9C97E]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email: info@yensaigon.vn
            </a>
            <div className="hidden md:flex items-center hover:text-[#D9C97E]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              08h00 – 20h30 từ thứ 2 – CN
            </div>
          </div>
        </div>
      </div>

      {/* Main navbar - White background */}
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Mobile menu button - left side on mobile */}
            <button
              className="lg:hidden p-2 rounded-md text-[#4E3629] hover:text-[#9E7A47] focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Logo - centered on mobile */}
            <div className="flex-shrink-0 flex justify-center">
              <Link href="/" className="flex items-center">
                <img src="/images/logo.png" alt="Yến Sào Logo" className="h-10" />
              </Link>
            </div>

            {/* Desktop Menu - hidden on mobile */}
            <div className="hidden lg:flex items-center space-x-8 flex-1 justify-center ml-8">
              <Link
                href="/"
                className={`py-2 text-[#333333] hover:text-[#9E7A47] transition-colors ${
                  isActive('/') && !isActive('/blog') && !isActive('/products') ? 'text-[#9E7A47] font-medium' : ''
                }`}
              >
                TRANG CHỦ
              </Link>

              <Link
                href="/about"
                className={`py-2 text-[#333333] hover:text-[#9E7A47] transition-colors ${
                  isActive('/about') ? 'text-[#9E7A47] font-medium' : ''
                }`}
              >
                GIỚI THIỆU
              </Link>

              {/* Products Dropdown */}
              <div className="relative group">
                <Link
                  href="/products"
                  className={`py-2 text-[#333333] hover:text-[#9E7A47] transition-colors flex items-center ${
                    isActive('/products') || isActive('/department/') ? 'text-[#9E7A47] font-medium' : ''
                  }`}
                >
                  SẢN PHẨM
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>

                {/* Desktop Products Dropdown */}
                <div className="absolute left-0 mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <Link
                      href="/products"
                      className={`block px-4 py-2 text-sm hover:bg-[#D8C8A4] ${
                        url === '/products' ? 'text-[#9E7A47] font-medium' : 'text-[#333333]'
                      }`}
                    >
                      Tất cả sản phẩm
                    </Link>

                    {departmentsList.map((department) => (
                      <Link
                        key={department.id}
                        href={route('department.show', { department: department.slug })}
                        className={`block px-4 py-2 text-sm hover:bg-[#D8C8A4] ${
                          isActive(`/department/${department.slug}`) ? 'text-[#9E7A47] font-medium' : 'text-[#333333]'
                        }`}
                      >
                        {department.name}
                        <span className="text-gray-500 text-xs ml-1">
                          ({department.products_count || 0})
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Blog Dropdown */}
              <div className="relative group">
                <Link
                  href="/blog"
                  className={`py-2 text-[#333333] hover:text-[#9E7A47] transition-colors flex items-center ${
                    isActive('/blog') ? 'text-[#9E7A47] font-medium' : ''
                  }`}
                >
                  TIN TỨC
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>

                {/* Desktop Blog Dropdown */}
                <div className="absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    {categoriesList.map((category) => (
                      <Link
                        key={category.id}
                        href={`/blog/category/${category.slug}`}
                        className={`block px-4 py-2 text-sm hover:bg-[#D8C8A4] ${
                          isActive(`/blog/category/${category.slug}`) ? 'text-[#9E7A47] font-medium' : 'text-[#333333]'
                        }`}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <Link
                href="/lien-he"
                className={`py-2 text-[#333333] hover:text-[#9E7A47] transition-colors ${
                  isActive('/lien-he') ? 'text-[#9E7A47] font-medium' : ''
                }`}
              >
                LIÊN HỆ
              </Link>
            </div>

            {/* Right Side Icons with Search */}
            <div className="flex items-center space-x-3">
              {/* Desktop Search - next to cart icon */}
              <div className="hidden lg:block relative w-52">
                <input
                  type="text"
                  placeholder="Tìm sản phẩm..."
                  className="w-full rounded-md bg-white border border-[#D8C8A4] py-1.5 pl-3 pr-8 text-sm focus:outline-none focus:ring-1 focus:ring-[#9E7A47] focus:border-[#9E7A47]"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#9E7A47] hover:text-[#4E3629]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>

              <MiniCartDropDown />

              {/* User Menu */}
              {user ? (
                <div className="relative hidden lg:block" ref={userMenuRef}>
                  <button
                    className="flex items-center focus:outline-none"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-[#D8C8A4] border border-[#9E7A47]">
                      <img
                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                        alt="User"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 py-1 bg-white rounded-md shadow-lg ring-1 ring-[#D8C8A4] z-50">
                      <Link
                        href={route('profile.edit')}
                        className="block px-4 py-2 text-sm text-[#333333] hover:bg-[#D8C8A4]"
                      >
                        Tài khoản của tôi
                      </Link>
                      <Link
                        href={route('orders.index')}
                        className="block px-4 py-2 text-sm text-[#333333] hover:bg-[#D8C8A4]"
                      >
                        Đơn hàng của tôi
                      </Link>
                      <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="block w-full text-left px-4 py-2 text-sm text-[#333333] hover:bg-[#D8C8A4]"
                      >
                        Đăng xuất
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden lg:flex items-center space-x-2">
                  <Link href={route('login')} className="px-4 py-2 text-sm font-medium text-[#9E7A47] hover:text-[#4E3629]">
                    Đăng nhập
                  </Link>
                  <Link href={route('register')} className="px-4 py-2 text-sm font-medium text-white bg-[#9E7A47] rounded-md hover:bg-[#4E3629]">
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Search - only visible on mobile */}
          <div className="py-2 px-2 md:pb-3 lg:hidden">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm sản phẩm bạn mong muốn..."
                className="w-full rounded border border-[#D8C8A4] py-2 pl-4 pr-10 bg-white focus:outline-none focus:ring-1 focus:ring-[#9E7A47] focus:border-[#9E7A47]"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#9E7A47]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          ref={mobileMenuRef}
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-xl overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-[#9E7A47]">Menu</h2>
                <button
                  className="text-[#4E3629] hover:text-[#9E7A47] focus:outline-none"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* User profile section in mobile menu */}
              {user ? (
                <div className="flex items-center space-x-3 border-b border-[#D8C8A4] pb-5">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-[#D8C8A4] border border-[#9E7A47]">
                    <img
                      src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-[#333333]">{user.name}</div>
                    <Link
                      href={route('logout')}
                      method="post"
                      as="button"
                      className="text-sm text-[#9E7A47]"
                    >
                      Đăng xuất
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex space-x-2 border-b border-[#D8C8A4] pb-5">
                  <Link
                    href={route('login')}
                    className="flex-1 py-2 text-center text-[#9E7A47] border border-[#9E7A47] rounded-md hover:bg-[#D8C8A4]"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href={route('register')}
                    className="flex-1 py-2 text-center text-white bg-[#9E7A47] rounded-md hover:bg-[#4E3629]"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}

              <nav className="space-y-4">
                <Link
                  href="/"
                  className={`block py-2 text-[#333333] hover:text-[#9E7A47] transition-colors ${
                    isActive('/') && !isActive('/blog') && !isActive('/products') ? 'text-[#9E7A47] font-medium' : ''
                  }`}
                >
                  TRANG CHỦ
                </Link>

                <Link
                  href="/about"
                  className={`block py-2 text-[#333333] hover:text-[#9E7A47] transition-colors ${
                    isActive('/about') ? 'text-[#9E7A47] font-medium' : ''
                  }`}
                >
                  GIỚI THIỆU
                </Link>

                {/* Products Dropdown in mobile menu */}
                <div>
                  <button
                    className={`flex items-center justify-between w-full py-2 text-[#333333] hover:text-[#9E7A47] transition-colors ${
                      isActive('/products') || isActive('/department/') ? 'text-[#9E7A47] font-medium' : ''
                    }`}
                    onClick={() => setProductSubmenuOpen(!productSubmenuOpen)}
                  >
                    <span>SẢN PHẨM</span>
                    <svg
                      className={`h-4 w-4 transition-transform ${productSubmenuOpen ? 'rotate-180' : ''}`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {productSubmenuOpen && (
                    <div className="mt-2 space-y-2 pl-4">
                      <Link
                        href="/products"
                        className={`block py-2 text-[#333333] hover:text-[#9E7A47] transition-colors ${
                          url === '/products' ? 'text-[#9E7A47] font-medium' : ''
                        }`}
                      >
                        Tất cả sản phẩm
                      </Link>

                      {departmentsList.map((department) => (
                        <Link
                          key={department.id}
                          href={route('department.show', { department: department.slug })}
                          className={`block py-2 hover:text-[#9E7A47] transition-colors ${
                            isActive(`/department/${department.slug}`) ? 'text-[#9E7A47] font-medium' : 'text-[#333333]'
                          }`}
                        >
                          {department.name}
                          <span className="text-gray-500 text-xs ml-1">
                            ({department.products_count || 0})
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Blog Dropdown in mobile menu */}
                <div>
                  <button
                    className={`flex items-center justify-between w-full py-2 text-[#333333] hover:text-[#9E7A47] transition-colors ${
                      isActive('/blog') ? 'text-[#9E7A47] font-medium' : ''
                    }`}
                    onClick={() => setBlogSubmenuOpen(!blogSubmenuOpen)}
                  >
                    <span>TIN TỨC</span>
                    <svg
                      className={`h-4 w-4 transition-transform ${blogSubmenuOpen ? 'rotate-180' : ''}`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {blogSubmenuOpen && (
                    <div className="mt-2 space-y-2 pl-4">
                      <Link
                        href="/blog"
                        className="block py-2 text-[#333333] hover:text-[#9E7A47] transition-colors"
                      >
                        Tất cả bài viết
                      </Link>

                      {categoriesList.map((category) => (
                        <Link
                          key={category.id}
                          href={`/blog/category/${category.slug}`}
                          className={`block py-2 hover:text-[#9E7A47] transition-colors ${
                            isActive(`/blog/category/${category.slug}`) ? 'text-[#9E7A47] font-medium' : 'text-[#333333]'
                          }`}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link
                  href="/lien-he"
                  className={`block py-2 text-[#333333] hover:text-[#9E7A47] transition-colors ${
                    isActive('/lien-he') ? 'text-[#9E7A47] font-medium' : ''
                  }`}
                >
                  LIÊN HỆ
                </Link>
              </nav>

              <div className="pt-4 border-t border-[#D8C8A4]">
                <a href="tel:0123456789" className="flex items-center py-2 text-[#333333]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#9E7A47]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Hotline: 0123 456 789
                </a>
                <a href="mailto:info@yensaigon.vn" className="flex items-center py-2 text-[#333333]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#9E7A47]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email: info@yensaigon.vn
                </a>
                <div className="flex items-center py-2 text-[#333333]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#9E7A47]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  08h00 – 20h30 từ thứ 2 – CN
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;


// import React, { useState, useEffect, useRef } from 'react';
// import { Link, usePage } from '@inertiajs/react';
// import MiniCartDropDown from "@/Components/App/MiniCartDropDown";
// import { PageProps } from '@/types';
//
// interface Category {
//   id: number;
//   name: string;
//   slug: string;
//   posts_count?: number;
// }
//
// interface NavbarProps {}
//
// const Navbar: React.FC<NavbarProps> = () => {
//   const { auth, blogCategories = [] } = usePage<PageProps & {
//     blogCategories: Category[];
//   }>().props;
//
//   const { user } = auth;
//   const { url } = usePage();
//
//   // States
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [blogSubmenuOpen, setBlogSubmenuOpen] = useState(false);
//   const [userMenuOpen, setUserMenuOpen] = useState(false);
//
//   // Refs for detecting clicks outside
//   const mobileMenuRef = useRef<HTMLDivElement>(null);
//   const userMenuRef = useRef<HTMLDivElement>(null);
//
//   // Determine if a path is active
//   const isActive = (path: string): boolean => url.startsWith(path);
//
//   // Handle click outside to close menus
//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
//         setMobileMenuOpen(false);
//       }
//       if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
//         setUserMenuOpen(false);
//       }
//     }
//
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);
//
//   // Close mobile menu on route change
//   useEffect(() => {
//     setMobileMenuOpen(false);
//     setBlogSubmenuOpen(false);
//   }, [url]);
//
//   return (
//     <div className="bg-base-100 shadow-sm sticky top-0 z-50">
//       <div className="container mx-auto px-4">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <div className="flex-shrink-0">
//             <Link href="/" className="text-xl font-bold">NhonStore</Link>
//           </div>
//
//           {/* Desktop Menu */}
//           <div className="hidden lg:flex items-center space-x-8">
//             <Link
//               href="/"
//               className={`py-2 hover:text-primary transition-colors ${
//                 isActive('/') && !isActive('/blog') && !isActive('/products') ? 'text-primary font-medium' : ''
//               }`}
//             >
//               Trang chủ
//             </Link>
//
//             <Link
//               href="/products"
//               className={`py-2 hover:text-primary transition-colors ${
//                 isActive('/products') ? 'text-primary font-medium' : ''
//               }`}
//             >
//               Sản phẩm
//             </Link>
//
//             {/* Blog Dropdown */}
//             <div className="relative group">
//               <Link
//                 href="/blog"
//                 className={`py-2 hover:text-primary transition-colors flex items-center ${
//                   isActive('/blog') ? 'text-primary font-medium' : ''
//                 }`}
//               >
//                 Blog
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//                 </svg>
//               </Link>
//
//               {/* Desktop Blog Dropdown */}
//               <div className="absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
//                 <div className="py-1">
//                   {blogCategories.map((category) => (
//                     <Link
//                       key={category.id}
//                       href={`/blog/category/${category.slug}`}
//                       className={`block px-4 py-2 text-sm hover:bg-gray-100 ${
//                         isActive(`/blog/category/${category.slug}`) ? 'text-primary font-medium' : 'text-gray-700'
//                       }`}
//                     >
//                       {category.name}
//                     </Link>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//
//           {/* Right Side Icons */}
//           <div className="flex items-center space-x-4">
//             <MiniCartDropDown />
//
//             {/* User Menu */}
//             {user ? (
//               <div className="relative" ref={userMenuRef}>
//                 <button
//                   className="flex items-center focus:outline-none"
//                   onClick={() => setUserMenuOpen(!userMenuOpen)}
//                 >
//                   <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
//                     <img
//                       src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
//                       alt="User"
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                 </button>
//
//                 {userMenuOpen && (
//                   <div className="absolute right-0 mt-2 w-48 py-1 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
//                     <Link
//                       href={route('profile.edit')}
//                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                     >
//                       Profile
//                     </Link>
//                     <Link
//                       href={route('orders.index')}
//                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                     >
//                       Đơn hàng của tôi
//                     </Link>
//                     <Link
//                       href={route('logout')}
//                       method="post"
//                       as="button"
//                       className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                     >
//                       Logout
//                     </Link>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <div className="hidden md:flex items-center space-x-2">
//                 <Link href={route('login')} className="px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100">
//                   Login
//                 </Link>
//                 <Link href={route('register')} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-focus">
//                   Register
//                 </Link>
//               </div>
//             )}
//
//             {/* Mobile menu button */}
//             <button
//               className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </div>
//
//       {/* Mobile Menu */}
//       {mobileMenuOpen && (
//         <div
//           className="fixed inset-0 z-40 lg:hidden"
//           ref={mobileMenuRef}
//         >
//           <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setMobileMenuOpen(false)}></div>
//           <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl overflow-y-auto">
//             <div className="p-6 space-y-6">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-lg font-medium">Menu</h2>
//                 <button
//                   className="text-gray-600 hover:text-gray-900 focus:outline-none"
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               </div>
//
//               <nav className="space-y-3">
//                 <Link
//                   href="/"
//                   className={`block py-2 hover:text-primary transition-colors ${
//                     isActive('/') && !isActive('/blog') && !isActive('/products') ? 'text-primary font-medium' : ''
//                   }`}
//                 >
//                   Trang chủ
//                 </Link>
//
//                 <Link
//                   href="/products"
//                   className={`block py-2 hover:text-primary transition-colors ${
//                     isActive('/products') ? 'text-primary font-medium' : ''
//                   }`}
//                 >
//                   Sản phẩm
//                 </Link>
//
//                 <div>
//                   <button
//                     className={`flex items-center justify-between w-full py-2 hover:text-primary transition-colors ${
//                       isActive('/blog') ? 'text-primary font-medium' : ''
//                     }`}
//                     onClick={() => setBlogSubmenuOpen(!blogSubmenuOpen)}
//                   >
//                     <span>Blog</span>
//                     <svg
//                       className={`h-4 w-4 transition-transform ${blogSubmenuOpen ? 'rotate-180' : ''}`}
//                       xmlns="http://www.w3.org/2000/svg"
//                       viewBox="0 0 20 20"
//                       fill="currentColor"
//                     >
//                       <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//                     </svg>
//                   </button>
//
//                   {blogSubmenuOpen && (
//                     <div className="mt-2 space-y-2 pl-4">
//                       <Link
//                         href="/blog"
//                         className="block py-2 text-gray-600 hover:text-primary transition-colors"
//                       >
//                         Tất cả bài viết
//                       </Link>
//
//                       {blogCategories.map((category) => (
//                         <Link
//                           key={category.id}
//                           href={`/blog/category/${category.slug}`}
//                           className={`block py-2 hover:text-primary transition-colors ${
//                             isActive(`/blog/category/${category.slug}`) ? 'text-primary font-medium' : 'text-gray-600'
//                           }`}
//                         >
//                           {category.name}
//                         </Link>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </nav>
//
//               {!user && (
//                 <div className="space-y-2">
//                   <Link
//                     href={route('login')}
//                     className="block w-full text-center px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
//                   >
//                     Login
//                   </Link>
//                   <Link
//                     href={route('register')}
//                     className="block w-full text-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-focus transition-colors"
//                   >
//                     Register
//                   </Link>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
//
// export default Navbar;
