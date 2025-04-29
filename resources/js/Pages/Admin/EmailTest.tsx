// resources/js/Pages/Admin/EmailTest.tsx
import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ArrowPathIcon, EnvelopeIcon, EyeIcon } from '@heroicons/react/24/outline';
import { EmailTestProps, FormData } from '@/types/email-test';

export default function EmailTest({ orders }: EmailTestProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [previewType, setPreviewType] = useState<'new_order' | 'status_update' | 'payment_confirmed'>('new_order');
  const [previousStatus, setPreviousStatus] = useState<string>('pending');

  const { data, setData, post, processing, errors, reset } = useForm<FormData>({
    email: '',
    type: 'new_order',
    order_id: orders.length > 0 ? orders[0].id : '',
    previous_status: 'pending'
  });

  const statuses = [
    { value: 'pending', label: 'Chờ xử lý' },
    { value: 'processing', label: 'Đang xử lý' },
    { value: 'completed', label: 'Đã hoàn thành' },
    { value: 'canceled', label: 'Đã hủy' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData(name as keyof FormData, value);

    // Also update preview state if needed
    if (name === 'type') setPreviewType(value as 'new_order' | 'status_update' | 'payment_confirmed');
    if (name === 'previous_status') setPreviousStatus(value);
  };

  const openPreview = () => {
    const order_id = data.order_id;
    const type = previewType;

    // Open in a new tab
    window.open(`/admin/email-test/preview?type=${type}&order_id=${order_id}&previous_status=${previousStatus}`, '_blank');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/admin/email-test/send');
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Email Testing
        </h2>
      }
    >
      <Head title="Email Testing" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Preview Card */}
          <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg mb-6">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Preview Email Template
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Type
                  </label>
                  <select
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={previewType}
                    onChange={(e) => setPreviewType(e.target.value as 'new_order' | 'status_update' | 'payment_confirmed')}
                  >
                    <option value="new_order">New Order Notification</option>
                    <option value="status_update">Status Update Notification</option>
                    <option value="payment_confirmed">Payment Confirmed Notification</option>
                  </select>
                </div>

                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order ID
                  </label>
                  <select
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={data.order_id}
                    onChange={(e) => setData('order_id', e.target.value)}
                  >
                    {orders.map((order) => (
                      <option key={order.id} value={order.id}>
                        #{order.id} - {order.name} ({order.total_price})
                      </option>
                    ))}
                  </select>
                </div>

                {previewType === 'status_update' && (
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Previous Status
                    </label>
                    <select
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={previousStatus}
                      onChange={(e) => setPreviousStatus(e.target.value)}
                    >
                      {statuses.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={openPreview}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:outline-none focus:border-indigo-700 focus:ring focus:ring-indigo-200 active:bg-indigo-600 disabled:opacity-25 transition"
              >
                <EyeIcon className="w-5 h-5 mr-2" />
                Preview Email
              </button>
            </div>
          </div>

          {/* Send Test Email Form */}
          <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
            <form onSubmit={handleSubmit} className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Send Test Email
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={data.email}
                    onChange={handleChange}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter email address"
                    required
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Type
                  </label>
                  <select
                    name="type"
                    value={data.type}
                    onChange={handleChange}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="new_order">New Order Notification</option>
                    <option value="status_update">Status Update Notification</option>
                    <option value="payment_confirmed">Payment Confirmed Notification</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order ID
                  </label>
                  <select
                    name="order_id"
                    value={data.order_id}
                    onChange={handleChange}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    {orders.map((order) => (
                      <option key={order.id} value={order.id}>
                        #{order.id} - {order.name} ({order.total_price})
                      </option>
                    ))}
                  </select>
                </div>

                {data.type === 'status_update' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Previous Status
                    </label>
                    <select
                      name="previous_status"
                      value={data.previous_status}
                      onChange={handleChange}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      {statuses.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={processing}
                  className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 focus:outline-none focus:border-green-700 focus:ring focus:ring-green-200 active:bg-green-600 disabled:opacity-25 transition"
                >
                  {processing ? (
                    <>
                      <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <EnvelopeIcon className="w-5 h-5 mr-2" />
                      Send Test Email
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
