import React from 'react';
import { PageProps, Product } from '@/types';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ProductsGrid from '@/Components/App/ProductsGrid';

interface SearchResultsProps extends PageProps {
  products: {
    data: Product[]
    links: any
    meta: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
      from?: number;
      to?: number;
      prev_page_url: string | null;
      next_page_url: string | null;
      links?: Array<{
        url: string | null;
        label: string;
        active: boolean;
      }>;
    };
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
            emptyMessage="Không tìm thấy sản phẩm nào phù hợp với tìm kiếm của bạn."
          />

          {/* Pagination */}
          {products.meta.last_page > 1 && (
            <div className="flex justify-center mt-8">
              <div className="join">
                {products.meta.links?.map((link, index) => (
                  link.url ? (
                    <Link
                      key={index}
                      href={link.url}
                      className={`join-item px-4 py-2 border border-[#D8C8A4] ${
                        link.active
                          ? 'bg-[#9E7A47] text-white'
                          : 'bg-white text-[#4E3629] hover:bg-[#D8C8A4]/10'
                      }`}
                      preserveScroll
                    >
                      {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                    </Link>
                  ) : null
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default SearchResults;
