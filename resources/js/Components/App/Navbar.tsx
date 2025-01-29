import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import MiniCartDropDown from "@/Components/App/MiniCartDropDown";
import { PageProps } from '@/types';

interface Category {
  id: number;
  name: string;
  slug: string;
  posts_count?: number;
}

interface NavbarProps {
  // Nếu có props truyền vào từ component cha
}

const Navbar: React.FC<NavbarProps> = () => {
  const { auth, totalPrice, totalQuantity, blogCategories = [] } = usePage<PageProps & {
    blogCategories: Category[];
  }>().props;

  const { user } = auth;
  const { url } = usePage();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const isActive = (path: string): boolean => {
    return url.startsWith(path);
  };

  return (
    <div className="navbar bg-base-100 shadow-sm">
      {/* Mobile menu button */}
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          {/* Mobile menu */}
          <ul tabIndex={0} className={`menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 ${isMenuOpen ? 'block' : 'hidden'} lg:hidden`}>
            <li className={isActive('/') && !isActive('/blog') && !isActive('/products') ? 'text-primary font-medium' : ''}>
              <Link href="/">Trang chủ</Link>
            </li>
            <li className={isActive('/products') ? 'text-primary font-medium' : ''}>
              <Link href={route('products.index')} className="px-3 py-2">Sản phẩm</Link>
            </li>
            <li className={isActive('/blog') ? 'text-primary font-medium' : ''}>
              <Link href="/blog">Blog</Link>
              <ul className="p-2 bg-base-100 w-full">
                {blogCategories.map((category) => (
                  <li key={category.id} className="w-full">
                    <Link
                      href={`/blog/category/${category.slug}`}
                      className={`block py-2 ${isActive(`/blog/category/${category.slug}`) ? 'text-primary font-medium' : ''}`}
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost text-xl">NhonStore</Link>
      </div>

      {/* Desktop menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li className={isActive('/') && !isActive('/blog') && !isActive('/products') ? 'text-primary font-medium' : ''}>
            <Link href="/" className="px-3 py-2">Trang chủ</Link>
          </li>
          <li className={isActive('/products') ? 'text-primary font-medium' : ''}>
            <Link href="/products" className="px-3 py-2">Sản phẩm</Link>
          </li>
          {/* Blog with dropdown on hover */}
          <li className={`dropdown dropdown-hover ${isActive('/blog') ? 'text-primary font-medium' : ''}`}>
            <Link href="/blog" className="px-3 py-2 flex items-center">
              Blog
              <svg className="h-4 w-4 ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
            <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box min-w-[200px] mt-0">
              {blogCategories.map((category) => (
                <li key={category.id} className="block w-full border-b border-gray-100 last:border-b-0">
                  <Link
                    href={`/blog/category/${category.slug}`}
                    className={`block py-2 ${isActive(`/blog/category/${category.slug}`) ? 'text-primary font-medium' : ''}`}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>

      {/* Right side items */}
      <div className="navbar-end gap-4">
        <MiniCartDropDown />
        {user && (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link href={route('profile.edit')} className="justify-between">
                  Profile
                </Link>
              </li>
              <li>
                <Link href={route('logout')} method="post" as="button">
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        )}
        {!user && (
          <>
            <Link href={route('login')} className="btn">
              Login
            </Link>
            <Link href={route('register')} className="btn btn-primary">
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
