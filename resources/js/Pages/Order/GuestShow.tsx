import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { OrderShowProps, Order, OrderItem as OrderItemType, OrderHistory } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CurrencyFormatter from '@/Components/Core/CurrencyFormatter';

export default function GuestShow({
                                    order,
                                    success,
                                    error
                                  }: OrderShowProps) {
  const [showCancelModal, setShowCancelModal] = useState(false);

  const cancelForm = useForm({
    cancel_reason: '',
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
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
        return 'badge badge-warning';
      case 'processing':
        return 'badge badge-info';
      case 'completed':
        return 'badge badge-success';
      case 'canceled':
        return 'badge badge-error';
      default:
        return 'badge';
    }
  };

  const getPaymentStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'badge badge-warning';
      case 'paid':
        return 'badge badge-success';
      case 'awaiting':
        return 'badge badge-info';
      case 'failed':
        return 'badge badge-error';
      default:
        return 'badge';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'processing':
        return 'Processing';
      case 'completed':
        return 'Completed';
      case 'canceled':
        return 'Canceled';
      default:
        return status;
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending Payment';
      case 'paid':
        return 'Paid';
      case 'awaiting':
        return 'Awaiting Payment';
      case 'failed':
        return 'Failed';
      default:
        return status;
    }
  };

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'cod':
        return 'Cash on Delivery (COD)';
      case 'bank_transfer':
        return 'Bank Transfer';
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
      <Head title={`Order #${order.id}`}/>
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Order Details #{order.id}</h1>
        </div>

        {success && (
          <div className="alert alert-success mb-6">
            <div className="flex-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <label>{success}</label>
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-error mb-6">
            <div className="flex-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <label>{error}</label>
            </div>
          </div>
        )}

        {/* Guest notice */}
        <div className="alert alert-info mb-6">
          <div className="flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-bold">Important Note</h3>
              <div className="text-sm">
                This is your order tracking page. Please bookmark this URL to check your order later.
              </div>
              <div className="text-sm mt-1">
                For better order management, you can <Link href={route('register')} className="text-primary font-medium hover:underline">register an account</Link> or <Link href={route('login')} className="text-primary font-medium hover:underline">login</Link> if you already have one.
              </div>
            </div>
          </div>
        </div>

        {/* Order status */}
        <div className="card bg-white shadow mb-6">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="card-title">Order Status</h2>
                <div className="flex space-x-2 mt-2">
                  <span className={getStatusBadgeClass(order.status)}>
                    {getStatusText(order.status)}
                  </span>
                  <span className={getPaymentStatusBadgeClass(order.payment_status)}>
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
                    Cancel Order
                  </button>
                )}
              </div>
            </div>

            {order.cancel_reason && (
              <div className="alert alert-error mt-4">
                <div className="flex-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-bold">Cancellation Reason</h3>
                    <div className="text-sm">{order.cancel_reason}</div>
                    {order.canceled_at && (
                      <div className="text-xs mt-1">Cancelled on: {formatDate(order.canceled_at)}</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Order information */}
          <div className="card bg-white shadow">
            <div className="card-body">
              <h2 className="card-title">Order Information</h2>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <tbody>
                  <tr>
                    <td className="font-medium">Order ID:</td>
                    <td>#{order.id}</td>
                  </tr>
                  <tr>
                    <td className="font-medium">Date:</td>
                    <td>{formatDate(order.created_at)}</td>
                  </tr>
                  <tr>
                    <td className="font-medium">Status:</td>
                    <td><span className={getStatusBadgeClass(order.status)}>{getStatusText(order.status)}</span></td>
                  </tr>
                  <tr>
                    <td className="font-medium">Payment:</td>
                    <td><span className={getPaymentStatusBadgeClass(order.payment_status)}>{getPaymentStatusText(order.payment_status)}</span></td>
                  </tr>
                  <tr>
                    <td className="font-medium">Payment Method:</td>
                    <td>{getPaymentMethodText(order.payment_method)}</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Shipping information */}
          <div className="card bg-white shadow">
            <div className="card-body">
              <h2 className="card-title">Shipping Information</h2>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <tbody>
                  <tr>
                    <td className="font-medium">Recipient:</td>
                    <td>{order.name}</td>
                  </tr>
                  <tr>
                    <td className="font-medium">Email:</td>
                    <td>{order.email}</td>
                  </tr>
                  <tr>
                    <td className="font-medium">Phone:</td>
                    <td>{order.phone}</td>
                  </tr>
                  <tr>
                    <td className="font-medium">Address:</td>
                    <td>{order.address}</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Product list */}
        <div className="card bg-white shadow mb-6">
          <div className="card-body">
            <h2 className="card-title mb-4">Products</h2>

            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                <tr>
                  <th>Product</th>
                  <th className="text-center">Quantity</th>
                  <th className="text-center">Price</th>
                  <th className="text-right">Total</th>
                </tr>
                </thead>
                <tbody>
                {order.items.map((item: OrderItemType) => (
                  <tr key={item.id}>
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <img src={item.product.image} alt={item.product.title} />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{item.product.title}</div>
                          {item.options && (
                            <div className="text-sm opacity-70">
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
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-center">
                      <CurrencyFormatter amount={item.price}/>
                    </td>
                    <td className="text-right font-medium">
                      <CurrencyFormatter amount={item.price * item.quantity}/>
                    </td>
                  </tr>
                ))}
                </tbody>
                <tfoot>
                <tr>
                  <th colSpan={3} className="text-right font-bold">Total:</th>
                  <th className="text-right">
                    <CurrencyFormatter amount={order.total_price}/>
                  </th>
                </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Order history */}
        {order.histories && order.histories.length > 0 && (
          <div className="card bg-white shadow">
            <div className="card-body">
              <h2 className="card-title mb-4">Order History</h2>

              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Notes</th>
                  </tr>
                  </thead>
                  <tbody>
                  {order.histories.map((history: OrderHistory) => (
                    <tr key={history.id}>
                      <td>{formatDate(history.created_at)}</td>
                      <td>
                          <span className={getStatusBadgeClass(history.status)}>
                            {getStatusText(history.status)}
                          </span>
                      </td>
                      <td>{history.note || '-'}</td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cancel order modal */}
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
