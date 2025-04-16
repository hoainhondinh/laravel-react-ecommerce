<?php

namespace App\Observers;

use App\Models\Product;

class ProductObserver
{
    /**
     * Handle the Product "created" event.
     */
    public function created(Product $product): void
    {
        //
    }

    /**
     * Handle the Product "updated" event.
     */
    public function updated(Product $product): void
    {
        //
    }

    /**
     * Handle the Product "deleted" event.
     */
    public function deleting(Product $product)
    {
        // Kiểm tra xem sản phẩm có biến thể không
        $variationsCount = $product->variations()->count();

        if ($variationsCount > 0) {
            // Ghi log
            Log::warning("Không thể xóa sản phẩm '{$product->title}' (ID: {$product->id}) vì có {$variationsCount} biến thể liên kết.");

            // Hủy thao tác xóa
            return false;
        }

        return true;
    }

    /**
     * Handle the Product "restored" event.
     */
    public function restored(Product $product): void
    {
        //
    }

    /**
     * Handle the Product "force deleted" event.
     */
    public function forceDeleted(Product $product): void
    {
        //
    }
}
