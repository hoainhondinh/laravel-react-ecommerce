import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { GuestCheckoutProps } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/Core/InputError';
import InputLabel from '@/Components/Core/InputLabel';
import TextInput from '@/Components/Core/TextInput';
import PrimaryButton from '@/Components/Core/PrimaryButton';

export default function Guest({ auth, success, error }: GuestCheckoutProps) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    phone: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Thêm log để debug
    console.log('Guest form submitted:', data);

    // Đảm bảo sử dụng đúng route name và thêm callbacks
    post(route('checkout.process-guest'), {
      // Thêm onSuccess callback
      onSuccess: () => {
        console.log('Guest checkout processed successfully');
        // Redirect sẽ được xử lý bởi controller
      },
      // Thêm onError callback
      onError: (errors) => {
        console.error('Guest checkout errors:', errors);
      },
      // Prevent scrolling to top
      preserveScroll: true
    });
  };

  return (
    <AuthenticatedLayout>
      <Head title="Guest Checkout" />

      <div className="container mx-auto p-8">
        <div className="card bg-white shadow max-w-2xl mx-auto">
          <div className="card-body p-6">
            <h2 className="card-title text-2xl mb-5">Thanh toán với tư cách khách</h2>

            {success && (
              <div className="alert alert-success mb-4">
                <div className="flex-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <label>{success}</label>
                </div>
              </div>
            )}

            {error && (
              <div className="alert alert-error mb-4">
                <div className="flex-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <label>{error}</label>
                </div>
              </div>
            )}

            <div className="alert alert-info mb-6">
              <div className="flex-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="font-bold">Tùy chọn thanh toán</h3>
                  <div className="text-sm">
                    Bạn có thể tiếp tục với tư cách khách hoặc
                    <Link href={route('login')} className="text-primary ml-1 hover:underline">
                      đăng nhập
                    </Link> nếu bạn đã có tài khoản.
                  </div>
                  <div className="text-sm mt-2">
                    <span className="font-medium">Lợi ích khi tạo tài khoản:</span>
                    <ul className="list-disc list-inside ml-2 mt-1">
                      <li>Theo dõi đơn hàng</li>
                      <li>Xem lịch sử đơn hàng</li>
                      <li>Nhận ưu đãi đặc biệt</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <InputLabel htmlFor="name" value="Họ tên" />
                  <TextInput
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                    className="mt-1 block w-full"
                    required
                  />
                  <InputError message={errors.name} className="mt-2" />
                </div>

                <div>
                  <InputLabel htmlFor="email" value="Email" />
                  <TextInput
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={e => setData('email', e.target.value)}
                    className="mt-1 block w-full"
                    required
                  />
                  <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                  <InputLabel htmlFor="phone" value="Số điện thoại" />
                  <TextInput
                    id="phone"
                    type="tel"
                    value={data.phone}
                    onChange={e => setData('phone', e.target.value)}
                    className="mt-1 block w-full"
                    required
                  />
                  <InputError message={errors.phone} className="mt-2" />
                </div>
              </div>

              <div className="flex items-center justify-between mt-8">
                <PrimaryButton
                  type="submit"
                  disabled={processing}
                  className="ms-4"
                >
                  {processing ? 'Đang xử lý...' : 'Tiếp tục thanh toán'}
                </PrimaryButton>

                <div className="text-sm">
                  <Link
                    href={route('login')}
                    className="text-primary hover:underline"
                  >
                    Đăng nhập
                  </Link>
                  <span className="mx-2 text-gray-500">|</span>
                  <Link
                    href={route('register')}
                    className="text-primary hover:underline"
                  >
                    Đăng ký
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
