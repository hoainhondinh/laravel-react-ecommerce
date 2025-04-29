import InputError from '@/Components/Core/InputError';
import InputLabel from '@/Components/Core/InputLabel';
import PrimaryButton from '@/Components/Core/PrimaryButton';
import TextInput from '@/Components/Core/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ConfirmPassword() {
  const { data, setData, post, processing, errors, reset } = useForm({
    password: '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route('password.confirm'), {
      onFinish: () => reset('password'),
    });
  };

  return (
    <GuestLayout>
      <Head title="Xác nhận mật khẩu" />

      {/* Container cho phần giữa layout */}
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-408px)]">
        <div className="max-w-md mx-auto">
          {/* Phần tiêu đề và mô tả */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-dark-brown">Xác nhận mật khẩu</h2>
            <p className="mt-2 text-sm text-mocha">
              Đây là khu vực bảo mật. Vui lòng xác nhận mật khẩu trước khi tiếp tục.
            </p>
          </div>

          {/* Card chính chứa form xác nhận mật khẩu */}
          <div className="card bg-white shadow-lg border border-beige/50 rounded-lg">
            <div className="card-body p-8">
              <form onSubmit={submit}>
                <div className="mb-6">
                  <InputLabel htmlFor="password" value="Mật khẩu" className="font-semibold text-dark-brown" />

                  <TextInput
                    id="password"
                    type="password"
                    name="password"
                    value={data.password}
                    className="mt-2 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('password', e.target.value)}
                    errorMessage="Vui lòng nhập mật khẩu"
                  />

                  <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-center">
                  <PrimaryButton className="w-full bg-mocha hover:bg-dark-brown transition-colors" disabled={processing}>
                    Xác nhận
                  </PrimaryButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </GuestLayout>
  );
}
