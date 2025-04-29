import React from 'react';
import { Link } from '@inertiajs/react';
import { Product } from '@/types';
import ProductItem from '@/Components/App/ProductItem';

interface ProductsGridProps {
  products: Product[];
  emptyMessage?: string;
  showViewAllButton?: boolean;
  viewAllUrl?: string;
  viewAllLabel?: string;
  columns?: number;
  departmentFilter?: string;
}

export default function ProductsGrid({
                                       products = [],
                                       emptyMessage = "Không có sản phẩm nào.",
                                       showViewAllButton = false,
                                       viewAllUrl = "/products",
                                       viewAllLabel = "Xem tất cả sản phẩm",
                                       columns = 4,
                                       departmentFilter
                                     }: ProductsGridProps) {
  // Lọc sản phẩm theo department nếu có
  const filteredProducts = departmentFilter
    ? products.filter(product => product.department.slug === departmentFilter)
    : products;

  // Xác định số cột dựa trên props
  const getColClass = () => {
    switch(columns) {
      case 2: return "grid grid-cols-2 md:grid-cols-2";
      case 3: return "grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3";
      case 5: return "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5";
      case 4:
      default: return "grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4";
    }
  };

  return (
    <>
      <div className={`grid ${getColClass()} gap-6`}>
  {filteredProducts.length > 0 ? (
    filteredProducts.map(product => (
      <div
        key={`product-${product.id}`}
    className="bg-white border border-[#D8C8A4] shadow-sm hover:shadow-md transition-shadow duration-300 rounded-md overflow-hidden"
    >
    <ProductItem product={product} />
  </div>
  ))
  ) : (
    <div className="col-span-full text-center py-8 text-gray-500">
      {emptyMessage}
      </div>
  )}
  </div>

  {showViewAllButton && (
    <div className="text-center mt-8">
    <Link
      href={viewAllUrl}
    className="inline-block px-6 py-3 bg-[#9E7A47] text-white rounded-md hover:bg-[#4E3629] transition-colors"
      >
      {viewAllLabel}
      </Link>
      </div>
  )}
  </>
);
}
