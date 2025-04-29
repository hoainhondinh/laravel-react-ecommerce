import Checkbox from '@/Components/Core/Checkbox';
import InputError from '@/Components/Core/InputError';
import InputLabel from '@/Components/Core/InputLabel';
import PrimaryButton from '@/Components/Core/PrimaryButton';
import TextInput from '@/Components/Core/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import CheckoutNotice from '@/Components/Auth/CheckoutNotice';

export default function Login({
                                status,
                                canResetPassword,
                                checkoutPending = false,
                              }: {
  status?: string;
  canResetPassword: boolean;
  checkoutPending?: boolean;
}) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route('login'), {
      onFinish: () => reset('password'),
    });
  };

  return (
    <GuestLayout>
      <Head title="Đăng nhập" />

      {/* Container cho phần giữa layout */}
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-408px)]">
        <div className="max-w-md mx-auto">
          {/* Phần tiêu đề và mô tả */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-dark-brown">
              Đăng nhập vào tài khoản
            </h2>
            <p className="mt-2 text-sm text-mocha">
              Hoặc{' '}
              <Link href={route('register')} className="font-medium text-mocha hover:text-amber-gold transition">
                đăng ký tài khoản mới
              </Link>
            </p>
          </div>

          {/* Card chính chứa form đăng nhập */}
          <div className="card bg-white shadow-lg border border-beige/50 rounded-lg">
            <div className="card-body p-8">
              {status && (
                <div className="alert alert-success mb-6">
                  <span>{status}</span>
                </div>
              )}

              <CheckoutNotice show={checkoutPending} />

              <form onSubmit={submit}>
                <div className="mb-6">
                  <InputLabel htmlFor="email" value="Email" className="font-semibold text-dark-brown"/>

                  <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-2 block w-full"
                    autoComplete="username"
                    isFocused={true}
                    onChange={(e) => setData('email', e.target.value)}
                    errorMessage="Vui lòng nhập địa chỉ email"
                  />

                  <InputError message={errors.email} className="mt-2"/>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center">
                    <InputLabel htmlFor="password" value="Mật khẩu" className="font-semibold text-dark-brown"/>

                    {canResetPassword && (
                      <Link
                        href={route('password.request')}
                        className="text-sm text-mocha hover:text-amber-gold transition-colors"
                      >
                        Quên mật khẩu?
                      </Link>
                    )}
                  </div>

                  <TextInput
                    id="password"
                    type="password"
                    name="password"
                    value={data.password}
                    className="mt-2 block w-full"
                    autoComplete="current-password"
                    onChange={(e) => setData('password', e.target.value)}
                    errorMessage="Vui lòng nhập mật khẩu"
                  />

                  <InputError message={errors.password} className="mt-2"/>
                </div>

                <div className="mb-6">
                  <label className="flex items-center">
                    <Checkbox
                      name="remember"
                      checked={data.remember}
                      onChange={(e) =>
                        setData('remember', e.target.checked)
                      }
                    />
                    <span className="ms-2 text-sm text-gray-600">
                      Ghi nhớ đăng nhập
                    </span>
                  </label>
                </div>

                <div className="flex items-center justify-center">
                  <PrimaryButton className="w-full bg-mocha hover:bg-dark-brown transition-colors" disabled={processing}>
                    Đăng nhập
                  </PrimaryButton>
                </div>
              </form>

              {checkoutPending && (
                <div className="mt-6 text-center">
                  <Link
                    href={route('checkout.guest')}
                    className="btn btn-outline btn-sm w-full border-mocha text-mocha hover:bg-mocha hover:text-white"
                  >
                    Tiếp tục như Khách
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </GuestLayout>
  );
}
