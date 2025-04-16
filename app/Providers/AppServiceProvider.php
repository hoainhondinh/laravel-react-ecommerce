<?php

namespace App\Providers;

use App\Http\Resources\BlogCategoryResource;
use App\Http\Resources\DepartmentResource;
use App\Models\BlogTag;
use App\Models\Category;
use App\Models\Department;
use App\Models\Product;
use App\Models\ProductVariation;
use App\Observers\BlogCategoryObserver;
use App\Observers\BlogTagObserver;
use App\Observers\CategoryObserver;
use App\Observers\DepartmentObserver;
use App\Observers\InventoryObserver;
use App\Observers\ProductObserver;
use App\Services\CartService;
use App\Services\StockManagementService;
use App\Services\VietQRService;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use App\Models\BlogCategory;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Đăng ký CartService
        $this->app->singleton(CartService::class, function ($app) {
            return new CartService();
        });

        // Đăng ký VietQRService
        $this->app->singleton(VietQRService::class, function ($app) {
            return new VietQRService();
        });

        // Đăng ký StockManagementService
        $this->app->singleton(StockManagementService::class, function ($app) {
            return new StockManagementService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Đăng ký observer cho quản lý tồn kho
        Product::observe(InventoryObserver::class, ProductObserver::class);
        // Đăng ký observer cho Department
        Department::observe(DepartmentObserver::class);

        Category::observe(CategoryObserver::class);

        // Đăng ký observer cho Blog models
        BlogCategory::observe(BlogCategoryObserver::class);
        BlogTag::observe(BlogTagObserver::class);

        // Đăng ký observer cho model ProductVariation
        ProductVariation::updated(function (ProductVariation $variation) {
            $observer = app(InventoryObserver::class);
            $observer->updatedVariation($variation);
        });

        Inertia::share([
            'blogCategories' => function () {
                return BlogCategoryResource::collection(
                    BlogCategory::select('id', 'name', 'slug')
                        ->withCount('posts')
                        ->orderBy('name')
                        ->get()
                );
            },
            'departments' => function () {
                return DepartmentResource::collection(
                    Department::published()
                        ->withCount('products')
                        ->orderBy('name', 'asc')
                        ->get()
                );
            },
        ]);
    }
}
