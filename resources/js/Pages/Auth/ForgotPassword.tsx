import InputError from '@/Components/Core/InputError';
import PrimaryButton from '@/Components/Core/PrimaryButton';
import TextInput from '@/Components/Core/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ForgotPassword({ status }: { status?: string }) {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route('password.email'));
  };

  return (
    <GuestLayout>
      <Head title="Quên mật khẩu" />

      {/* Container cho phần giữa layout */}
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-408px)]">
        <div className="max-w-md mx-auto">
          {/* Phần tiêu đề và mô tả */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-dark-brown">
              Quên mật khẩu?
            </h2>
            <p className="mt-2 text-sm text-mocha">
              Nhập email của bạn để nhận liên kết đặt lại mật khẩu
            </p>
          </div>

          {/* Card chính chứa form lấy lại mật khẩu */}
          <div className="card bg-white shadow-lg border border-beige/50 rounded-lg">
            <div className="card-body p-8">
              {status && (
                <div className="alert alert-success mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{status}</span>
                </div>
              )}

              <form onSubmit={submit}>
                <div className="mb-6">
                  <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full"
                    placeholder="Nhập địa chỉ email của bạn"
                    isFocused={true}
                    onChange={(e) => setData('email', e.target.value)}
                    errorMessage="Vui lòng nhập địa chỉ email"
                  />

                  <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="flex flex-col space-y-4">
                  <PrimaryButton className="w-full bg-mocha hover:bg-dark-brown transition-colors" disabled={processing}>
                    Gửi liên kết đặt lại mật khẩu
                  </PrimaryButton>

                  <Link
                    href={route('login')}
                    className="btn btn-outline btn-sm w-full border-mocha text-mocha hover:bg-mocha hover:text-white"
                  >
                    Quay lại đăng nhập
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
