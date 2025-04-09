// resources/js/Components/App/ProductItem.tsx
import {Product} from "@/types";
import {Link, router} from "@inertiajs/react";
import CurrencyFormatter from "@/Components/Core/CurrencyFormatter";
import SoldProgressBar from '@/Components/App/SoldProgressBar';

export default function ProductItem({product}: {product: Product }) {
  const handleButtonClick = (e) => {
    e.preventDefault();
    router.visit(route('product.show', { product: product.slug }));
  }

  return (
    <div className="bg-white border border-[#E5E5E5] shadow-sm hover:shadow-md transition-all duration-300 rounded-md relative overflow-hidden">
      {/* Discount Badge - top right corner */}
      {product.is_on_sale && (
        <div className="absolute top-0 right-0 bg-[#F8B84E] text-white px-3 py-1 z-10 font-medium">
          -{product.discount_percent}%
        </div>
      )}

      <Link href={route('product.show', { product: product.slug })}>
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full aspect-square object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
      </Link>

      <div className="p-4">
        {/* Product title */}
        <h2 className="font-medium text-[#333333] text-lg mb-3 line-clamp-2 hover:text-[#9E7A47] transition-colors">
          {product.title}
        </h2>

        {/* Author/Category line */}
        <div className="flex items-center mb-3">
          <span className="text-sm text-gray-600 mr-1">by</span>
          <Link href="/" className="text-sm text-[#9E7A47] hover:underline mr-1">{product.user.name}</Link>
          <span className="text-sm text-gray-600 mr-1">in</span>
          <Link href="/" className="text-sm text-[#9E7A47] hover:underline">{product.department.name}</Link>
        </div>

        {/* Sold Progress Bar */}
        {product.sold_count > 0 && (
          <SoldProgressBar
            soldCount={product.sold_count}
            quantity={product.quantity}
            showPercentage={false}
            showMessage={false}
            className="mb-3"
          />
        )}

        {/* Price and Detail Button */}
        <div className="flex flex-col space-y-3">
          {/* Price section - aligned right */}
          <div className="text-right">
            {product.is_on_sale ? (
              <>
                <div className="text-sm text-gray-500 line-through">
                  <CurrencyFormatter amount={product.original_price}/>
                </div>
                <div className="text-xl font-bold text-[#9E7A47]">
                  <CurrencyFormatter amount={product.price}/>
                </div>
                <div className="text-xs text-gray-500">Từ giá</div>
              </>
            ) : (
              <>
                <div className="text-xl font-bold text-[#9E7A47]">
                  <CurrencyFormatter amount={product.price}/>
                </div>
                {product.has_variations && (
                  <div className="text-xs text-gray-500">Từ giá</div>
                )}
              </>
            )}
          </div>

          {/* Detail Button - match the image's button style */}
          <button
            onClick={handleButtonClick}
            className="w-full py-2 bg-[#9E7A47] text-white rounded-md hover:bg-[#4E3629] transition-colors font-medium"
          >
            Chi tiết
          </button>
        </div>
      </div>
    </div>
  )
}
