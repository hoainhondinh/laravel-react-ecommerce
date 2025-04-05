import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { PageProps, GroupedCartItems } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CurrencyFormatter from '@/Components/Core/CurrencyFormatter';

export default function Index({
                                cartItems,
                                totalPrice
                              }: PageProps<{
  cartItems: Record<number, GroupedCartItems>;
  totalPrice: number;
}>) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    phone: '',
    address: '',
    payment_method: 'cod'
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    post(route('checkout.store'));
  }

  return (
    <AuthenticatedLayout>
      <Head title="Thanh toán" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold mb-4">Thanh toán</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Thông tin giao hàng */}
            <div className="bg-white overflow-hidden shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">Thông tin giao hàng</h2>

              <form onSubmit={submit}>
                <div className="mb-4">
                  <label className="block text-gray-700">Họ tên</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                  />
                  {errors.name && <div className="text-red-500">{errors.name}</div>}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">Email</label>
                  <input
                    type="email"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={data.email}
                    onChange={e => setData('email', e.target.value)}
                  />
                  {errors.email && <div className="text-red-500">{errors.email}</div>}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">Số điện thoại</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    value={data.phone}
                    onChange={e => setData('phone', e.target.value)}
                  />
                  {errors.phone && <div className="text-red-500">{errors.phone}</div>}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700">Địa chỉ giao hàng</label>
                  <textarea
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    rows={3}
                    value={data.address}
                    onChange={e => setData('address', e.target.value)}
                  ></textarea>
                  {errors.address && <div className="text-red-500">{errors.address}</div>}
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Phương thức thanh toán</label>
                  <div className="space-y-4">
                    <label className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="payment_method"
                        value="cod"
                        checked={data.payment_method === 'cod'}
                        onChange={() => setData('payment_method', 'cod')}
                        className="mt-1 mr-3"
                      />
                      <div>
                        <div className="font-medium">Thanh toán khi nhận hàng (COD)</div>
                        <div className="text-sm text-gray-500">Bạn sẽ thanh toán bằng tiền mặt khi nhận được hàng</div>
                      </div>
                    </label>

                    <label className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="payment_method"
                        value="bank_transfer"
                        checked={data.payment_method === 'bank_transfer'}
                        onChange={() => setData('payment_method', 'bank_transfer')}
                        className="mt-1 mr-3"
                      />
                      <div>
                        <div className="font-medium">Chuyển khoản ngân hàng (QR Code)</div>
                        <div className="text-sm text-gray-500">Quét mã QR để thanh toán qua app ngân hàng</div>
                      </div>
                    </label>
                  </div>
                  {errors.payment_method && <div className="text-red-500">{errors.payment_method}</div>}
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full btn btn-primary"
                    disabled={processing}
                  >
                    {processing ? 'Đang xử lý...' : 'Đặt hàng'}
                  </button>
                </div>
              </form>
            </div>

            {/* Tóm tắt đơn hàng */}
            <div className="bg-white overflow-hidden shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">Tóm tắt đơn hàng</h2>

              <div className="space-y-4 mb-4">
                {Object.values(cartItems).map(vendor => (
                  <div key={vendor.user.id} className="border-b pb-4">
                    <h3 className="font-medium mb-2">Cửa hàng: {vendor.user.name}</h3>

                    <div className="space-y-2">
                      {vendor.items.map(item => (
                        <div key={item.id} className="flex justify-between">
                          <div>
                            <span className="font-medium">{item.title}</span>
                            <span className="text-gray-500 ml-2">x{item.quantity}</span>
                            {item.options.length > 0 && (
                              <div className="text-sm text-gray-500">
                                {item.options.map(opt => opt.name).join(', ')}
                              </div>
                            )}
                          </div>
                          <div>
                            <CurrencyFormatter amount={item.price * item.quantity} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Tổng thanh toán:</span>
                  <span><CurrencyFormatter amount={totalPrice} /></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
