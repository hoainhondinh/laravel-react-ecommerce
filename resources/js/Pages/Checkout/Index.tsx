import React, { useState, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { PageProps, GroupedCartItems } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CurrencyFormatter from '@/Components/Core/CurrencyFormatter';
import FlashMessages from '@/Components/Core/FlashMessages';
import AddressSelector from '@/Components/App/AddressSelector';

interface Address {
  id: number;
  name: string;
  phone: string;
  address: string;
  province?: string;
  district?: string;
  ward?: string;
  is_default: boolean;
  full_address: string;
}

interface FormValues {
  name: string;
  email: string;
  phone: string;
  address: string;
  address_id: number;
  payment_method: string;
}

export default function Index({
                                cartItems,
                                totalPrice,
                                isGuest,
                                guestInfo,
                                auth,
                                userAddresses = []
                              }: PageProps<{
  cartItems: Record<number, GroupedCartItems>;
  totalPrice: number;
  isGuest: boolean;
  guestInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  userAddresses?: Address[];
}>) {
  const { data, setData, post, processing, errors } = useForm<FormValues>({
    name: '',
    email: '',
    phone: '',
    address: '',
    address_id: 0, // New field for selected address ID
    payment_method: 'cod'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(isGuest || userAddresses.length === 0);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

  // Client-side validation state
  const [clientErrors, setClientErrors] = useState<Record<keyof FormValues, string>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    address_id: '',
    payment_method: ''
  });

  // Pre-populate form với dữ liệu guest hoặc user tùy theo trạng thái
  useEffect(() => {
    if (isGuest && guestInfo) {
      setData({
        ...data,
        name: guestInfo.name || '',
        email: guestInfo.email || '',
        phone: guestInfo.phone || ''
      });
    } else if (auth?.user) {
      const user = auth.user;

      // If we have user addresses
      if (userAddresses.length > 0) {
        // Find default address or use the first one
        const defaultAddress = userAddresses.find(addr => addr.is_default) || userAddresses[0];

        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
          setData({
            ...data,
            address_id: defaultAddress.id,
            name: defaultAddress.name,
            phone: defaultAddress.phone,
            address: defaultAddress.full_address,
            email: user.email || '',
          });

          // If we have addresses, hide the address form initially
          setShowAddressForm(false);
        } else {
          // Fallback to user info if no addresses
          setData({
            ...data,
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            address: user.address || '',
            address_id: 0,
          });
          setShowAddressForm(true);
        }
      } else {
        // No addresses, use user profile data
        setData({
          ...data,
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          address: user.address || '',
          address_id: 0,
        });
        setShowAddressForm(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGuest, guestInfo, auth?.user, userAddresses]);

  // Handle address selection
  const handleAddressSelect = (address: Address) => {
    setSelectedAddressId(address.id);
    setData({
      ...data,
      address_id: address.id,
      name: address.name,
      phone: address.phone,
      address: address.full_address
    });
    setShowAddressForm(false);
  };

  // Toggle to add new address manually
  const handleAddNewAddress = () => {
    setSelectedAddressId(null);
    setData({
      ...data,
      address_id: 0,
      // Keep the existing data in the form for editing
    });
    setShowAddressForm(true);
  };

  // Validate field function (existing code)
  const validateField = (name: keyof FormValues, value: string) => {
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
    setClientErrors(prev => ({...prev, [name]: error}));
    return error === '';
  };

  // Handle input change with validation
  const handleChange = (name: keyof FormValues, value: string) => {
    setData(name, value);
    validateField(name, value);
  };

  // Validate all fields before submission
  const validateForm = () => {
    const fields: (keyof FormValues)[] = ['name', 'email', 'phone', 'address'];
    let isValid = true;

    fields.forEach(field => {
      const fieldIsValid = validateField(field, data[field] as string);
      if (!fieldIsValid) isValid = false;
    });

    return isValid;
  };

  // Display either client-side or server-side error
  const getErrorMessage = (field: keyof FormValues) => {
    return errors[field] || clientErrors[field];
  }

  // Submit function
  function submit(e: React.FormEvent) {
    e.preventDefault();

    if (validateForm()) {
      // Hiển thị trạng thái loading
      setIsSubmitting(true);

      post(route('checkout.store'), {
        preserveState: false,
        preserveScroll: false,

        onSuccess: (page) => {
          // Đối với guest checkout, thêm xử lý thủ công nếu cần
          if (isGuest && page.component === 'Checkout/Index') {
            // Tìm order_id từ response
            const orderId =
              page.props?.order_id ||
              page.props?.flash?.order_id;

            if (orderId) {
              // Chuyển hướng thủ công
              window.location.href = route('checkout.confirmation', orderId);
            } else {
              // Nếu không tìm thấy order_id, tải lại trang
              window.location.reload();
            }
          }
          // Nếu không, Inertia sẽ tự động xử lý chuyển hướng
        },

        onError: (errors) => {
          setIsSubmitting(false);

          // Hiển thị lỗi cho người dùng
          const errorMessage = Object.values(errors).flat().join('\n');
          if (errorMessage) {
            alert('Vui lòng kiểm tra lại thông tin:\n' + errorMessage);
          } else {
            alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
          }
        }
      });
    }
  }

  // Render account info section
  const renderAccountInfo = () => {
    if (isGuest) {
      return (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mr-2" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div>
              <h3 className="font-medium text-blue-800">Đang thanh toán với tư cách khách</h3>
              <p className="text-sm text-blue-600 mt-1">
                Bạn có thể
                <a href={route('login')} className="font-medium text-blue-700 hover:underline mx-1">đăng nhập</a>
                hoặc
                <a href={route('register')} className="font-medium text-blue-700 hover:underline mx-1">đăng ký</a>
                tài khoản để quản lý đơn hàng dễ dàng hơn.
              </p>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
            </svg>
            <div>
              <h3 className="font-medium text-green-800">Đang thanh toán với tài khoản của bạn</h3>
              <p className="text-sm text-green-600 mt-1">
                Đơn hàng sẽ được lưu vào lịch sử đơn hàng của bạn.
                {userAddresses.length === 0 && (
                  <span className="block mt-1">
                    <Link href={route('profile.addresses')} className="text-green-700 hover:underline">
                      Quản lý địa chỉ giao hàng
                    </Link>
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      );
    }
  };

  // Phần render form với các trường phân biệt xử lý
  return (
    <AuthenticatedLayout>
      <Head title="Thanh toán"/>
      <FlashMessages/>

      <div className="py-12">
        {isGuest && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                       fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"/>
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Thanh toán với tư cách khách</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>Bạn đang thanh toán với tư cách khách. Đơn hàng sẽ được xử lý và bạn sẽ nhận được email xác
                      nhận.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold mb-4 text-neutral">Thanh toán</h1>

          {/* Hiển thị thông tin tài khoản khác nhau cho guest/user */}
          {renderAccountInfo()}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Thông tin giao hàng */}
            <div className="bg-white overflow-hidden shadow-md rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4 text-neutral">Thông tin giao hàng</h2>

              <form onSubmit={submit}>
                {/* Địa chỉ selector cho người dùng đã đăng nhập */}
                {!isGuest && userAddresses.length > 0 && (
                  <div className="mb-6">
                    <AddressSelector
                      addresses={userAddresses}
                      onSelect={handleAddressSelect}
                      selectedAddressId={selectedAddressId}
                      onAddNew={handleAddNewAddress}
                    />

                    {!showAddressForm && (
                      <div className="mt-3 text-right">
                        <Link
                          href={route('profile.addresses')}
                          className="text-sm text-primary hover:underline"
                          target="_blank"
                        >
                          Quản lý địa chỉ
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {/* Form nhập thông tin nếu là guest hoặc muốn thêm địa chỉ mới */}
                {showAddressForm && (
                  <>
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
                      {getErrorMessage('name') &&
                        <div className="text-red-500 text-sm mt-1">{getErrorMessage('name')}</div>}
                    </div>

                    <div className="mb-4">
                      <label className="block text-charcoal font-medium">Email <span
                        className="text-red-500">*</span></label>
                      <input
                        type="email"
                        className={`mt-1 block w-full rounded-md shadow-sm border-gray-300 focus:border-primary focus:ring-primary ${getErrorMessage('email') ? 'border-red-500' : ''}`}
                        value={data.email}
                        onChange={e => handleChange('email', e.target.value)}
                        onBlur={e => validateField('email', e.target.value)}
                        placeholder="example@gmail.com"
                      />
                      {getErrorMessage('email') &&
                        <div className="text-red-500 text-sm mt-1">{getErrorMessage('email')}</div>}
                    </div>

                    <div className="mb-4">
                      <label className="block text-charcoal font-medium">Số điện thoại <span
                        className="text-red-500">*</span></label>
                      <input
                        type="text"
                        className={`mt-1 block w-full rounded-md shadow-sm border-gray-300 focus:border-primary focus:ring-primary ${getErrorMessage('phone') ? 'border-red-500' : ''}`}
                        value={data.phone}
                        onChange={e => handleChange('phone', e.target.value)}
                        onBlur={e => validateField('phone', e.target.value)}
                        placeholder="Ví dụ: 0912345678"
                      />
                      {getErrorMessage('phone') &&
                        <div className="text-red-500 text-sm mt-1">{getErrorMessage('phone')}</div>}
                    </div>

                    <div className="mb-4">
                      <label className="block text-charcoal font-medium">Địa chỉ giao hàng <span
                        className="text-red-500">*</span></label>
                      <textarea
                        className={`mt-1 block w-full rounded-md shadow-sm border-gray-300 focus:border-primary focus:ring-primary ${getErrorMessage('address') ? 'border-red-500' : ''}`}
                        rows={3}
                        value={data.address}
                        onChange={e => handleChange('address', e.target.value)}
                        onBlur={e => validateField('address', e.target.value)}
                        placeholder="Vui lòng nhập đầy đủ địa chỉ giao hàng (số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố)"
                      />
                      {getErrorMessage('address') &&
                        <div className="text-red-500 text-sm mt-1">{getErrorMessage('address')}</div>}
                    </div>
                  </>
                )}

                <div className="mb-4">
                  <label className="block text-charcoal font-medium mb-2">Phương thức thanh toán</label>
                  <div className="space-y-4">
                    <label
                      className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-base-200 transition-colors">
                      <input
                        type="radio"
                        name="payment_method"
                        value="cod"
                        checked={data.payment_method === 'cod'}
                        onChange={() => handleChange('payment_method', 'cod')}
                        className="mt-1 mr-3"
                      />
                      <div>
                        <div className="font-medium text-charcoal">Thanh toán khi nhận hàng (COD)</div>
                        <div className="text-sm text-gray-500">Bạn sẽ thanh toán bằng tiền mặt khi nhận được hàng</div>
                      </div>
                    </label>

                    <label
                      className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-base-200 transition-colors">
                      <input
                        type="radio"
                        name="payment_method"
                        value="bank_transfer"
                        checked={data.payment_method === 'bank_transfer'}
                        onChange={() => handleChange('payment_method', 'bank_transfer')}
                        className="mt-1 mr-3"
                      />
                      <div>
                        <div className="font-medium text-charcoal">Chuyển khoản ngân hàng (QR Code)</div>
                        <div className="text-sm text-gray-500">Quét mã QR để thanh toán qua app ngân hàng</div>
                      </div>
                    </label>
                  </div>
                  {getErrorMessage('payment_method') && <div className="text-red-500 text-sm mt-1">{getErrorMessage('payment_method')}</div>}
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    className={`w-full btn btn-primary text-white ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                    disabled={processing || isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                             fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                  strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Đang xử lý...
                      </div>
                    ) : 'Đặt hàng'}
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
                                  {item.options && item.options.length > 0 && (
                                    <span>{item.options.map(opt => opt.name).join(', ')}</span>
                                  )}
                                </div>
                                <div className="flex justify-between items-center mt-1">
                                  <span className="text-sm text-gray-500">SL: {item.quantity}</span>
                                  <span className="font-medium text-primary">
                                    <CurrencyFormatter amount={item.price * item.quantity}/>
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
                      <span className="text-primary"><CurrencyFormatter amount={totalPrice}/></span>
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
