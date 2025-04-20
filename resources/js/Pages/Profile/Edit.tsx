import { useRef, useState, FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import InputError from '@/Components/Core/InputError';
import InputLabel from '@/Components/Core/InputLabel';
import PrimaryButton from '@/Components/Core/PrimaryButton';
import TextInput from '@/Components/Core/TextInput';
import { Transition } from '@headlessui/react';
import AccountLayout from '@/Layouts/AccountLayout';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import DeleteUserForm from './Partials/DeleteUserForm';

export default function Edit({ auth, mustVerifyEmail, status }: PageProps<{ mustVerifyEmail: boolean, status?: string }>) {
  const user = auth.user;

  const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
    name: user.name,
    email: user.email,
    address: user.address || '',
    phone: user.phone || '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    patch(route('profile.update'));
  };

  return (
    <AccountLayout title="Hồ sơ của tôi">
      <div className="max-w-xl">
        <p className="text-sm text-gray-600 mb-6">
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </p>

        <form onSubmit={submit} className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Form fields column */}
            <div className="space-y-6">
              <div>
                <InputLabel htmlFor="name" value="Họ tên" />

                <TextInput
                  id="name"
                  className="mt-1 block w-full"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  required
                  autoComplete="name"
                />

                <InputError className="mt-2" message={errors.name} />
              </div>

              <div>
                <InputLabel htmlFor="email" value="Email" />

                <TextInput
                  id="email"
                  type="email"
                  className="mt-1 block w-full"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  required
                  autoComplete="username"
                />

                <InputError className="mt-2" message={errors.email} />
              </div>

              {/* Thêm trường số điện thoại */}
              <div>
                <InputLabel htmlFor="phone" value="Số điện thoại" />

                <TextInput
                  id="phone"
                  type="tel"
                  className="mt-1 block w-full"
                  value={data.phone}
                  onChange={(e) => setData('phone', e.target.value)}
                  autoComplete="tel"
                  placeholder="Ví dụ: 0912345678"
                />

                <InputError className="mt-2" message={errors.phone} />
              </div>

              {/* Thêm trường địa chỉ */}
              <div>
                <InputLabel htmlFor="address" value="Địa chỉ" />

                <textarea
                  id="address"
                  className="mt-1 block w-full border-gray-300 focus:border-primary focus:ring-primary rounded-md shadow-sm"
                  value={data.address}
                  onChange={(e) => setData('address', e.target.value)}
                  rows={3}
                  placeholder="Địa chỉ của bạn"
                />

                <InputError className="mt-2" message={errors.address} />
              </div>

              {mustVerifyEmail && user.email_verified_at === null && (
                <div>
                  <p className="text-sm mt-2 text-gray-800">
                    Email của bạn chưa được xác minh.
                    <Link
                      href={route('verification.send')}
                      method="post"
                      as="button"
                      className="underline text-sm text-primary hover:text-primary-focus rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ml-1"
                    >
                      Nhấn vào đây để gửi lại email xác minh.
                    </Link>
                  </p>

                  {status === 'verification-link-sent' && (
                    <div className="mt-2 font-medium text-sm text-green-600">
                      Link xác minh mới đã được gửi đến email của bạn.
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-4">
                <PrimaryButton className="btn btn-primary" disabled={processing}>Lưu thay đổi</PrimaryButton>

                <Transition
                  show={recentlySuccessful}
                  enter="transition ease-in-out"
                  enterFrom="opacity-0"
                  leave="transition ease-in-out"
                  leaveTo="opacity-0"
                >
                  <p className="text-sm text-green-600">Đã lưu thành công.</p>
                </Transition>
              </div>
            </div>

            {/* Avatar column */}
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-gray-200 mx-auto mb-4">
                  <img
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    alt={user.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <button
                  type="button"
                  className="absolute bottom-3 right-3 bg-white rounded-full p-1 shadow-md border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Dung lượng file tối đa 1 MB<br/>
                Định dạng: .JPEG, .PNG
              </p>
            </div>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <UpdatePasswordForm />
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <DeleteUserForm />
        </div>
      </div>
    </AccountLayout>
  );
}
