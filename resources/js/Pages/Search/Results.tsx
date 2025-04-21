import React from 'react';
import { PageProps, Product } from '@/types';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ProductsGrid from '@/Components/App/ProductsGrid';

interface SearchResultsProps extends PageProps {
  products: {
    data: Product[]
    links: any
    meta: any
  };
  searchQuery: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ products, searchQuery }) => {
  return (
    <AuthenticatedLayout>
      <Head title={`Kết quả tìm kiếm: ${searchQuery} - Yến Sào`} />

      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-[#4E3629] mb-8">
            Kết quả tìm kiếm cho: <span className="text-[#9E7A47]">"{searchQuery}"</span>
          </h1>

          <div className="mb-8">
            <p className="text-gray-600">
              Tìm thấy {products.meta.total} sản phẩm
            </p>
          </div>

          {/* Products Grid */}
          <ProductsGrid
            products={products.data}
            pagination={products.meta}
            emptyMessage="Không tìm thấy sản phẩm nào phù hợp với tìm kiếm của bạn."
          />
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default SearchResults;
