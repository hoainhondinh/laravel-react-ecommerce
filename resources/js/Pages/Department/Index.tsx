import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps, Product, Department, ResourceResponse } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ProductItem from '@/Components/App/ProductItem';

interface DepartmentIndexProps {
  products: ResourceResponse<Product>;
  currentDepartment?: Department;
}

export default function Index({
                                products,
                                currentDepartment
                              }: DepartmentIndexProps) {
  // Get departments from shared props
  const { departments } = usePage<PageProps>().props;
  const departmentsList = departments.data || [];
  const productsList = products?.data || [];

  return (
    <AuthenticatedLayout>
      <Head title={currentDepartment ? currentDepartment.name : 'Danh mục sản phẩm'} />
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          {/* Department Title */}
          <h1 className="text-3xl font-bold text-[#4E3629] mb-8 text-center relative inline-block pb-2 mx-auto w-full">
            {currentDepartment ? currentDepartment.name : 'Danh mục sản phẩm'}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-[#D9C97E]"></div>
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar with department filters */}
            <div className="lg:col-span-1">
              <div className="bg-white p-4 border border-[#D8C8A4] rounded-md mb-6">
                <h3 className="text-lg font-medium text-[#4E3629] mb-4 pb-2 border-b border-[#D8C8A4]">
                  Danh mục sản phẩm
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href={route('products.index')}
                      className="block py-2 text-[#333333] hover:text-[#9E7A47] transition-colors"
                    >
                      Tất cả sản phẩm
                    </Link>
                  </li>
                  {departmentsList.map((department: Department) => (
                    <li key={department.id}>
                      <Link
                        href={route('department.show', { department: department.slug })}
                        className={`block py-2 text-[#333333] hover:text-[#9E7A47] transition-colors ${
                          currentDepartment?.id === department.id ? 'text-[#9E7A47] font-medium' : ''
                        }`}
                      >
                        {department.name}
                        <span className="text-gray-500 text-sm ml-1">
                          ({department.products_count || 0})
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Product grid */}
            <div className="lg:col-span-3">
              {products.data.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.data.map(product => (
                      <div
                        key={product.id}
                        className="bg-white border border-[#D8C8A4] shadow-sm hover:shadow-md transition-shadow duration-300 rounded-md overflow-hidden"
                      >
                        <div className="rounded-t-md overflow-hidden">
                          <ProductItem product={product} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {products.total > products.per_page && (
                    <div className="flex justify-center mt-8">
                      <div className="join">
                        <Link
                          href={products.prev_page_url || '#'}
                          className={`join-item px-4 py-2 border border-[#D8C8A4] bg-white text-[#4E3629] hover:bg-[#D8C8A4]/10 ${
                            !products.prev_page_url ? 'opacity-50 pointer-events-none' : ''
                          }`}
                          preserveScroll
                        >
                          Previous
                        </Link>
                        <Link
                          href={products.next_page_url || '#'}
                          className={`join-item px-4 py-2 border border-[#D8C8A4] bg-[#9E7A47] text-white hover:bg-[#4E3629] ${
                            !products.next_page_url ? 'opacity-50 pointer-events-none' : ''
                          }`}
                          preserveScroll
                        >
                          Next
                        </Link>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-[#4E3629] mb-4">Không tìm thấy sản phẩm nào</div>
                  <Link
                    href={route('products.index')}
                    className="px-4 py-2 bg-[#9E7A47] text-white rounded-md hover:bg-[#4E3629] transition-colors"
                  >
                    Xem tất cả sản phẩm
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
