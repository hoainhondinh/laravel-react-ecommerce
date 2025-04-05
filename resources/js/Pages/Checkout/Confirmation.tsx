import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CurrencyFormatter from '@/Components/Core/CurrencyFormatter';

interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  product: {
    title: string;
    slug: string;
    image: string;
  }
  options: string[];
}

interface Order {
  id: number;
  total_price: number;
  status: string;
  payment_method: string;
  payment_status: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  items: OrderItem[];
}

export default function Confirmation({
                                       order,
                                       qrCodeUrl
                                     }: PageProps<{
  order: Order;
  qrCodeUrl: string | null;
}>) {
  return (
    <AuthenticatedLayout>
      <Head title="Xác nhận đơn hàng" />
      <div className="py-12">
        <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm rounded-lg p-6">
            <div className="text-green-500 mb-4 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold mb-2 text-center">Đơn hàng đã được đặt thành công!</h1>
            <p className="text-gray-600 mb-6 text-center">Cảm ơn bạn đã đặt hàng. Mã đơn hàng của bạn là #{order.id}</p>

            {/* Hiển thị QR Code nếu là chuyển khoản */}
            {order.payment_method === 'bank_transfer' && qrCodeUrl && (
              <div className="bg-gray-50 p-6 rounded-lg mb-6 text-center">
                <h2 className="font-bold mb-4">Quét mã QR để thanh toán</h2>
                <p className="mb-4 text-sm text-gray-600">
                  Vui lòng sử dụng ứng dụng ngân hàng để quét mã QR dưới đây và hoàn tất thanh toán.
                  Đơn hàng của bạn sẽ được xử lý sau khi chúng tôi nhận được thanh toán.
                </p>
                <div className="mb-4 flex justify-center">
                  <img src={qrCodeUrl} alt="QR Code thanh toán" className="h-64" />
                </div>
                <div className="font-medium">
                  Số tiền cần thanh toán: <span className="text-red-600"><CurrencyFormatter amount={order.total_price} /></span>
                </div>
              </div>
            )}

            {/* Thông tin đơn hàng */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h2 className="font-bold mb-2">Thông tin đơn hàng</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="font-medium text-sm text-gray-500">Thông tin người nhận</h3>
                  <p className="mt-1">{order.name}</p>
                  <p>{order.phone}</p>
                  <p>{order.email}</p>
                  <p>{order.address}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-gray-500">Phương thức thanh toán</h3>
                  <p className="mt-1">
                    {order.payment_method === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản ngân hàng'}
                  </p>

                  <h3 className="font-medium text-sm text-gray-500 mt-3">Ngày đặt hàng</h3>
                  <p className="mt-1">{new Date(order.created_at).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>

              <h3 className="font-bold mb-2">Các sản phẩm đã đặt</h3>
              <ul className="space-y-2 mb-4">
                {order.items.map(item => (
                  <li key={item.id} className="flex justify-between items-center py-2 border-b">
                    <div className="flex items-center">
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        className="w-12 h-12 object-cover mr-3"
                      />
                      <div>
                        <div>{item.product.title} x{item.quantity}</div>
                        {/*{item.options && item.options.length > 0 && (*/}
                        {/*  <div className="text-sm text-gray-500">{item.options.join(', ')}</div>*/}
                        {/*)}*/}
                        {/*{item.options && (*/}
                        {/*  <div className="text-sm text-gray-500">*/}
                        {/*    {typeof item.options === 'string'*/}
                        {/*      ? JSON.parse(item.options).join(', ')*/}
                        {/*      : Array.isArray(item.options)*/}
                        {/*        ? item.options.join(', ')*/}
                        {/*        : ''}*/}
                        {/*  </div>*/}
                        {/*)}*/}
                        {item.options && (
                          <div className="text-sm text-gray-500">
                            {(() => {
                              // Parse JSON string if needed
                              let optionsData = item.options;
                              if (typeof optionsData === 'string') {
                                try {
                                  optionsData = JSON.parse(optionsData);
                                } catch (e) {
                                  return optionsData; // Return as is if not valid JSON
                                }
                              }

                              // If it's an empty object or array, don't show anything
                              if ((Array.isArray(optionsData) && optionsData.length === 0) ||
                                (typeof optionsData === 'object' && Object.keys(optionsData).length === 0)) {
                                return '';
                              }

                              // Format options based on your application's structure
                              if (Array.isArray(optionsData)) {
                                return optionsData.map(opt =>
                                  typeof opt === 'object' && opt !== null
                                    ? `${opt.name || ''}`
                                    : String(opt)
                                ).filter(Boolean).join(', ');
                              } else if (typeof optionsData === 'object' && optionsData !== null) {
                                // This handles the case where options might be structured similar to option_ids
                                return Object.entries(optionsData)
                                  .map(([key, value]) => {
                                    // Skip rendering if value is null or undefined
                                    if (value === null || value === undefined) return '';

                                    // If value is an object with a name property (like a VariationTypeOption)
                                    if (typeof value === 'object' && value !== null && 'name' in value) {
                                      return value.name;
                                    }

                                    // For regular key-value pairs
                                    return `${key}: ${String(value)}`;
                                  })
                                  .filter(Boolean)
                                  .join(', ');
                              }

                              return String(optionsData);
                            })()}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="font-medium">
                      <CurrencyFormatter amount={item.price * item.quantity}/>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="border-t pt-2">
                <div className="flex justify-between font-bold">
                  <span>Tổng thanh toán:</span>
                  <span><CurrencyFormatter amount={order.total_price} /></span>
                </div>
              </div>
            </div>

            <div className="space-x-4 text-center">
              <Link href={route('orders.show', order.id)} className="btn btn-primary">
                Xem chi tiết đơn hàng
              </Link>
              <Link href={route('dashboard')} className="btn btn-outline">
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
