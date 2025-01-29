import { PageProps, PaginationProps, Product, BlogPost, Banner } from '@/types';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ProductItem from "@/Components/App/ProductItem";
import BlogItem from "@/Components/App/BlogItem";
import BannerCarousel from "@/Components/App/BannerCarousel";

export default function Home({
                               products,
                               blogPosts,
                               banners = [],
                             }: PageProps<{
  products: PaginationProps<Product>,
  blogPosts: BlogPost[],
  banners?: Banner[]
}>) {
  return (
    <AuthenticatedLayout>
      <Head title="Home"/>

      {/* Banner Carousel */}
      {banners.length > 0 && (
        <div className="w-full">
          <BannerCarousel banners={banners} />
        </div>
      )}

      <div className="hero bg-gray-200 h-[300px]">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Hello there</h1>
            <p className="py-6">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
              quasi. In deleniti eaque aut repudiandae et a id nisi.
            </p>
            <button className="btn btn-primary">Get Started</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 p-8">
        {products.data.map(product => (
          <ProductItem product={product} key={product.id}/>
        ))}
      </div>

      {/* Phần blog */}
      <div className="py-8 px-4 md:px-8 bg-gray-50">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Bài viết mới nhất</h2>
          <Link href="/blog" className="text-primary hover:underline">Xem tất cả</Link>
        </div>

        {blogPosts && blogPosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map(post => (
              <BlogItem post={post} key={post.id}/>
            ))}
          </div>
        ) : (
          <p className="text-center py-8 text-gray-500">Chưa có bài viết nào.</p>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
