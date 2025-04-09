import InputError from '@/Components/Core/InputError';
import InputLabel from '@/Components/Core/InputLabel';
import TextInput from '@/Components/Core/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

export default function UpdatePasswordForm({
                                             className = '',
                                           }: {
  className?: string;
}) {
  const passwordInput = useRef<HTMLInputElement>(null);
  const currentPasswordInput = useRef<HTMLInputElement>(null);

  const {
    data,
    setData,
    errors,
    put,
    reset,
    processing,
    recentlySuccessful,
  } = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const updatePassword: FormEventHandler = (e) => {
    e.preventDefault();

    put(route('password.update'), {
      preserveScroll: true,
      onSuccess: () => reset(),
      onError: (errors) => {
        if (errors.password) {
          reset('password', 'password_confirmation');
          passwordInput.current?.focus();
        }

        if (errors.current_password) {
          reset('current_password');
          currentPasswordInput.current?.focus();
        }
      },
    });
  };

  return (
    <section className={className}>
      <header>
        <h2 className="text-xl font-bold text-neutral">
          Cập nhật mật khẩu
        </h2>

        <p className="mt-1 text-sm text-charcoal">
          Đảm bảo tài khoản của bạn đang sử dụng mật khẩu dài và ngẫu nhiên để giữ an toàn.
        </p>
      </header>

      <form onSubmit={updatePassword} className="mt-6 space-y-6">
        <div>
          <InputLabel
            htmlFor="current_password"
            value="Mật khẩu hiện tại"
            className="text-charcoal font-medium"
          />

          <TextInput
            id="current_password"
            ref={currentPasswordInput}
            value={data.current_password}
            onChange={(e) =>
              setData('current_password', e.target.value)
            }
            type="password"
            className="mt-1 block w-full border-gray-300 focus:border-primary focus:ring-primary rounded-md shadow-sm"
            autoComplete="current-password"
          />

          <InputError
            message={errors.current_password}
            className="mt-2"
          />
        </div>

        <div>
          <InputLabel htmlFor="password" value="Mật khẩu mới" className="text-charcoal font-medium" />

          <TextInput
            id="password"
            ref={passwordInput}
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
            type="password"
            className="mt-1 block w-full border-gray-300 focus:border-primary focus:ring-primary rounded-md shadow-sm"
            autoComplete="new-password"
          />

          <InputError message={errors.password} className="mt-2" />
        </div>

        <div>
          <InputLabel
            htmlFor="password_confirmation"
            value="Xác nhận mật khẩu mới"
            className="text-charcoal font-medium"
          />

          <TextInput
            id="password_confirmation"
            value={data.password_confirmation}
            onChange={(e) =>
              setData('password_confirmation', e.target.value)
            }
            type="password"
            className="mt-1 block w-full border-gray-300 focus:border-primary focus:ring-primary rounded-md shadow-sm"
            autoComplete="new-password"
          />

          <InputError
            message={errors.password_confirmation}
            className="mt-2"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={processing}
            className="btn btn-primary text-white"
          >
            Lưu thay đổi
          </button>

          <Transition
            show={recentlySuccessful}
            enter="transition ease-in-out"
            enterFrom="opacity-0"
            leave="transition ease-in-out"
            leaveTo="opacity-0"
          >
            <p className="text-sm text-green-600">
              Đã lưu.
            </p>
          </Transition>
        </div>
      </form>
    </section>
  );
}
