<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductListResource;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\BlogPost;
use App\Models\Banner;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function home()
    {
        // Lấy banner active
        $banners = Banner::active()
            ->with('media')  // Eager load media
            ->orderBy('order', 'asc')  // Sắp xếp theo thứ tự tăng dần
            ->get()
            ->map(function ($banner) {
                // Lấy URL hình ảnh
                $desktopUrl = $banner->getFirstMediaUrl('banner', 'desktop');
                $mobileUrl = $banner->getFirstMediaUrl('mobile_banner', 'mobile');

                return [
                    'id' => $banner->id,
                    'title' => $banner->title,
                    'description' => $banner->description,
                    'url' => $banner->url,
                    'image' => [
                        'desktop' => $desktopUrl ?: asset('images/placeholder-banner.jpg'),
                        'mobile' => $mobileUrl ?: asset('images/placeholder-banner-mobile.jpg'),
                    ]
                ];
            });

        // Lấy danh sách sản phẩm
        $products = Product::query()
            ->forWebsite()
            ->paginate(12);

        // Lấy bài viết blog mới nhất
        $blogPosts = BlogPost::with(['category', 'author', 'media'])
            ->whereNotNull('published_at')
            ->orderBy('published_at', 'desc')
            ->limit(3)
            ->get()
            ->map(function ($post) {
                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'slug' => $post->slug,
                    'excerpt' => $post->excerpt,
                    'content' => $post->content,
                    'featured_image' => $post->featured_image,
                    'category' => $post->category,
                    'author' => $post->author,
                    'published_at' => $post->published_at,
                    'status' => $post->status,
                ];
            });

        // Render trang Home với dữ liệu
        return Inertia::render('Home', [
            'products' => ProductListResource::collection($products),
            'blogPosts' => $blogPosts,
            'banners' => $banners,
        ]);
    }

    public function index()
    {
        $products = Product::query()
            ->forWebsite()
            ->paginate(12);

        return Inertia::render('Product/Index', [
            'products' => ProductListResource::collection($products),
        ]);
    }

    public function show(Product $product)
    {
        return Inertia::render('Product/Show', [
            'product' => new ProductResource($product),
            'variationOptions' => request('options', []),
        ]);
    }
}
