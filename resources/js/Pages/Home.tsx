import React from 'react';
import { PageProps, Product, BlogPost, Banner, Department } from '@/types';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import BannerCarousel from "@/Components/App/BannerCarousel";
import ProductsGrid from '@/Components/App/ProductsGrid';

interface HomeProps extends PageProps {
  departments: {
    data: Department[]
  };
  newProducts: {
    data: Product[]
  };
  saleProducts: {
    data: Product[]
  };
  bestSellerProducts: {
    data: Product[]
  };
  departmentProducts?: {
    [key: string]: {
      data: Product[]
    }
  };
  blogPosts: BlogPost[];
  banners?: Banner[];
}

const Home: React.FC<HomeProps> = ({
                                     departments,
                                     newProducts,
                                     saleProducts,
                                     bestSellerProducts,
                                     departmentProducts = {},
                                     blogPosts = [],
                                     banners = [],
                                   }) => {
  // Truy cập data từ object một cách an toàn
  const departmentsList = departments?.data || [];
  const newProductsList = newProducts?.data || [];
  const saleProductsList = saleProducts?.data || [];
  const bestSellerProductsList = bestSellerProducts?.data || [];

  return (
    <AuthenticatedLayout>
      <Head title="Yến Sào - Thương Hiệu Yến Cao Cấp"/>

      {/* Hero Banner Section */}
      <section className="w-full relative">
        {banners && banners.length > 0 ? (
          <BannerCarousel banners={banners}/>
        ) : (
          <div className="w-full h-80 bg-[#4E3629] flex items-center justify-center relative overflow-hidden">
            <div className="absolute w-full h-full bg-gradient-to-r from-[#4E3629] to-[#9E7A47] opacity-80"></div>
            <div className="relative z-10 text-center px-4">
              <h1 className="text-4xl md:text-5xl font-bold text-[#FFBF49] mb-4">Yến Sào</h1>
              <p className="text-xl text-white">Thương Hiệu Yến Cao Cấp</p>
            </div>
            <div className="absolute bottom-0 right-0 w-full h-12 bg-[#4E3629]/20 backdrop-blur-sm"></div>
          </div>
        )}
      </section>

      {/* Departments Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#4E3629] mb-8 text-center relative inline-block pb-2 mx-auto w-full">
            DANH MỤC SẢN PHẨM
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-[#D9C97E]"></div>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {departmentsList.length > 0 ? (
              departmentsList.map(department => (
                <Link
                  key={`dept-${department.id}`}
                  href={route('department.show', { department: department.slug })}
                  className="group"
                >
                  <div className="bg-white border border-[#D8C8A4] rounded-lg p-6 text-center hover:shadow-md transition-all duration-300 h-full flex flex-col items-center justify-center group-hover:border-[#9E7A47]">
                    <div className="w-20 h-20 rounded-full bg-[#F9F7F1] flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#9E7A47]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium text-[#4E3629] mb-2 group-hover:text-[#9E7A47]">
                      {department.name}
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {department.products_count || 0} sản phẩm
                    </p>
                    <span className="px-4 py-2 bg-[#D8C8A4]/30 text-[#4E3629] rounded-md group-hover:bg-[#9E7A47] group-hover:text-white transition-colors">
                      Xem sản phẩm
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                Không có danh mục nào.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* New Products Section */}
      <section className="py-12 bg-[#F9F7F1]">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-[#4E3629] mb-8 text-center relative inline-block pb-2 mx-auto w-full">
              SẢN PHẨM MỚI
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-[#D9C97E]"></div>
            </h2>
          </div>

          <ProductsGrid
            products={newProductsList}
            showViewAllButton={true}
            viewAllUrl={route('products.index')}
            viewAllLabel="Xem tất cả sản phẩm mới"
            emptyMessage="Không có sản phẩm mới."
          />
        </div>
      </section>

      {/* Sale Products Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-[#4E3629] mb-8 text-center relative inline-block pb-2 mx-auto w-full">
              ĐANG GIẢM GIÁ
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-[#D9C97E]"></div>
            </h2>
          </div>

          <ProductsGrid
            products={saleProductsList}
            emptyMessage="Không có sản phẩm đang giảm giá."
          />
        </div>
      </section>

      {/* Best Seller Products Section */}
      <section className="py-12 bg-[#F9F7F1]">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-[#4E3629] mb-8 text-center relative inline-block pb-2 mx-auto w-full">
              BÁN CHẠY NHẤT
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-[#D9C97E]"></div>
            </h2>
          </div>

          <ProductsGrid
            products={bestSellerProductsList}
            emptyMessage="Không có sản phẩm bán chạy."
            columns={3}
          />
        </div>
      </section>

      {/* Products by Department - Hiển thị sản phẩm theo department */}
      {departmentsList.slice(0, 2).map(department => {
        const deptProducts = departmentProducts[department.slug]?.data || [];

        // Chỉ hiển thị nếu có sản phẩm
        if (deptProducts.length === 0) return null;

        return (
          <section key={`dept-section-${department.id}`} className="py-12 bg-white">
            <div className="container mx-auto px-4">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-[#4E3629] mb-8 text-center relative inline-block pb-2 mx-auto w-full">
                  {department.name.toUpperCase()}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-[#D9C97E]"></div>
                </h2>
              </div>

              <ProductsGrid
                products={deptProducts}
                showViewAllButton={true}
                viewAllUrl={route('department.show', { department: department.slug })}
                viewAllLabel={`Xem tất cả ${department.name}`}
                columns={4}
              />
            </div>
          </section>
        );
      })}

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white relative">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 pr-0 md:pr-12 mb-8 md:mb-0">
              <h2 className="text-2xl font-bold mb-6 text-[#4E3629]">TẠI SAO NÊN CHỌN CHÚNG TÔI?</h2>
              <p className="text-[#333333] mb-6">
                YẾN SÀI GÒN - Không tổng hợp nguyên liệu - kinh doanh không ép tổ, không phẩm giả trộn thạch đường,
                không tạo tổ ép bằng máy. Chúng tôi đảm bảo 100%
                sản phẩm là đến từ Cung cấp độc quyền trên vùng núi
                Thạch Yến, trải qua đủ mượt đến những sản phẩm
                giàn sào chất lượng nhất.
              </p>

              <div className="space-y-8">
                <div className="flex">
                  <div className="flex-shrink-0 bg-[#9E7A47] rounded-full p-3 mr-4">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-bold mb-2 text-[#4E3629]">Chứng nhận</h3>
                    <p className="text-[#333333]">Được công nhận chất lượng nguyên niệm mạc lai nhưng sử dụng công nghệ
                      tinh chỉnh sạch đảm bảo chất lượng</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 bg-[#9E7A47] rounded-full p-3 mr-4">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-bold mb-2 text-[#4E3629]">Chất lượng đồng đều</h3>
                    <p className="text-[#333333]">Chất lượng luôn đồng đều, tạo sự tin tưởng lâu dài cho người sử dụng phù hợp với nhiều đối tượng</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 bg-[#9E7A47] rounded-full p-3 mr-4">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-bold mb-2 text-[#4E3629]">Cam kết chất lượng</h3>
                    <p className="text-[#333333]">Sản phẩm tự nhiên 100%, không tẩm ướp, không tạo hình, không phẩm màu, yến tự nhiên với các giá trị bổ dưỡng mang lại cho cơ thể</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-1/2">
              <img
                src="/images/yen-sao-box.png"
                alt="Yến Sào Gift Box"
                className="w-full h-auto rounded-lg shadow-lg border border-[#D8C8A4]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Business Hours Section */}
      <section className="py-12 bg-[#4E3629] text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-2xl font-bold mb-4">THỜI GIAN HOẠT ĐỘNG</h2>
              <p className="mb-6">Để lựa chọn sản phẩm phù hợp với nhu cầu, quý khách có thể đến trực tiếp cửa hàng hoặc liên hệ qua:</p>

              <div className="mb-4">
                <h3 className="font-bold">Thứ 2 - Chủ nhật</h3>
                <p>8:00 AM - 21:30 PM</p>
              </div>

              <button className="bg-white text-[#4E3629] px-6 py-3 rounded-md font-medium hover:bg-[#D8C8A4] transition-colors">
                Xem thêm
              </button>
            </div>

            <div className="md:w-1/2">
              <img
                src="/images/yen-chung.jpg"
                alt="Yến Chưng"
                className="w-full h-auto rounded-lg border border-[#9E7A47]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold inline-block relative pb-2 text-[#4E3629]">
              TIN TỨC NỔI BẬT
              <div className="absolute bottom-0 left-1/2 w-16 h-0.5 bg-[#D9C97E] transform -translate-x-1/2"></div>
            </h2>
          </div>

          {blogPosts && blogPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-md overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-[#D8C8A4]">
                  {post.featured_image && (
                    <Link href={`/blog/${post.slug}`}>
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                      />
                    </Link>
                  )}
                  <div className="p-4">
                    {post.category && (
                      <Link
                        href={`/blog/category/${post.category.slug}`}
                        className="text-[#9E7A47] text-sm font-medium hover:underline"
                      >
                        {post.category.name}
                      </Link>
                    )}
                    <Link href={`/blog/${post.slug}`}>
                      <h3 className="font-bold text-lg my-2 text-[#333333] hover:text-[#9E7A47] transition-colors line-clamp-2">{post.title}</h3>
                    </Link>
                    {post.excerpt && (
                      <p className="text-[#333333] mb-4 line-clamp-3">{post.excerpt}</p>
                    )}
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{post.author?.name || 'Admin'}</span>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-[#9E7A47] font-medium hover:underline"
                      >
                        Đọc thêm →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-gray-500">Chưa có bài viết nào.</p>
          )}
        </div>
      </section>
    </AuthenticatedLayout>
  );
};

export default Home;
