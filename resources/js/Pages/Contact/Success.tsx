import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Success({ }: PageProps) {
  return (
    <AuthenticatedLayout>
      <Head>
        <title>Gửi liên hệ thành công | Yến sào Xuân Mạnh</title>
        <meta name="description" content="Cảm ơn bạn đã liên hệ với chúng tôi." />
      </Head>

      <div className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-neutral mb-4">Cảm ơn bạn!</h1>
            <p className="text-lg text-charcoal mb-6">Chúng tôi đã nhận được tin nhắn của bạn và sẽ phản hồi trong thời gian sớm nhất.</p>

            <div className="mb-8">
              <p className="text-charcoal">Mã tham chiếu: {new Date().getTime().toString(36).toUpperCase()}</p>
              <p className="text-charcoal">Thời gian: {new Date().toLocaleString('vi-VN')}</p>
            </div>

            <div className="space-y-4">
              <Link
                href={route('contact.index')}
                className="inline-block py-3 px-6 bg-primary text-white font-medium rounded-md hover:bg-primary-dark transition-colors"
              >
                Quay lại trang liên hệ
              </Link>

              <p className="mt-2">
                <Link
                  href={route('dashboard')}
                  className="text-primary hover:text-primary-dark font-medium"
                >
                  Về trang chủ
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-neutral mb-4">Bạn có thể quan tâm</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <Link
                href={route('support.show', 'huong-dan-mua-hang')}
                className="p-4 border border-gray-200 rounded-md hover:border-primary hover:bg-base-100 transition-colors"
              >
                <h3 className="font-semibold text-neutral">Hướng dẫn mua hàng</h3>
                <p className="text-sm text-charcoal mt-1">Tìm hiểu thêm về cách thức đặt hàng và thanh toán</p>
              </Link>

              <Link
                href={route('support.show', 'chinh-sach-van-chuyen-va-giao-nhan')}
                className="p-4 border border-gray-200 rounded-md hover:border-primary hover:bg-base-100 transition-colors"
              >
                <h3 className="font-semibold text-neutral">Chính sách vận chuyển</h3>
                <p className="text-sm text-charcoal mt-1">Thông tin về thời gian và phí vận chuyển</p>
              </Link>

              <Link
                href={route('support.show', 'chinh-sach-doi-tra')}
                className="p-4 border border-gray-200 rounded-md hover:border-primary hover:bg-base-100 transition-colors"
              >
                <h3 className="font-semibold text-neutral">Chính sách đổi trả</h3>
                <p className="text-sm text-charcoal mt-1">Quy định về việc đổi trả sản phẩm</p>
              </Link>

              <Link
                href={route('support.show', 'phuong-thuc-thanh-toan')}
                className="p-4 border border-gray-200 rounded-md hover:border-primary hover:bg-base-100 transition-colors"
              >
                <h3 className="font-semibold text-neutral">Phương thức thanh toán</h3>
                <p className="text-sm text-charcoal mt-1">Các hình thức thanh toán được chấp nhận</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
