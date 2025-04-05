import {GroupedCartItems, PageProps} from "@/types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {Head, Link, router} from "@inertiajs/react";
import CurrencyFormatter from "@/Components/Core/CurrencyFormatter";
import PrimaryButton from "@/Components/Core/PrimaryButton";
import {CreditCardIcon} from "@heroicons/react/24/outline";
import CartItem from "@/Components/App/CartItem";

function Index(
  {
    csrf_token,
    cartItems,
    totalQuantity,
    totalPrice
  }: PageProps<{cartItems: Record<number, GroupedCartItems>}>) {

  // Hàm chuyển hướng trực tiếp sang checkout
  const proceedToCheckout = (vendorId: number | null = null) => {
    // Nếu có vendorId, lưu vào query params
    if (vendorId) {
      router.get(route('checkout.index', { vendor_id: vendorId }));
    } else {
      router.get(route('checkout.index'));
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title="Your Cart"></Head>
      <div className="container mx-auto p-8 flex flex-col lg:flex-row gap-4">
        <div className="card flex-1 bg-white dark:bg-gray-800 order-2 lg:order-1">
          <div className="card-body">
            <h2 className="text-lg font-bold">
              Shopping Cart
            </h2>
            <div className="my-4">
              {Object.keys(cartItems).length === 0 &&(
                <div className="py-2 text-gray-500 text-center">
                  You don't have any items yet.
                </div>
              )}
              {Object.values(cartItems).map(cartItem => (
                <div key={cartItem.user.id}>
                  <div className="flex items-center justify-between pb-4 border-b border-gray-300 mb-4">
                    <Link href="/public" className={"underline"}>
                      {cartItem.user.name}
                    </Link>
                    <div>
                      {/* Thay thế form bằng button */}
                      <button
                        onClick={() => proceedToCheckout(cartItem.user.id)}
                        className="btn btn-sm btn-ghost"
                      >
                        <CreditCardIcon className={"size-6"}/>
                        Pay Only for this seller
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
        <div className="card bg-white dark:bg-gray-800 lg:min-w-[260px] order-1 lg:order-2">
          <div className="card-body">
            Subtotal ({totalQuantity} items): &nbsp;
            <CurrencyFormatter amount={totalPrice}/>

            {/* Thay thế form bằng button */}
            <PrimaryButton
              className="rounded-full"
              onClick={() => proceedToCheckout()}
              disabled={Object.keys(cartItems).length === 0}
            >
              <CreditCardIcon className={"size-6"}/>
              Proceed to Checkout
            </PrimaryButton>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

export default Index;
