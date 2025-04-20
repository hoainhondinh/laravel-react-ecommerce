import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import AccountLayout from '@/Layouts/AccountLayout';
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
    <AccountLayout title={`Chi tiết đơn hàng #${order.id}`}>
      {/* Trạng thái đơn hàng hiện tại */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <div className="mb-2 flex items-center">
            <span
              className={`px-2 py-1 text-xs rounded-full font-medium mr-2 ${
                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                  order.status === 'canceled' ? 'bg-red-100 text-red-800' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
              }`}
            >
              {getStatusText(order.status)}
            </span>
            <span
              className={`px-2 py-1 text-xs rounded-full font-medium ${
                order.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                  order.payment_status === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
              }`}
            >
              {getPaymentStatusText(order.payment_status)}
            </span>
          </div>
          <p className="text-sm text-gray-600">Đặt hàng ngày: {formatDate(order.created_at)}</p>
        </div>

        <div className="mt-4 md:mt-0 flex space-x-2">
          {order.can_be_canceled && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="px-4 py-2 text-sm border border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white transition-colors"
            >
              Hủy đơn hàng
            </button>
          )}

          {order.payment_status === 'awaiting' && order.payment_method === 'bank_transfer' && (
            <Link
              href={route('checkout.confirmation', order.id)}
              className="px-4 py-2 text-sm bg-primary text-white rounded hover:bg-primary-dark transition-colors"
            >
              Thanh toán
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Order items */}
        <div className="md:col-span-2">
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <h3 className="font-medium">Danh sách sản phẩm</h3>
            </div>

            <div className="divide-y divide-gray-200">
              {order.items.map((item) => (
                <div key={item.id} className="p-4 flex">
                  <div className="w-16 h-16 flex-shrink-0 border border-gray-200 rounded overflow-hidden">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="text-sm font-medium text-gray-900 hover:text-primary"
                    >
                      {item.product.title}
                    </Link>

                    {item.options && (
                      <div className="text-sm text-gray-500 mt-1">
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

                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-500">SL: {item.quantity}</span>
                      <span className="text-sm font-medium text-gray-900">
                        <CurrencyFormatter amount={item.price} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 p-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tổng tiền:</span>
                <span className="font-medium text-primary">
                  <CurrencyFormatter amount={order.total_price} />
                </span>
              </div>
            </div>
          </div>

          {/* Order history timeline */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <h3 className="font-medium">Lịch sử đơn hàng</h3>
            </div>

            <div className="p-4">
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
                {order.histories.map((history, index) => (
                  <div key={history.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-gray-100 text-gray-700 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      {history.status === 'pending' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {history.status === 'processing' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {history.status === 'completed' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {history.status === 'canceled' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>

                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-lg border border-gray-200 shadow">
                      <div className="flex items-center justify-between space-x-2 mb-1">
                        <div className="font-semibold text-gray-900">
                          {history.status === 'pending' && 'Đơn hàng đã được tạo'}
                          {history.status === 'processing' && 'Đơn hàng đang được xử lý'}
                          {history.status === 'completed' && 'Đơn hàng đã hoàn thành'}
                          {history.status === 'canceled' && 'Đơn hàng đã bị hủy'}
                        </div>
                        <time className="text-xs text-gray-500">
                          {new Date(history.created_at).toLocaleDateString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })}
                        </time>
                      </div>
                      <div className="text-sm text-gray-600">{history.note}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right column - Order details */}
        <div className="space-y-6">
          {/* Shipping info */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <h3 className="font-medium">Thông tin giao hàng</h3>
            </div>

            <div className="p-4">
              <div className="space-y-3">
                <div>
                  <h4 className="text-xs text-gray-500">Người nhận:</h4>
                  <p className="text-sm font-medium text-gray-900">{order.name}</p>
                </div>

                <div>
                  <h4 className="text-xs text-gray-500">Địa chỉ:</h4>
                  <p className="text-sm text-gray-900">{order.address}</p>
                </div>

                <div>
                  <h4 className="text-xs text-gray-500">Số điện thoại:</h4>
                  <p className="text-sm text-gray-900">{order.phone}</p>
                </div>

                <div>
                  <h4 className="text-xs text-gray-500">Email:</h4>
                  <p className="text-sm text-gray-900">{order.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment info */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <h3 className="font-medium">Thông tin thanh toán</h3>
            </div>

            <div className="p-4">
              <div className="space-y-3">
                <div>
                  <h4 className="text-xs text-gray-500">Phương thức thanh toán:</h4>
                  <p className="text-sm font-medium text-gray-900">{getPaymentMethodText(order.payment_method)}</p>
                </div>

                <div>
                  <h4 className="text-xs text-gray-500">Trạng thái thanh toán:</h4>
                  <p className={`text-sm font-medium ${
                    order.payment_status === 'paid' ? 'text-green-600' :
                      order.payment_status === 'failed' ? 'text-red-600' :
                        'text-yellow-600'
                  }`}>
                    {getPaymentStatusText(order.payment_status)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <h3 className="font-medium">Tổng thanh toán</h3>
            </div>

            <div className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tổng tiền hàng:</span>
                  <span className="text-sm text-gray-900">
                    <CurrencyFormatter amount={order.total_price} />
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Phí vận chuyển:</span>
                  <span className="text-sm text-gray-900">0₫</span>
                </div>

                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex justify-between font-medium">
                    <span className="text-gray-900">Tổng thanh toán:</span>
                    <span className="text-primary">
                      <CurrencyFormatter amount={order.total_price} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cancel reason if exists */}
          {order.cancel_reason && (
            <div className="border border-red-200 rounded-lg p-4 bg-red-50">
              <h3 className="font-medium text-red-700 mb-2">Lý do hủy đơn hàng</h3>
              <p className="text-sm text-red-600">{order.cancel_reason}</p>
              {order.canceled_at && (
                <p className="text-xs text-red-500 mt-2">Hủy vào: {formatDate(order.canceled_at)}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Cancel Order Modal */}
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
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={cancelForm.processing}
              >
                Đóng
              </button>
              <button
                onClick={handleCancelOrder}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                disabled={cancelForm.processing}
              >
                {cancelForm.processing ? 'Đang xử lý...' : 'Hủy đơn hàng'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AccountLayout>
  );
}
