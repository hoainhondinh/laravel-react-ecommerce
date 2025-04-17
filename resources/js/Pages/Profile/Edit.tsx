import { useRef, useState, FormEventHandler } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import InputError from '@/Components/Core/InputError';
import InputLabel from '@/Components/Core/InputLabel';
import PrimaryButton from '@/Components/Core/PrimaryButton';
import TextInput from '@/Components/Core/TextInput';
import { Transition } from '@headlessui/react';
import FlashMessages from '@/Components/Core/FlashMessages';

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
    <AuthenticatedLayout
      header={<h2 className="font-semibold text-xl leading-tight">Tài khoản của tôi</h2>}
    >
      <Head title="Tài khoản" />
      <FlashMessages />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
            <header>
              <h2 className="text-lg font-medium text-neutral">Thông tin tài khoản</h2>
              <p className="mt-1 text-sm text-gray-600">
                Cập nhật thông tin tài khoản và địa chỉ giao hàng của bạn.
              </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
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
                <InputLabel htmlFor="address" value="Địa chỉ giao hàng" />

                <textarea
                  id="address"
                  className="mt-1 block w-full border-gray-300 focus:border-primary focus:ring-primary rounded-md shadow-sm"
                  value={data.address}
                  onChange={(e) => setData('address', e.target.value)}
                  rows={3}
                  placeholder="Vui lòng nhập đầy đủ địa chỉ (số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố)"
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
                      className="underline text-sm text-primary hover:text-primary-focus rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
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
            </form>
          </div>

          <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
            <UpdatePasswordForm />
          </div>

          <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
            <DeleteUserForm />
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
