import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import AccountLayout from '@/Layouts/AccountLayout';
import CurrencyFormatter from '@/Components/Core/CurrencyFormatter';

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

interface OrderStat {
  pending: number;
  processing: number;
  completed: number;
  canceled: number;
}

interface RecentOrder {
  id: number;
  status: string;
  total_price: number;
  created_at: string;
}

export default function Dashboard({
                                    auth,
                                    orderStats = { pending: 0, processing: 0, completed: 0, canceled: 0 },
                                    recentOrders = []
                                  }: PageProps<{
  orderStats?: OrderStat,
  recentOrders?: RecentOrder[]
}>) {
  const user = auth.user;
  const [timeOfDay, setTimeOfDay] = useState<string>('');

  // Xác định thời gian trong ngày để hiển thị lời chào
  useEffect(() => {
    const hours = new Date().getHours();
    let greeting = '';

    if (hours < 12) {
      greeting = 'Chào buổi sáng';
    } else if (hours < 18) {
      greeting = 'Chào buổi chiều';
    } else {
      greeting = 'Chào buổi tối';
    }

    setTimeOfDay(greeting);
  }, []);

  // Dashboard stats items
  const statItems = [
    {
      id: 'pending',
      title: 'Chờ xử lý',
      count: orderStats?.pending || 0,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      url: route('orders.index') + '?status=pending',
      color: 'bg-yellow-50 border-yellow-200'
    },
    {
      id: 'processing',
      title: 'Đang giao',
      count: orderStats?.processing || 0,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      url: route('orders.index') + '?status=processing',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      id: 'completed',
      title: 'Đã giao',
      count: orderStats?.completed || 0,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      ),
      url: route('orders.index') + '?status=completed',
      color: 'bg-green-50 border-green-200'
    },
    {
      id: 'canceled',
      title: 'Đã hủy',
      count: orderStats?.canceled || 0,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      url: route('orders.index') + '?status=canceled',
      color: 'bg-red-50 border-red-200'
    }
  ];

  // Các tính năng/dịch vụ trên trang chủ
  const features = [
    {
      id: 'orders',
      title: 'Đơn hàng',
      description: 'Quản lý đơn hàng, theo dõi trạng thái',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      url: route('orders.index')
    },
    {
      id: 'profile',
      title: 'Hồ sơ',
      description: 'Cập nhật thông tin cá nhân, email',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      url: route('profile.edit')
    },
    {
      id: 'addresses',
      title: 'Địa chỉ',
      description: 'Quản lý địa chỉ giao hàng',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      url: route('profile.addresses')
    },
    {
      id: 'security',
      title: 'Bảo mật',
      description: 'Đổi mật khẩu, bảo mật tài khoản',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      url: '#update-password'
    }
  ];

  // Hàm format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Hàm lấy class cho badge trạng thái
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

  // Hàm lấy text trạng thái đơn hàng
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ xử lý';
      case 'processing':
        return 'Đang giao';
      case 'completed':
        return 'Đã giao';
      case 'canceled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  return (
    <AccountLayout title="Tổng quan tài khoản">
      <div className="space-y-6">
        {/* Welcome message */}
        <div className="bg-gradient-to-r from-primary to-primary-dark p-6 rounded-lg text-white">
          <h2 className="text-xl font-semibold mb-2">{timeOfDay}, {user.name}!</h2>
          <p className="text-white/90">Chào mừng bạn quay trở lại trang quản lý tài khoản.</p>
        </div>

        {/* Order stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statItems.map((item) => (
            <Link
              key={item.id}
              href={item.url}
              className={`border ${item.color} rounded-lg p-4 flex items-center hover:shadow-md transition-shadow`}
            >
              <div className="mr-4 p-3 rounded-full bg-white">{item.icon}</div>
              <div>
                <span className="block text-sm text-gray-500">{item.title}</span>
                <span className="block text-2xl font-bold">{item.count}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Features/shortcuts section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature) => (
            <Link
              key={feature.id}
              href={feature.url}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow flex flex-col items-center text-center"
            >
              <div className="p-3 rounded-full bg-primary/10 mb-4">{feature.icon}</div>
              <h3 className="font-medium text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.description}</p>
            </Link>
          ))}
        </div>

        {/* User info & Addresses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Thông tin cá nhân
            </h3>

            <div className="space-y-3">
              <div className="flex">
                <span className="text-gray-500 w-24">Họ tên:</span>
                <span className="font-medium">{user.name}</span>
              </div>
              <div className="flex">
                <span className="text-gray-500 w-24">Email:</span>
                <span className="font-medium">{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex">
                  <span className="text-gray-500 w-24">Điện thoại:</span>
                  <span className="font-medium">{user.phone}</span>
                </div>
              )}

              <div className="pt-2">
                <Link href={route('profile.edit')} className="text-primary hover:underline text-sm flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Chỉnh sửa thông tin
                </Link>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Địa chỉ giao hàng
            </h3>

            {user.address ? (
              <>
                <p className="text-gray-700 mb-4">{user.address}</p>
                <Link href={route('profile.addresses')} className="text-primary hover:underline text-sm flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Quản lý địa chỉ
                </Link>
              </>
            ) : (
              <div>
                <p className="text-gray-500 mb-4">Bạn chưa có địa chỉ giao hàng</p>
                <Link href={route('profile.addresses')} className="btn btn-primary btn-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Thêm địa chỉ
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent orders */}
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Đơn hàng gần đây
            </h3>
            <Link href={route('orders.index')} className="text-primary hover:underline text-sm">
              Xem tất cả
            </Link>
          </div>

          {recentOrders && recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã đơn hàng
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày đặt
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng tiền
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order: RecentOrder) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusBadgeClass(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                      <CurrencyFormatter amount={order.total_price} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={route('orders.show', order.id)}
                        className="text-primary hover:text-primary-dark"
                      >
                        Chi tiết
                      </Link>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-gray-500 mb-2">Bạn chưa có đơn hàng nào</p>
              <Link
                href="/products"
                className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark"
              >
                Mua sắm ngay
              </Link>
            </div>
          )}
        </div>

        {/* Help section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Hỗ trợ
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-medium mb-2">Câu hỏi thường gặp</h4>
              <p className="text-sm text-gray-500 mb-3">Tìm câu trả lời cho các câu hỏi phổ biến</p>
              <Link href="#" className="text-primary hover:underline text-sm">Xem câu hỏi</Link>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-medium mb-2">Liên hệ chúng tôi</h4>
              <p className="text-sm text-gray-500 mb-3">Gửi yêu cầu hỗ trợ hoặc phản hồi</p>
              <Link href="/lien-he" className="text-primary hover:underline text-sm">Gửi liên hệ</Link>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-medium mb-2">Chính sách mua hàng</h4>
              <p className="text-sm text-gray-500 mb-3">Xem các chính sách về đổi trả, giao hàng</p>
              <Link href="#" className="text-primary hover:underline text-sm">Xem chính sách</Link>
            </div>
          </div>
        </div>
      </div>
    </AccountLayout>
  );
}
