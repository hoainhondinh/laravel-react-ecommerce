import Checkbox from '@/Components/Core/Checkbox';
import InputError from '@/Components/Core/InputError';
import InputLabel from '@/Components/Core/InputLabel';
import PrimaryButton from '@/Components/Core/PrimaryButton';
import TextInput from '@/Components/Core/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
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
    <AuthenticatedLayout>
      <Head title="Log in" />
      <div className={"p-8"}>
        <div className="card bg-white shadow max-w-[420px] mx-auto">
          <div className="card-body">
            {status && (
              <div className="mb-4 text-sm font-medium text-green-600">
                {status}
              </div>
            )}

            <CheckoutNotice show={checkoutPending} />

            <form onSubmit={submit}>
              <div>
                <InputLabel htmlFor="email" value="Email"/>

                <TextInput
                  id="email"
                  type="email"
                  name="email"
                  value={data.email}
                  className="mt-1 block w-full"
                  autoComplete="username"
                  isFocused={true}
                  onChange={(e) => setData('email', e.target.value)}
                />

                <InputError message={errors.email} className="mt-2"/>
              </div>

              <div className="mt-4">
                <InputLabel htmlFor="password" value="Password"/>

                <TextInput
                  id="password"
                  type="password"
                  name="password"
                  value={data.password}
                  className="mt-1 block w-full"
                  autoComplete="current-password"
                  onChange={(e) => setData('password', e.target.value)}
                />

                <InputError message={errors.password} className="mt-2"/>
              </div>

              <div className="mt-4 block">
                <label className="flex items-center">
                  <Checkbox
                    name="remember"
                    checked={data.remember}
                    onChange={(e) =>
                      setData('remember', e.target.checked)
                    }
                  />
                  <span className="ms-2 text-sm text-gray-600 dark:text-gray-400">
                            Remember me
                        </span>
                </label>
              </div>

              <div className="mt-4 flex items-center justify-end">
                {canResetPassword && (
                  <Link
                    href={route('password.request')}
                    className="link"
                  >
                    Forgot your password?
                  </Link>
                )}

                <PrimaryButton className="ms-4" disabled={processing}>
                  Log in
                </PrimaryButton>
              </div>
            </form>

            {checkoutPending && (
              <div className="mt-6 text-center">
                <Link
                  href={route('checkout.guest')}
                  className="btn btn-outline btn-sm"
                >
                  Continue as Guest
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
