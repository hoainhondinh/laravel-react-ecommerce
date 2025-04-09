<?php

namespace App\Http\Controllers;

use App\Http\Resources\DepartmentResource;
use App\Http\Resources\ProductListResource;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Department;
use App\Models\Product;
use App\Models\BlogPost;
use App\Models\Banner;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function home()
    {
        // Lấy departments
        $departments = Department::published()
            ->withCount('products')
            ->orderBy('name', 'asc')
            ->get();

        // Lấy sản phẩm mới nhất
        $newProducts = Product::query()
            ->latest()
            ->take(4)
            ->get();

        // Lấy sản phẩm đang giảm giá
        $saleProducts = Product::query()
            ->whereNotNull('original_price')
            ->whereRaw('original_price > price')
            ->take(4)
            ->get();

        // Lấy sản phẩm bán chạy
        $bestSellerProducts = Product::query()
            ->orderBy('created_at', 'desc')
            ->take(4)
            ->get();

        // Lấy sản phẩm theo từng department
        $departmentProducts = [];
        foreach ($departments->take(2) as $department) {
            $departmentProducts[$department->slug] = Product::query()
                ->where('department_id', $department->id)
                ->take(4)
                ->get();
        }
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
            'departments' => DepartmentResource::collection($departments),
            'newProducts' => ProductListResource::collection($newProducts),
            'saleProducts' => ProductListResource::collection($saleProducts),
            'bestSellerProducts' => ProductListResource::collection($bestSellerProducts),
            'departmentProducts' => array_map(function($products) {
                return ProductListResource::collection($products);
            }, $departmentProducts),
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
    public function department(Department $department)
    {
        $products = Product::query()
            ->forWebsite()
            ->where('department_id', $department->id)
            ->paginate(12);

        return Inertia::render('Department/Index', [
            'products' => ProductListResource::collection($products),
            'currentDepartment' => new DepartmentResource($department),
        ]);
    }

}
