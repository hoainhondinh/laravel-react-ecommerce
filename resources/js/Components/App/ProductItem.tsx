// resources/js/Components/App/ProductItem.tsx
import {Product} from "@/types";
import {Link, router} from "@inertiajs/react";
import CurrencyFormatter from "@/Components/Core/CurrencyFormatter";
import SoldProgressBar from '@/Components/App/SoldProgressBar';

export default function ProductItem({product}: {product: Product }) {
  const handleButtonClick = (e) => {
    e.preventDefault();
    router.visit(route('product.show', product.slug));
  }

  return (
    <div className="card bg-base-100 shadow-xl relative">
      {/* Badge giảm giá */}
      {product.is_on_sale && (
        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md z-10">
          -{product.discount_percent}%
        </div>
      )}

      <Link href={route('product.show', product.slug)}>
        <figure>
          <img
            src={product.image}
            alt={product.title}
            className="aspect-square object-cover"
          />
        </figure>
      </Link>
      <div className="card-body">
        <h2 className="card-title">{product.title}</h2>
        <p>
          by <Link href="/" className="hover:underline">{product.user.name}</Link>&nbsp;
          in <Link href="/" className="hover:underline">{product.department.name}</Link>
        </p>

        {/* Vị trí thêm SoldProgressBar - sau thông tin sản phẩm và trước giá */}
        {product.sold_count > 0 && (
          <SoldProgressBar
            soldCount={product.sold_count}
            quantity={product.quantity}
            showPercentage={false}
            showMessage={false}
            className="mt-2"
          />
        )}

        <div className="card-actions items-center justify-between mt-3">
          <button onClick={handleButtonClick} className="btn btn-primary">
            Detail
          </button>
          <div className="text-right">
            {product.is_on_sale ? (
              <>
                <div className="text-sm text-gray-500 line-through">
                  <CurrencyFormatter amount={product.original_price}/>
                </div>
                <div className="text-xl text-red-600">
                  <CurrencyFormatter amount={product.price}/>
                </div>
              </>
            ) : (
              <span className="text-2xl">
                <CurrencyFormatter amount={product.price}/>
              </span>
            )}
            {product.has_variations && (
              <div className="text-xs text-gray-500">Từ giá</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
