import InputError from '@/Components/Core/InputError';
import InputLabel from '@/Components/Core/InputLabel';
import PrimaryButton from '@/Components/Core/PrimaryButton';
import TextInput from '@/Components/Core/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ResetPassword({
                                        token,
                                        email,
                                      }: {
  token: string;
  email: string;
}) {
  const { data, setData, post, processing, errors, reset } = useForm({
    token: token,
    email: email,
    password: '',
    password_confirmation: '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route('password.store'), {
      onFinish: () => reset('password', 'password_confirmation'),
    });
  };

  return (
    <GuestLayout>
      <Head title="Đặt lại mật khẩu" />

      {/* Container cho phần giữa layout */}
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-408px)]">
        <div className="max-w-md mx-auto">
          {/* Phần tiêu đề và mô tả */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-dark-brown">Đặt lại mật khẩu</h2>
            <p className="mt-2 text-sm text-mocha">
              Nhập mật khẩu mới cho tài khoản của bạn
            </p>
          </div>

          {/* Card chính chứa form đặt lại mật khẩu */}
          <div className="card bg-white shadow-lg border border-beige/50 rounded-lg">
            <div className="card-body p-8">
              <form onSubmit={submit}>
                <div className="mb-4">
                  <InputLabel htmlFor="email" value="Email" className="font-semibold text-dark-brown" />

                  <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-2 block w-full"
                    autoComplete="username"
                    onChange={(e) => setData('email', e.target.value)}
                    disabled
                  />

                  <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mb-4">
                  <InputLabel htmlFor="password" value="Mật khẩu mới" className="font-semibold text-dark-brown" />

                  <TextInput
                    id="password"
                    type="password"
                    name="password"
                    value={data.password}
                    className="mt-2 block w-full"
                    autoComplete="new-password"
                    isFocused={true}
                    onChange={(e) => setData('password', e.target.value)}
                    errorMessage="Vui lòng nhập mật khẩu mới"
                  />

                  <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mb-6">
                  <InputLabel
                    htmlFor="password_confirmation"
                    value="Xác nhận mật khẩu mới"
                    className="font-semibold text-dark-brown"
                  />

                  <TextInput
                    type="password"
                    name="password_confirmation"
                    value={data.password_confirmation}
                    className="mt-2 block w-full"
                    autoComplete="new-password"
                    onChange={(e) =>
                      setData('password_confirmation', e.target.value)
                    }
                    errorMessage="Vui lòng xác nhận lại mật khẩu mới"
                  />

                  <InputError
                    message={errors.password_confirmation}
                    className="mt-2"
                  />
                </div>

                <div className="flex flex-col space-y-4">
                  <PrimaryButton className="w-full bg-mocha hover:bg-dark-brown transition-colors" disabled={processing}>
                    Đặt lại mật khẩu
                  </PrimaryButton>

                  <div className="text-center">
                    <Link
                      href={route('login')}
                      className="text-sm text-mocha hover:text-amber-gold transition-colors"
                    >
                      Quay lại đăng nhập
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </GuestLayout>
  );
}
