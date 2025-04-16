import ApplicationLogo from '@/Components/App/ApplicationLogo';
import Dropdown from '@/Components/Core/Dropdown';
import NavLink from '@/Components/Core/NavLink';
import ResponsiveNavLink from '@/Components/Core/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState, useEffect } from 'react';
import Navbar from '@/Components/App/Navbar';
import ContactButtons from "@/Components/Core/ContactButtons";
import {Toaster} from "react-hot-toast";
import ScrollToTop from "@/Components/Core/ScrollToTop";
export default function AuthenticatedLayout({
                                              header,
                                              children,
                                            }: PropsWithChildren<{ header?: ReactNode }>) {
  const user = usePage().props.auth.user;

  const [showingNavigationDropdown, setShowingNavigationDropdown] =
    useState(false);

  // Apply theme settings when component mounts
  useEffect(() => {
    // Set data-theme attribute for DaisyUI
    document.documentElement.setAttribute('data-theme', 'yensao');

    // You could also add global classes to the body here if needed
    document.body.classList.add('text-[#333333]');

    return () => {
      // Clean up when component unmounts
      document.body.classList.remove('text-[#333333]');
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#FFFFFF',
            color: '#4E3629',
            border: '1px solid #D8C8A4',
            padding: '16px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          },
          success: {
            iconTheme: {
              primary: '#9E7A47',
              secondary: '#FFFFFF',
            },
          },
          error: {
            iconTheme: {
              primary: '#F87272',
              secondary: '#FFFFFF',
            },
          }
        }}
      />      <Navbar />
      {header && (
        <header className="bg-white shadow border-b border-[#D8C8A4]">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {header}
          </div>
        </header>
      )}

      <main>{children}</main>

      <ContactButtons position="right" />
      <ScrollToTop position="right" bottom={320} showAfter={300} />

      <footer className="bg-[#4E3629] text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Yến sào Xuân Mạnh</h3>
              <p className="mb-1">Địa chỉ: 287 Trần Phú, Phường Bình Định, Thị Xã An Nhơn, Tỉnh Bình Định</p>
              <p className="mb-1">Điện thoại: 0589 153 703</p>
              <p className="mb-4">Email: yensaoxuanmanh@gmail.com</p>

              <div className="flex space-x-4">
                <a href="#" className="text-white hover:text-[#D9C97E] transition">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-[#D9C97E] transition">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">HỖ TRỢ KHÁCH HÀNG</h3>
              <ul className="space-y-2">
                <li><Link href={route('support.show', 'huong-dan-mua-hang')}
                          className="hover:text-[#D9C97E] transition">Hướng dẫn mua hàng</Link></li>
                <li><Link href={route('support.show', 'chinh-sach-doi-tra')}
                          className="hover:text-[#D9C97E] transition">Chính sách đổi trả</Link></li>
                <li><Link href={route('support.show', 'chinh-sach-bao-mat')}
                          className="hover:text-[#D9C97E] transition">Chính sách bảo mật</Link></li>
                <li><Link href={route('support.show', 'phuong-thuc-thanh-toan')}
                          className="hover:text-[#D9C97E] transition">Phương thức thanh toán</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">THÔNG TIN</h3>
              <ul className="space-y-2">
                <li><Link href="/blog" className="hover:text-[#D9C97E] transition">Tin tức</Link></li>
                <li><Link href={route('support.show', 'chinh-sach-va-quy-dinh-chung')}
                          className="hover:text-[#D9C97E] transition">Điều khoản sử dụng</Link></li>
                <li><Link href={route('support.show', 'chinh-sach-van-chuyen-va-giao-nhan')}
                          className="hover:text-[#D9C97E] transition">Chính sách vận chuyển</Link></li>
                <li><Link href={route('support.show', 'chinh-sach-kiem-hang')}
                          className="hover:text-[#D9C97E] transition">Chính sách kiểm hàng</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">ĐĂNG KÝ NHẬN TIN</h3>
              <p className="mb-4">Nhận thông tin khuyến mãi và cập nhật sản phẩm mới nhất</p>

              <div className="flex">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="px-4 py-2 w-full text-gray-800 rounded-l-md focus:outline-none focus:ring-1 focus:ring-[#9E7A47]"
                />
                <button className="bg-[#9E7A47] hover:bg-[#4E3629] text-white px-4 py-2 rounded-r-md transition-colors">
                  Đăng ký
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-[#9E7A47]/30 mt-8 pt-6 text-center text-sm text-[#D9C97E]">
            © {new Date().getFullYear()} Công ty TNHH Thương mại. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
