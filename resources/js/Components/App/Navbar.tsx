import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';
import MiniCartDropDown from "@/Components/App/MiniCartDropDown";
import { PageProps } from '@/types';

interface Category {
  id: number;
  name: string;
  slug: string;
  posts_count?: number;
}

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
  const { auth, blogCategories = [] } = usePage<PageProps & {
    blogCategories: Category[];
  }>().props;

  const { user } = auth;
  const { url } = usePage();

  // States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [blogSubmenuOpen, setBlogSubmenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Refs for detecting clicks outside
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Determine if a path is active
  const isActive = (path: string): boolean => url.startsWith(path);

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
  }, [url]);

  return (
    <div className="bg-base-100 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold">NhonStore</Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              href="/"
              className={`py-2 hover:text-primary transition-colors ${
                isActive('/') && !isActive('/blog') && !isActive('/products') ? 'text-primary font-medium' : ''
              }`}
            >
              Trang chủ
            </Link>

            <Link
              href="/products"
              className={`py-2 hover:text-primary transition-colors ${
                isActive('/products') ? 'text-primary font-medium' : ''
              }`}
            >
              Sản phẩm
            </Link>

            {/* Blog Dropdown */}
            <div className="relative group">
              <Link
                href="/blog"
                className={`py-2 hover:text-primary transition-colors flex items-center ${
                  isActive('/blog') ? 'text-primary font-medium' : ''
                }`}
              >
                Blog
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>

              {/* Desktop Blog Dropdown */}
              <div className="absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-1">
                  {blogCategories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/blog/category/${category.slug}`}
                      className={`block px-4 py-2 text-sm hover:bg-gray-100 ${
                        isActive(`/blog/category/${category.slug}`) ? 'text-primary font-medium' : 'text-gray-700'
                      }`}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <MiniCartDropDown />

            {/* User Menu */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  className="flex items-center focus:outline-none"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                    <img
                      src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 py-1 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <Link
                      href={route('profile.edit')}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <Link
                      href={route('logout')}
                      method="post"
                      as="button"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link href={route('login')} className="px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100">
                  Login
                </Link>
                <Link href={route('register')} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-focus">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
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
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Menu</h2>
                <button
                  className="text-gray-600 hover:text-gray-900 focus:outline-none"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <nav className="space-y-3">
                <Link
                  href="/"
                  className={`block py-2 hover:text-primary transition-colors ${
                    isActive('/') && !isActive('/blog') && !isActive('/products') ? 'text-primary font-medium' : ''
                  }`}
                >
                  Trang chủ
                </Link>

                <Link
                  href="/products"
                  className={`block py-2 hover:text-primary transition-colors ${
                    isActive('/products') ? 'text-primary font-medium' : ''
                  }`}
                >
                  Sản phẩm
                </Link>

                <div>
                  <button
                    className={`flex items-center justify-between w-full py-2 hover:text-primary transition-colors ${
                      isActive('/blog') ? 'text-primary font-medium' : ''
                    }`}
                    onClick={() => setBlogSubmenuOpen(!blogSubmenuOpen)}
                  >
                    <span>Blog</span>
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
                        className="block py-2 text-gray-600 hover:text-primary transition-colors"
                      >
                        Tất cả bài viết
                      </Link>

                      {blogCategories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/blog/category/${category.slug}`}
                          className={`block py-2 hover:text-primary transition-colors ${
                            isActive(`/blog/category/${category.slug}`) ? 'text-primary font-medium' : 'text-gray-600'
                          }`}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </nav>

              {!user && (
                <div className="space-y-2">
                  <Link
                    href={route('login')}
                    className="block w-full text-center px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href={route('register')}
                    className="block w-full text-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-focus transition-colors"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
