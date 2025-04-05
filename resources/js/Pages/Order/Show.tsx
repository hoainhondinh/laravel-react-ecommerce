import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CurrencyFormatter from '@/Components/Core/CurrencyFormatter';

interface OrderItem {
  id: number;
  product_id: number;
  variation_id: number | null;
  quantity: number;
  price: number;
  product: {
    title: string;
    slug: string;
    image: string;
    current_stock: number; // Số lượng tồn kho hiện tại
  }
  options: string[];
  current_stock: number; // Số lượng tồn kho hiện tại của biến thể
}

interface OrderHistory {
  id: number;
  status: string;
  note: string;
  created_at: string;
}

interface Order {
  id: number;
  total_price: number;
  status: string;
  payment_method: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  cancel_reason: string | null;
  canceled_at: string | null;
  items: OrderItem[];
  histories: OrderHistory[];
  can_be_canceled: boolean; // Kiểm tra xem đơn hàng có thể hủy không
}

export default function Show({
                               order
                             }: PageProps<{
  order: Order
}>) {
  const [showCancelModal, setShowCancelModal] = useState(false);

  const cancelForm = useForm({
    cancel_reason: '',
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'awaiting':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ xử lý';
      case 'processing':
        return 'Đang xử lý';
      case 'completed':
        return 'Hoàn thành';
      case 'canceled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ thanh toán';
      case 'paid':
        return 'Đã thanh toán';
      case 'awaiting':
        return 'Chờ chuyển khoản';
      case 'failed':
        return 'Thất bại';
      default:
        return status;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'cod':
        return 'Thanh toán khi nhận hàng (COD)';
      case 'bank_transfer':
        return 'Chuyển khoản ngân hàng';
      default:
        return method;
    }
  };

  function handleCancelOrder() {
    cancelForm.post(route('orders.cancel', order.id), {
      onSuccess: () => {
        setShowCancelModal(false);
      },
    });
  }

  return (
    <AuthenticatedLayout>
      <Head title={`Đơn hàng #${order.id}`}/>
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Chi tiết đơn hàng #{order.id}</h1>
            <Link href={route('orders.index')} className="text-blue-600 hover:underline">
              &larr; Quay lại danh sách đơn hàng
            </Link>
          </div>

          {/* Trạng thái đơn hàng hiện tại */}
          <div className="bg-white overflow-hidden shadow-sm rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Trạng thái đơn hàng</h2>
                <div className="flex space-x-2 mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusBadgeClass(order.payment_status)}`}>
                    {getPaymentStatusText(order.payment_status)}
                  </span>
                </div>
              </div>
              <div>
                {order.can_be_canceled && order.status !== 'canceled' && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="btn btn-error btn-sm"
                  >
                    Hủy đơn hàng
                  </button>
                )}

                {order.payment_status === 'awaiting' && order.payment_method === 'bank_transfer' && (
                  <Link
                    href={route('checkout.confirmation', order.id)}
                    className="btn btn-primary btn-sm ml-2"
                  >
                    Thanh toán
                  </Link>
                )}
              </div>
            </div>

            {order.cancel_reason && (
              <div className="mt-4 p-4 bg-red-50 rounded-md">
                <p className="text-sm font-medium text-red-800">Lý do hủy đơn: {order.cancel_reason}</p>
                {order.canceled_at && (
                  <p className="text-xs text-red-600 mt-1">Thời gian hủy: {formatDate(order.canceled_at)}</p>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Thông tin đơn hàng */}
            <div className="bg-white overflow-hidden shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">Thông tin đơn hàng</h2>
              <p className="mb-2"><span className="font-medium">Mã đơn hàng:</span> #{order.id}</p>
              <p className="mb-2"><span className="font-medium">Ngày đặt:</span> {formatDate(order.created_at)}</p>
              <p className="mb-2">
                <span className="font-medium">Trạng thái:</span>
                <span
                  className={`ml-2 px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </p>
              <p className="mb-2">
                <span className="font-medium">Thanh toán:</span>
                <span
                  className={`ml-2 px-2 py-0.5 text-xs font-semibold rounded-full ${getPaymentStatusBadgeClass(order.payment_status)}`}>
                  {getPaymentStatusText(order.payment_status)}
                </span>
              </p>
              <p className="mb-2">
                <span className="font-medium">Phương thức thanh toán:</span>
                {getPaymentMethodText(order.payment_method)}
              </p>
            </div>

            {/* Thông tin giao hàng */}
            <div className="bg-white overflow-hidden shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">Thông tin giao hàng</h2>
              <p className="mb-2"><span className="font-medium">Người nhận:</span> {order.name}</p>
              <p className="mb-2"><span className="font-medium">Email:</span> {order.email}</p>
              <p className="mb-2"><span className="font-medium">Số điện thoại:</span> {order.phone}</p>
              <p className="mb-2"><span className="font-medium">Địa chỉ:</span> {order.address}</p>
            </div>
          </div>

          {/* Danh sách sản phẩm */}
          <div className="bg-white overflow-hidden shadow-sm rounded-lg p-6 mb-6">
            <h2 className="text-lg font-bold mb-4">Sản phẩm</h2>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số lượng
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đơn giá
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thành tiền
                  </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={item.product.image}
                          alt={item.product.title}
                          className="w-12 h-12 object-cover mr-3"
                        />
                        <div>
                          <div className="font-medium">
                            <Link href={route('product.show', item.product.slug)} className="hover:text-blue-600">
                              {item.product.title}
                            </Link>
                          </div>
                          {/*{item.options && item.options.length > 0 && (*/}
                          {/*  <div className="text-sm text-gray-500">{item.options.join(', ')}</div>*/}
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

                                // Handle different data types
                                if (Array.isArray(optionsData)) {
                                  return optionsData.map(opt =>
                                    typeof opt === 'object' && opt !== null
                                      ? (opt.name ? opt.name : JSON.stringify(opt))
                                      : String(opt)
                                  ).join(', ');
                                } else if (typeof optionsData === 'object' && optionsData !== null) {
                                  return Object.entries(optionsData)
                                    .map(([key, value]) => {
                                      if (value === null || value === undefined) return '';
                                      if (typeof value === 'object') return `${key}: ${value.name || JSON.stringify(value)}`;
                                      return `${key}: ${value}`;
                                    })
                                    .filter(Boolean)
                                    .join(', ');
                                }

                                return String(optionsData);
                              })()}
                            </div>
                          )}

                          {/* Hiển thị thông tin tồn kho hiện tại */}
                          <div className="text-xs mt-1">
                            {item.current_stock <= 0 ? (
                              <span className="text-red-500">Hết hàng</span>
                            ) : item.current_stock <= 5 ? (
                              <span className="text-orange-500">Còn {item.current_stock} sản phẩm</span>
                            ) : (
                              <span className="text-green-500">Còn hàng</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <CurrencyFormatter amount={item.price}/>
                    </td>
                    <td className="px-6 py-4 text-right font-medium">
                      <CurrencyFormatter amount={item.price * item.quantity}/>
                    </td>
                  </tr>
                ))}
                </tbody>
                <tfoot>
                <tr className="bg-gray-50">
                  <td colSpan={3} className="px-6 py-4 text-right font-bold">Tổng cộng:</td>
                  <td className="px-6 py-4 text-right font-bold">
                    <CurrencyFormatter amount={order.total_price}/>
                  </td>
                </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Lịch sử đơn hàng */}
          {order.histories && order.histories.length > 0 && (
            <div className="bg-white overflow-hidden shadow-sm rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">Lịch sử đơn hàng</h2>

              <div className="space-y-4">
                {order.histories.map((history) => (
                  <div key={history.id} className="flex items-start pb-4 border-b border-gray-200 last:border-0">
                    <div
                      className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20"
                           fill="currentColor">
                        <path fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{getStatusText(history.status)}</p>
                        <p className="text-sm text-gray-500">{formatDate(history.created_at)}</p>
                      </div>
                      {history.note && <p className="text-sm text-gray-600 mt-1">{history.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal hủy đơn hàng */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Xác nhận hủy đơn hàng</h3>
            <p className="mb-4 text-gray-600">
              Bạn có chắc chắn muốn hủy đơn hàng này? Thao tác này không thể hoàn tác.
            </p>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Lý do hủy (không bắt buộc)</label>
              <textarea
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="Nhập lý do hủy đơn hàng..."
                value={cancelForm.data.cancel_reason}
                onChange={e => cancelForm.setData('cancel_reason', e.target.value)}
              ></textarea>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="btn btn-ghost"
                disabled={cancelForm.processing}
              >
                Đóng
              </button>
              <button
                onClick={handleCancelOrder}
                className="btn btn-error"
                disabled={cancelForm.processing}
              >
                {cancelForm.processing ? 'Đang xử lý...' : 'Hủy đơn hàng'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
}
