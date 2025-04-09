<?php

namespace App\Providers;


use App\Http\Resources\BlogCategoryResource;
use App\Http\Resources\DepartmentResource;
use App\Models\Department;
use App\Services\CartService;
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
        $this->app->singleton(CartService::class, function(){
            return new CartService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

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
