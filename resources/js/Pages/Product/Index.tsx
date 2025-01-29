import React from 'react';
import { Head } from '@inertiajs/react';
import { PageProps, PaginationProps, Product } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ProductItem from '@/Components/App/ProductItem';

export default function Index({
                                products
                              }: PageProps<{ products: PaginationProps<Product> }>) {
  return (
    <AuthenticatedLayout>
      <Head title="Sản phẩm" />
      <div className="py-12 bg-base-100">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-base-content mb-8 text-center">
            Tất cả sản phẩm
          </h1>

          <div className="grid grid-cols-4 gap-6">
            {products.data.map(product => (
              <div
                key={product.id}
                className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-lg overflow-hidden"
              >
                <div className="card-image rounded-t-lg overflow-hidden">
                  <ProductItem product={product} />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination placeholder - you can add DaisyUI pagination here */}
          {products.total > products.per_page && (
            <div className="flex justify-center mt-8">
              <div className="join">
                {/* Implement pagination controls */}
                <button className="join-item btn">Previous</button>
                <button className="join-item btn">Next</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
