import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { PageProps, GroupedCartItems } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CurrencyFormatter from '@/Components/Core/CurrencyFormatter';
import FlashMessages from '@/Components/Core/FlashMessages';

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

  // Client-side validation state
  const [clientErrors, setClientErrors] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    payment_method: ''
  });

  // Pre-populate form with user data if available
  useEffect(() => {
    if (window.auth && window.auth.user) {
      const user = window.auth.user;
      setData(prevData => ({
        ...prevData,
        name: user.name || prevData.name,
        email: user.email || prevData.email,
        phone: user.phone || prevData.phone,
        address: user.address || prevData.address
      }));
    }
  }, []);

  // Validate a single field
  const validateField = (name: string, value: string) => {
    let error = '';

    switch (name) {
      case 'name':
        if (!value.trim()) error = 'Họ tên không được để trống';
        else if (value.length < 2) error = 'Họ tên phải có ít nhất 2 ký tự';
        break;
      case 'email':
        if (!value.trim()) error = 'Email không được để trống';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Email không hợp lệ';
        break;
      case 'phone':
        if (!value.trim()) error = 'Số điện thoại không được để trống';
        else if (!/^[0-9\s\-\+\(\)]{10,20}$/.test(value))
          error = 'Số điện thoại không hợp lệ';
        break;
      case 'address':
        if (!value.trim()) error = 'Địa chỉ không được để trống';
        else if (value.length < 10) error = 'Vui lòng nhập địa chỉ đầy đủ (ít nhất 10 ký tự)';
        break;
    }

    // Update error state for this field
    setClientErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  // Handle input change with validation
  const handleChange = (name: string, value: string) => {
    setData(name, value);
    validateField(name, value);
  };

  // Validate all fields before submission
  const validateForm = () => {
    const fields = ['name', 'email', 'phone', 'address'];
    let isValid = true;

    fields.forEach(field => {
      const fieldIsValid = validateField(field, data[field as keyof typeof data] as string);
      if (!fieldIsValid) isValid = false;
    });

    return isValid;
  };

  function submit(e: React.FormEvent) {
    e.preventDefault();

    // Only submit if client-side validation passes
    if (validateForm()) {
      post(route('checkout.store'));
    }
  }

  // Display either client-side or server-side error
  const getErrorMessage = (field: string) => {
    return errors[field] || clientErrors[field as keyof typeof clientErrors];
  };

  return (
    <AuthenticatedLayout>
      <Head title="Thanh toán" />
      <FlashMessages />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold mb-4 text-neutral">Thanh toán</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Thông tin giao hàng */}
            <div className="bg-white overflow-hidden shadow-md rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4 text-neutral">Thông tin giao hàng</h2>

              <form onSubmit={submit}>
                <div className="mb-4">
                  <label className="block text-charcoal font-medium">Họ tên <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    className={`mt-1 block w-full rounded-md shadow-sm border-gray-300 focus:border-primary focus:ring-primary ${getErrorMessage('name') ? 'border-red-500' : ''}`}
                    value={data.name}
                    onChange={e => handleChange('name', e.target.value)}
                    onBlur={e => validateField('name', e.target.value)}
                    placeholder="Nhập họ tên người nhận hàng"
                  />
                  {getErrorMessage('name') && <div className="text-red-500 text-sm mt-1">{getErrorMessage('name')}</div>}
                </div>

                <div className="mb-4">
                  <label className="block text-charcoal font-medium">Email <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    className={`mt-1 block w-full rounded-md shadow-sm border-gray-300 focus:border-primary focus:ring-primary ${getErrorMessage('email') ? 'border-red-500' : ''}`}
                    value={data.email}
                    onChange={e => handleChange('email', e.target.value)}
                    onBlur={e => validateField('email', e.target.value)}
                    placeholder="example@gmail.com"
                  />
                  {getErrorMessage('email') && <div className="text-red-500 text-sm mt-1">{getErrorMessage('email')}</div>}
                </div>

                <div className="mb-4">
                  <label className="block text-charcoal font-medium">Số điện thoại <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    className={`mt-1 block w-full rounded-md shadow-sm border-gray-300 focus:border-primary focus:ring-primary ${getErrorMessage('phone') ? 'border-red-500' : ''}`}
                    value={data.phone}
                    onChange={e => handleChange('phone', e.target.value)}
                    onBlur={e => validateField('phone', e.target.value)}
                    placeholder="Ví dụ: 0912345678"
                  />
                  {getErrorMessage('phone') && <div className="text-red-500 text-sm mt-1">{getErrorMessage('phone')}</div>}
                </div>

                <div className="mb-4">
                  <label className="block text-charcoal font-medium">Địa chỉ giao hàng <span className="text-red-500">*</span></label>
                  <textarea
                    className={`mt-1 block w-full rounded-md shadow-sm border-gray-300 focus:border-primary focus:ring-primary ${getErrorMessage('address') ? 'border-red-500' : ''}`}
                    rows={3}
                    value={data.address}
                    onChange={e => handleChange('address', e.target.value)}
                    onBlur={e => validateField('address', e.target.value)}
                    placeholder="Vui lòng nhập đầy đủ địa chỉ giao hàng (số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố)"
                  ></textarea>
                  {getErrorMessage('address') && <div className="text-red-500 text-sm mt-1">{getErrorMessage('address')}</div>}
                </div>

                <div className="mb-4">
                  <label className="block text-charcoal font-medium mb-2">Phương thức thanh toán</label>
                  <div className="space-y-4">
                    <label className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-base-200 transition-colors">
                      <input
                        type="radio"
                        name="payment_method"
                        value="cod"
                        checked={data.payment_method === 'cod'}
                        onChange={() => setData('payment_method', 'cod')}
                        className="mt-1 mr-3"
                      />
                      <div>
                        <div className="font-medium text-charcoal">Thanh toán khi nhận hàng (COD)</div>
                        <div className="text-sm text-gray-500">Bạn sẽ thanh toán bằng tiền mặt khi nhận được hàng</div>
                      </div>
                    </label>

                    <label className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-base-200 transition-colors">
                      <input
                        type="radio"
                        name="payment_method"
                        value="bank_transfer"
                        checked={data.payment_method === 'bank_transfer'}
                        onChange={() => setData('payment_method', 'bank_transfer')}
                        className="mt-1 mr-3"
                      />
                      <div>
                        <div className="font-medium text-charcoal">Chuyển khoản ngân hàng (QR Code)</div>
                        <div className="text-sm text-gray-500">Quét mã QR để thanh toán qua app ngân hàng</div>
                      </div>
                    </label>
                  </div>
                  {errors.payment_method && <div className="text-red-500 text-sm mt-1">{errors.payment_method}</div>}
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full btn btn-primary text-white"
                    disabled={processing}
                  >
                    {processing ? 'Đang xử lý...' : 'Đặt hàng'}
                  </button>
                </div>
              </form>
            </div>

            {/* Tóm tắt đơn hàng */}
            <div className="bg-white overflow-hidden shadow-md rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4 text-neutral">Tóm tắt đơn hàng</h2>

              {Object.values(cartItems).length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  Giỏ hàng trống. Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-4">
                    {Object.values(cartItems).map(vendor => (
                      <div key={vendor.user.id} className="border-b pb-4">
                        <h3 className="font-medium mb-3 text-neutral">Cửa hàng: {vendor.user.name}</h3>

                        <div className="space-y-4">
                          {vendor.items.map(item => (
                            <div key={item.id} className="flex space-x-3">
                              <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border">
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-neutral line-clamp-2">{item.title}</p>
                                <div className="text-sm text-gray-500 mt-1">
                                  {item.options.length > 0 && (
                                    <span>{item.options.map(opt => opt.name).join(', ')}</span>
                                  )}
                                </div>
                                <div className="flex justify-between items-center mt-1">
                                  <span className="text-sm text-gray-500">SL: {item.quantity}</span>
                                  <span className="font-medium text-primary">
                                    <CurrencyFormatter amount={item.price * item.quantity} />
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span className="text-neutral">Tổng thanh toán:</span>
                      <span className="text-primary"><CurrencyFormatter amount={totalPrice} /></span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
