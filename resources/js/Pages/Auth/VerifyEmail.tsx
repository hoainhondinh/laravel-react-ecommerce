import PrimaryButton from '@/Components/Core/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function VerifyEmail({ status }: { status?: string }) {
  const { post, processing } = useForm({});

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route('verification.send'));
  };

  return (
    <GuestLayout>
      <Head title="Xác thực Email" />

      {/* Container cho phần giữa layout */}
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-408px)]">
        <div className="max-w-md mx-auto">
          {/* Phần tiêu đề và mô tả */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-dark-brown">Xác thực Email</h2>
            <p className="mt-2 text-sm text-mocha">
              Kiểm tra email của bạn để hoàn tất quá trình đăng ký
            </p>
          </div>

          {/* Card chính chứa thông tin xác thực email */}
          <div className="card bg-white shadow-lg border border-beige/50 rounded-lg">
            <div className="card-body p-8">
              <div className="mb-6 text-dark-brown">
                Cảm ơn bạn đã đăng ký! Trước khi bắt đầu, vui lòng xác thực địa chỉ email của bạn bằng cách nhấp vào liên kết chúng tôi vừa gửi cho bạn qua email. Nếu bạn không nhận được email, chúng tôi sẽ sẵn lòng gửi cho bạn một email khác.
              </div>

              {status === 'verification-link-sent' && (
                <div className="mb-6 p-4 bg-soft-green/20 text-sm text-dark-brown border border-soft-green rounded-md">
                  Một liên kết xác thực mới đã được gửi đến địa chỉ email bạn đã cung cấp khi đăng ký.
                </div>
              )}

              <form onSubmit={submit}>
                <div className="flex flex-col space-y-4">
                  <PrimaryButton className="w-full bg-mocha hover:bg-dark-brown transition-colors" disabled={processing}>
                    Gửi lại email xác thực
                  </PrimaryButton>

                  <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="btn btn-outline btn-sm w-full border-mocha text-mocha hover:bg-mocha hover:text-white"
                  >
                    Đăng xuất
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </GuestLayout>
  );
}
