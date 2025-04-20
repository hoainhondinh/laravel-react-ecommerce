import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import AccountLayout from '@/Layouts/AccountLayout';
import CurrencyFormatter from '@/Components/Core/CurrencyFormatter';

interface Order {
  id: number;
  total_price: number;
  status: string;
  status_text: string;
  payment_status: string;
  payment_status_text: string;
  payment_method: string;
  created_at: string;
}

export default function Index({
                                orders
                              }: PageProps<{
  orders: Order[]
}>) {
  const [activeTab, setActiveTab] = useState('all');
  const [cancelOrderId, setCancelOrderId] = useState<number | null>(null);

  const cancelForm = useForm({
    cancel_reason: '',
  });

  // Filter orders based on active tab
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return order.status === 'pending';
    if (activeTab === 'processing') return order.status === 'processing';
    if (activeTab === 'completed') return order.status === 'completed';
    if (activeTab === 'canceled') return order.status === 'canceled';
    return true;
  });

  // Tabs data
  const tabs = [
    { id: 'all', label: 'Tất cả' },
    { id: 'pending', label: 'Chờ xử lý' },
    { id: 'processing', label: 'Đang giao' },
    { id: 'completed', label: 'Đã giao' },
    { id: 'canceled', label: 'Đã hủy' }
  ];

  // Handle order cancellation
  const handleCancelOrder = () => {
    if (cancelOrderId) {
      cancelForm.post(route('orders.cancel', cancelOrderId), {
        onSuccess: () => {
          setCancelOrderId(null);
          cancelForm.reset();
        },
      });
    }
  };

  return (
    <AccountLayout title="Đơn hàng của tôi">
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-6 py-3 font-medium text-sm border-b-2 ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders list */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <p className="text-gray-500 mb-2">Không có đơn hàng nào</p>
          <p className="text-sm text-gray-500 mb-4">Bạn chưa có đơn hàng nào trong mục này</p>
          <Link
            href="/products"
            className="btn btn-primary text-white"
          >
            Mua sắm ngay
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Order header */}
              <div className="bg-gray-50 p-4 flex justify-between items-center border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-600">Đơn hàng #{order.id}</p>
                  <p className="text-xs text-gray-500">
                    Ngày đặt: {new Date(order.created_at).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-medium ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        order.status === 'canceled' ? 'bg-red-100 text-red-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {order.status_text}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-medium ${
                      order.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                        order.payment_status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {order.payment_status_text}
                  </span>
                </div>
              </div>

              {/* Order items - would be populated from API but mocking for simplicity */}
              <div className="p-4">
                <div className="space-y-3">
                  {/* Show max 2 items and "+ X more" */}
                  <div className="flex justify-between">
                    <div className="text-sm font-medium text-gray-800">
                      Tổng sản phẩm: {Math.floor(Math.random() * 5) + 1} món
                    </div>
                    <div className="text-sm font-medium text-primary">
                      <CurrencyFormatter amount={order.total_price} />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center pt-3 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    {order.payment_method === 'cod' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản ngân hàng'}
                  </div>

                  <div className="flex space-x-2">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => setCancelOrderId(order.id)}
                        className="px-3 py-1 text-xs border border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white transition-colors"
                      >
                        Hủy đơn
                      </button>
                    )}

                    <Link
                      href={route('orders.show', order.id)}
                      className="px-3 py-1 text-xs border border-primary text-primary rounded hover:bg-primary hover:text-white transition-colors"
                    >
                      Chi tiết
                    </Link>

                    {order.status === 'completed' && (
                      <button className="px-3 py-1 text-xs border border-primary text-primary rounded hover:bg-primary hover:text-white transition-colors">
                        Mua lại
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancel Order Modal */}
      {cancelOrderId && (
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
                onClick={() => {
                  setCancelOrderId(null);
                  cancelForm.reset();
                }}
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
