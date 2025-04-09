<?php

namespace App\Observers;

use App\Models\InventoryAdjustment;
use App\Models\Product;
use App\Models\ProductVariation;
use App\Models\User;
use App\Notifications\LowStockNotification;
use Illuminate\Support\Facades\Log;

class InventoryObserver
{
    /**
     * Ngưỡng tồn kho thấp mặc định
     */
    protected $lowStockThreshold = 5;

    /**
     * Xử lý sự kiện updated trên model Product
     */
    public function updated(Product $product)
    {
        // Kiểm tra nếu quantity đã thay đổi
        if ($product->isDirty('quantity')) {
            $oldValue = $product->getOriginal('quantity');
            $newValue = $product->quantity;

            // Ghi lại điều chỉnh tồn kho nếu cần
            if (!$product->getOriginal('updated_at') || $oldValue !== $newValue) {
                try {
                    // Nếu đây không phải là do đã ghi lại điều chỉnh qua StockManagementService
                    // thì cần ghi lại điều chỉnh tồn kho
                    if (!session()->has('stock_adjustment_recorded')) {
                        InventoryAdjustment::recordAdjustment(
                            $product->id,
                            null,
                            $oldValue,
                            $newValue,
                            'system',
                            'Điều chỉnh tồn kho tự động'
                        );
                    }

                    // Kiểm tra nếu tồn kho thấp
                    $this->checkLowStock($product, $newValue);

                } catch (\Exception $e) {
                    Log::error('Lỗi khi xử lý sự kiện updated trên Product: ' . $e->getMessage());
                }
            }
        }
    }

    /**
     * Xử lý sự kiện updated trên model ProductVariation
     */
    public function updatedVariation(ProductVariation $variation)
    {
        // Kiểm tra nếu quantity đã thay đổi
        if ($variation->isDirty('quantity')) {
            $oldValue = $variation->getOriginal('quantity');
            $newValue = $variation->quantity;

            // Ghi lại điều chỉnh tồn kho nếu cần
            if (!$variation->getOriginal('updated_at') || $oldValue !== $newValue) {
                try {
                    // Nếu đây không phải là do đã ghi lại điều chỉnh qua StockManagementService
                    // thì cần ghi lại điều chỉnh tồn kho
                    if (!session()->has('stock_adjustment_recorded')) {
                        InventoryAdjustment::recordAdjustment(
                            $variation->product_id,
                            $variation->id,
                            $oldValue,
                            $newValue,
                            'system',
                            'Điều chỉnh tồn kho tự động (biến thể)'
                        );
                    }

                    // Kiểm tra nếu tồn kho thấp
                    $product = $variation->product;
                    if ($product) {
                        $this->checkLowStock($product, $newValue, $variation);
                    }

                } catch (\Exception $e) {
                    Log::error('Lỗi khi xử lý sự kiện updated trên ProductVariation: ' . $e->getMessage());
                }
            }
        }
    }

    /**
     * Kiểm tra và thông báo tồn kho thấp
     */
    protected function checkLowStock(Product $product, int $quantity, ?ProductVariation $variation = null)
    {
        if ($quantity <= $this->lowStockThreshold && $quantity > 0) {
            // Lấy danh sách người dùng cần nhận thông báo (admin và managers)
            $receivers = User::whereHas('roles', function ($query) {
                $query->whereIn('name', ['admin', 'manager']);
            })->get();

            if ($receivers->isNotEmpty()) {
                foreach ($receivers as $receiver) {
                    $receiver->notify(new LowStockNotification(
                        $product,
                        $quantity,
                        $this->lowStockThreshold,
                        $variation
                    ));
                }
            }
        }
    }
}
