import InputError from '@/Components/Core/InputError';
import InputLabel from '@/Components/Core/InputLabel';
import Modal from '@/Components/Core/Modal';
import TextInput from '@/Components/Core/TextInput';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';

export default function DeleteUserForm({
                                         className = '',
                                       }: {
  className?: string;
}) {
  const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
  const passwordInput = useRef<HTMLInputElement>(null);

  const {
    data,
    setData,
    delete: destroy,
    processing,
    reset,
    errors,
    clearErrors,
  } = useForm({
    password: '',
  });

  const confirmUserDeletion = () => {
    setConfirmingUserDeletion(true);
  };

  const deleteUser: FormEventHandler = (e) => {
    e.preventDefault();

    destroy(route('profile.destroy'), {
      preserveScroll: true,
      onSuccess: () => closeModal(),
      onError: () => passwordInput.current?.focus(),
      onFinish: () => reset(),
    });
  };

  const closeModal = () => {
    setConfirmingUserDeletion(false);

    clearErrors();
    reset();
  };

  return (
    <section className={`space-y-6 ${className}`}>
      <header>
        <h2 className="text-xl font-bold text-neutral">
          Xóa tài khoản
        </h2>

        <p className="mt-1 text-sm text-charcoal">
          Khi tài khoản của bạn bị xóa, tất cả tài nguyên và dữ liệu của nó sẽ bị xóa vĩnh viễn.
          Trước khi xóa tài khoản, vui lòng tải xuống bất kỳ dữ liệu hoặc thông tin mà bạn muốn giữ lại.
        </p>
      </header>

      <button
        onClick={confirmUserDeletion}
        className="btn btn-error text-white"
      >
        Xóa tài khoản
      </button>

      <Modal show={confirmingUserDeletion} onClose={closeModal}>
        <form onSubmit={deleteUser} className="p-6">
          <h2 className="text-lg font-medium text-neutral">
            Bạn có chắc chắn muốn xóa tài khoản của mình?
          </h2>

          <p className="mt-1 text-sm text-charcoal">
            Khi tài khoản của bạn bị xóa, tất cả tài nguyên và dữ liệu của nó sẽ bị xóa vĩnh viễn.
            Vui lòng nhập mật khẩu của bạn để xác nhận bạn muốn xóa vĩnh viễn tài khoản của mình.
          </p>

          <div className="mt-6">
            <InputLabel
              htmlFor="password"
              value="Mật khẩu"
              className="sr-only"
            />

            <TextInput
              id="password"
              type="password"
              name="password"
              ref={passwordInput}
              value={data.password}
              onChange={(e) =>
                setData('password', e.target.value)
              }
              className="mt-1 block w-3/4 border-gray-300 focus:border-primary focus:ring-primary rounded-md shadow-sm"
              isFocused
              placeholder="Mật khẩu"
            />

            <InputError
              message={errors.password}
              className="mt-2"
            />
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={closeModal}
              className="btn btn-outline mr-3"
            >
              Hủy bỏ
            </button>

            <button
              type="submit"
              disabled={processing}
              className="btn btn-error text-white"
            >
              Xóa tài khoản
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
