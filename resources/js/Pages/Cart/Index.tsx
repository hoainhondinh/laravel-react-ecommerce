import {GroupedCartItems, PageProps} from "@/types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {Head, Link, router, useForm} from "@inertiajs/react";
import CurrencyFormatter from "@/Components/Core/CurrencyFormatter";
import PrimaryButton from "@/Components/Core/PrimaryButton";
import {CreditCardIcon} from "@heroicons/react/24/outline";
import CartItem from "@/Components/App/CartItem";
import React, {useEffect, useState} from "react";
import toast from "react-hot-toast";

function Index(
  {
    csrf_token,
    cartItems,
    totalQuantity: initialTotalQuantity,
    totalPrice: initialTotalPrice
  }: PageProps<{cartItems: Record<number, GroupedCartItems>}>) {

  // State để theo dõi số lượng và giá trị của giỏ hàng
  const [totalQuantity, setTotalQuantity] = useState(initialTotalQuantity);
  const [totalPrice, setTotalPrice] = useState(initialTotalPrice);

  // Cập nhật state khi cartItems thay đổi
  useEffect(() => {
    // Tính toán lại tổng số lượng và tổng giá trị
    let newTotalQuantity = 0;
    let newTotalPrice = 0;

    Object.values(cartItems).forEach(cartItem => {
      cartItem.items.forEach(item => {
        newTotalQuantity += item.quantity;
        newTotalPrice += item.price * item.quantity;
      });
    });

    setTotalQuantity(newTotalQuantity);
    setTotalPrice(newTotalPrice);
  }, [cartItems]);

  const proceedToCheckout = (vendorId: number | null = null) => {
    // Kiểm tra nếu giỏ hàng trống
    if (totalQuantity === 0) {
      toast.error('Giỏ hàng của bạn đang trống');
      return;
    }

    // Thay vì gọi trực tiếp router.get, chúng ta sẽ gửi POST request đến endpoint cart.checkout
    if (vendorId) {
      // Nếu có vendorId, sử dụng đường dẫn riêng cho từng vendor
      router.post(route('cart.checkout', { vendor_id: vendorId }), {}, {
        onError: (errors) => {
          // Hiển thị lỗi từ máy chủ (ví dụ: sản phẩm hết hàng)
          if (errors.error) {
            toast.error(errors.error);
          } else {
            toast.error('Có lỗi xảy ra khi tiến hành thanh toán');
          }
        }
      });
    } else {
      // Nếu không có vendorId, gọi route cart.checkout bình thường
      router.post(route('cart.checkout'), {}, {
        onError: (errors) => {
          // Hiển thị lỗi từ máy chủ (ví dụ: sản phẩm hết hàng)
          if (errors.error) {
            toast.error(errors.error);
          } else {
            toast.error('Có lỗi xảy ra khi tiến hành thanh toán');
          }
        }
      });
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title="Giỏ hàng của bạn"></Head>
      <div className="bg-white py-8">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-6">
          <div className="bg-white border border-[#D8C8A4] rounded-md shadow-sm flex-1 order-2 lg:order-1">
            <div className="p-6">
              <h2 className="text-xl font-bold text-[#4E3629] mb-6 pb-2 border-b border-[#D8C8A4]">
                Giỏ hàng của bạn
              </h2>
              <div className="my-4">
                {Object.keys(cartItems).length === 0 &&(
                  <div className="py-8 text-gray-500 text-center">
                    Bạn chưa có sản phẩm nào trong giỏ hàng.
                  </div>
                )}
                {Object.values(cartItems).map(cartItem => (
                  <div key={cartItem.user.id} className="mb-8">
                    <div className="flex items-center justify-between pb-4 border-b border-[#D8C8A4] mb-4">
                      <Link href="/public" className="text-[#9E7A47] hover:underline font-medium">
                        {cartItem.user.name}
                      </Link>
                      <div>
                        <button
                          onClick={() => proceedToCheckout(cartItem.user.id)}
                          className="flex items-center px-4 py-2 bg-white border border-[#9E7A47] text-[#9E7A47] rounded hover:bg-[#D8C8A4]/10 transition-colors"
                        >
                          <CreditCardIcon className="h-5 w-5 mr-2"/>
                          Thanh toán riêng
                        </button>
                      </div>
                    </div>
                    {cartItem.items.map(item => (
                      <CartItem item={item} key={item.id}/>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-white border border-[#D8C8A4] rounded-md shadow-sm p-6 lg:w-80 order-1 lg:order-2">
            <div className="mb-6">
              <div className="text-lg font-medium text-[#4E3629] mb-4">Thông tin đơn hàng</div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[#333333]">Tổng sản phẩm:</span>
                <span className="font-medium">{totalQuantity}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[#333333]">Tạm tính:</span>
                <span className="text-xl font-bold text-[#9E7A47]">
                  <CurrencyFormatter amount={totalPrice}/>
                </span>
              </div>
              <div className="border-t border-[#D8C8A4] pt-4">
                <button
                  onClick={() => proceedToCheckout()}
                  disabled={Object.keys(cartItems).length === 0}
                  className="w-full py-3 bg-[#9E7A47] text-white rounded-md hover:bg-[#4E3629] transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CreditCardIcon className="h-5 w-5 mr-2"/>
                  Tiến hành thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

export default Index;
