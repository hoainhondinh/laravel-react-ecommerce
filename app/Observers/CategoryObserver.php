<?php

namespace App\Observers;

use App\Models\Category;
use App\Models\Product;

class CategoryObserver
{
    /**
     * Handle the Category "created" event.
     */
    public function created(Category $category): void
    {
        //
    }

    /**
     * Handle the Category "updated" event.
     */
    public function updated(Category $category): void
    {
        //
    }

    /**
     * Handle the Category "deleted" event.
     */
    public function deleting(Category $category)
    {
        // Kiểm tra xem danh mục có sản phẩm không
        $productsCount = Product::where('category_id', $category->id)->count();

        if ($productsCount > 0) {
            Log::warning("Không thể xóa danh mục '{$category->name}' (ID: {$category->id}) vì có {$productsCount} sản phẩm liên kết.");
            return false;
        }

        // Kiểm tra xem danh mục có danh mục con không
        $childrenCount = Category::where('parent_id', $category->id)->count();

        if ($childrenCount > 0) {
            Log::warning("Không thể xóa danh mục '{$category->name}' (ID: {$category->id}) vì có {$childrenCount} danh mục con.");
            return false;
        }

        return true;
    }

    /**
     * Handle the Category "restored" event.
     */
    public function restored(Category $category): void
    {
        //
    }

    /**
     * Handle the Category "force deleted" event.
     */
    public function forceDeleted(Category $category): void
    {
        //
    }
}
