import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CurrencyFormatter from '@/Components/Core/CurrencyFormatter';

interface Order {
  id: number;
  total_price: number;
  status: string;
  payment_status: string;
  payment_method: string;
  created_at: string;
}

export default function Index({
                                orders
                              }: PageProps<{
  orders: Order[]
}>) {
  return (
    <AuthenticatedLayout>
      <Head title="Đơn hàng của tôi" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h1>

          {orders.length === 0 ? (
            <div className="bg-white overflow-hidden shadow-sm rounded-lg p-6 text-center">
              <p className="text-gray-600">Bạn chưa có đơn hàng nào.</p>
              <Link href={route('home')} className="btn btn-primary mt-4">
                Tiếp tục mua sắm
              </Link>
            </div>
          ) : (
            <div className="bg-white overflow-hidden shadow-sm rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã đơn hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày đặt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thanh toán
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(order.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <CurrencyFormatter amount={order.total_price} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'}`}>
                          {order.status === 'pending' ? 'Chờ xử lý' :
                            order.status === 'processing' ? 'Đang xử lý' :
                              order.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                            order.payment_status === 'awaiting' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'}`}>
                          {order.payment_status === 'pending' ? 'Chờ thanh toán' :
                            order.payment_status === 'paid' ? 'Đã thanh toán' :
                              order.payment_status === 'awaiting' ? 'Chờ chuyển khoản' : 'Thất bại'}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={route('orders.show', order.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Chi tiết
                      </Link>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
