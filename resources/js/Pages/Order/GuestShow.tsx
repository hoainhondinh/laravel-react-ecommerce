import React, { useState } from 'react';
import {Head, Link, router, useForm} from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CurrencyFormatter from '@/Components/Core/CurrencyFormatter';
import { Order, OrderItem, OrderHistory, PageProps } from '@/types';

interface GuestShowProps extends PageProps {
  order: Order;
  success?: string;
  error?: string;
}

export default function GuestShow({
                                    order,
                                    success,
                                    error
                                  }: GuestShowProps) {
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
    cancelForm.post(route('guest.orders.cancel', order.id), {
      onSuccess: () => {
        setShowCancelModal(false);
      },
    });
  }
  return (
    <AuthenticatedLayout>
      <Head title={`Đơn hàng #${order.id}`}/>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-neutral">Chi tiết đơn hàng #{order.id}</h1>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">
            <span className="block sm:inline">{success}</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Guest notice */}
        <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-md mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Lưu ý quan trọng</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>Đây là trang theo dõi đơn hàng của bạn. Vui lòng đánh dấu (bookmark) URL này để kiểm tra đơn hàng sau này.</p>
                <p className="mt-2">
                  Để quản lý đơn hàng tốt hơn, bạn có thể
                  <Link href={route('register')} className="text-blue-800 font-medium mx-1 hover:underline">đăng ký tài khoản</Link>
                  hoặc
                  <Link href={route('login')} className="text-blue-800 font-medium mx-1 hover:underline">đăng nhập</Link>
                  nếu bạn đã có tài khoản.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order status */}
        <div className="bg-white shadow rounded-lg mb-6 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Trạng thái đơn hàng</h2>
                <div className="flex space-x-2 mt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusBadgeClass(order.payment_status)}`}>
                    {getPaymentStatusText(order.payment_status)}
                  </span>
                </div>
              </div>
              <div>
                {order.can_be_canceled && order.status !== 'canceled' && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-600 hover:text-white transition-colors text-sm"
                  >
                    Hủy đơn hàng
                  </button>
                )}
              </div>
            </div>

            {order.cancel_reason && (
              <div className="mt-4 p-4 bg-red-50 rounded-md">
                <h3 className="font-semibold text-red-700">Lý do hủy đơn</h3>
                <p className="text-sm text-red-600 mt-1">{order.cancel_reason}</p>
                {order.canceled_at && (
                  <p className="text-xs text-red-500 mt-1">Thời gian hủy: {formatDate(order.canceled_at)}</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Order information */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-bold text-gray-900">Thông tin đơn hàng</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã đơn hàng:</span>
                  <span className="font-medium">#{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày đặt:</span>
                  <span>{formatDate(order.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Thanh toán:</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusBadgeClass(order.payment_status)}`}>
                    {getPaymentStatusText(order.payment_status)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phương thức thanh toán:</span>
                  <span>{getPaymentMethodText(order.payment_method)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping information */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-bold text-gray-900">Thông tin giao hàng</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Người nhận:</span>
                  <span className="font-medium">{order.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span>{order.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số điện thoại:</span>
                  <span>{order.phone}</span>
                </div>
                <div>
                  <span className="text-gray-600">Địa chỉ:</span>
                  <p className="mt-1">{order.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-bold text-gray-900">Tổng thanh toán</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tổng tiền hàng:</span>
                  <span><CurrencyFormatter amount={order.total_price} /></span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span>0₫</span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between font-bold">
                    <span>Tổng thanh toán:</span>
                    <span className="text-primary"><CurrencyFormatter amount={order.total_price} /></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product list */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-bold text-gray-900">Danh sách sản phẩm</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số lượng
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đơn giá
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thành tiền
                </th>
              </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
              {order.items.map((item: any) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 object-cover rounded-md"
                          src={item.product.image}
                          alt={item.product.title}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.product.title}
                        </div>
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

                              // Format options for display
                              if (Array.isArray(optionsData)) {
                                return optionsData.map((opt: any) =>
                                  typeof opt === 'object' && opt !== null
                                    ? (opt.name ? opt.name : JSON.stringify(opt))
                                    : String(opt)
                                ).join(', ');
                              } else if (typeof optionsData === 'object' && optionsData !== null) {
                                return Object.entries(optionsData)
                                  .map(([key, value]) => {
                                    if (value === null || value === undefined) return '';
                                    if (typeof value === 'object') return `${key}: ${(value as any).name || JSON.stringify(value)}`;
                                    return `${key}: ${value}`;
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
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                    <CurrencyFormatter amount={item.price} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                    <CurrencyFormatter amount={item.price * item.quantity} />
                  </td>
                </tr>
              ))}
              </tbody>
              <tfoot>
              <tr className="bg-gray-50">
                <td colSpan={3} className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                  Tổng cộng:
                </td>
                <td className="px-6 py-4 text-right text-sm font-bold text-primary">
                  <CurrencyFormatter amount={order.total_price} />
                </td>
              </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Order history */}
        {order.histories && order.histories.length > 0 && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-bold text-gray-900">Lịch sử đơn hàng</h2>
            </div>

            <div className="p-6">
              <div className="flow-root">
                <ul className="-mb-8">
                  {order.histories.map((history: any, historyIdx: number) => (
                    <li key={history.id}>
                      <div className="relative pb-8">
                        {historyIdx !== order.histories.length - 1 ? (
                          <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                        ) : null}
                        <div className="relative flex items-start space-x-3">
                          <div>
                            <div className={`relative px-1 py-1 rounded-full flex items-center justify-center ${
                              history.status === 'completed' ? 'bg-green-100' :
                                history.status === 'canceled' ? 'bg-red-100' :
                                  history.status === 'processing' ? 'bg-blue-100' :
                                    'bg-yellow-100'
                            }`}>
                              <svg className={`h-5 w-5 ${
                                history.status === 'completed' ? 'text-green-600' :
                                  history.status === 'canceled' ? 'text-red-600' :
                                    history.status === 'processing' ? 'text-blue-600' :
                                      'text-yellow-600'
                              }`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                {history.status === 'pending' && (
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                )}
                                {history.status === 'processing' && (
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                )}
                                {history.status === 'completed' && (
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                )}
                                {history.status === 'canceled' && (
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                )}
                              </svg>
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {getStatusText(history.status)}
                              </div>
                              <p className="mt-0.5 text-sm text-gray-500">
                                {formatDate(history.created_at)}
                              </p>
                            </div>
                            {history.note && (
                              <div className="mt-2 text-sm text-gray-700">
                                <p>{history.note}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal hủy đơn hàng */}
      {showCancelModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Order Cancellation</h3>
            <p className="py-4">Are you sure you want to cancel this order? This action cannot be undone.</p>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Cancellation Reason (optional)</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-24"
                placeholder="Please specify why you're cancelling this order..."
                value={cancelForm.data.cancel_reason}
                onChange={e => cancelForm.setData('cancel_reason', e.target.value)}
              ></textarea>
            </div>

            <div className="modal-action">
              <button
                onClick={() => setShowCancelModal(false)}
                className="btn btn-ghost"
                disabled={cancelForm.processing}
              >
                Close
              </button>
              <button
                onClick={handleCancelOrder}
                className="btn btn-error"
                disabled={cancelForm.processing}
              >
                {cancelForm.processing ? 'Processing...' : 'Cancel Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
}
