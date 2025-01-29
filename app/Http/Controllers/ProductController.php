<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductListResource;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\BlogPost;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function home()
    {
        $products = Product::query()
            ->forWebsite()
            ->paginate(12);
        $blogPosts = BlogPost::with(['category', 'author', 'media'])
            ->whereNotNull('published_at')
            ->orderBy('published_at', 'desc')
            ->limit(3)
            ->get();
        // Thêm URL media vào dữ liệu
        $blogPosts = $blogPosts->map(function ($post) {
            return [
                'id' => $post->id,
                'title' => $post->title,
                'slug' => $post->slug,
                'excerpt' => $post->excerpt,
                'content' => $post->content,
                'featured_image' => $post->featured_image, // Accessor sẽ trả về URL của media
                'category' => $post->category,
                'author' => $post->author,
                'published_at' => $post->published_at,
                'status' => $post->status,
            ];
        });
        return Inertia::render('Home', [
           'products' => ProductListResource::collection($products),
            'blogPosts' => $blogPosts, // Truyền dữ liệu blog vào trang Home
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
