<?php

namespace App\Services;

use App\Models\InventoryAdjustment;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariation;
use App\Models\User;
use App\Notifications\LowStockNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class StockManagementService
{
    /**
     * Thay đổi tồn kho sản phẩm hoặc biến thể
     *
     * @param Product $product Sản phẩm cần thay đổi
     * @param int $adjustment Giá trị điều chỉnh (+/-)
     * @param string $reason Lý do điều chỉnh
     * @param int|null $variationId ID biến thể (null nếu là sản phẩm chính)
     * @param string $type Loại điều chỉnh (manual, order, order_cancel, system)
     * @return bool
     */
    public function adjustStock(
        Product $product,
        int $adjustment,
        string $reason,
        ?int $variationId = null,
        string $type = 'manual'
    ): bool
    {
        try {
            // Bắt đầu transaction
            DB::beginTransaction();

            if ($variationId) {
                $variation = ProductVariation::find($variationId);
                if (!$variation || $variation->product_id !== $product->id) {
                    throw new \Exception('Không tìm thấy biến thể');
                }

                // Lưu trữ số lượng trước khi điều chỉnh
                $quantityBefore = $variation->quantity;
                $quantityAfter = max(0, $quantityBefore + $adjustment);

                // Cập nhật biến thể
                $variation->quantity = $quantityAfter;

                // Điều chỉnh số lượng đã bán nếu cần
                if ($adjustment < 0) {
                    // Nếu giảm tồn kho (không phải do đơn hàng), tăng sold_count
                    if ($type === 'manual' || $type === 'system') {
                        $variation->sold_count = ($variation->sold_count ?? 0) + abs($adjustment);
                    }
                } else if ($adjustment > 0 && $variation->sold_count > 0) {
                    // Nếu tăng tồn kho và có sold_count, giảm sold_count
                    if ($type === 'manual' || $type === 'system') {
                        $variation->sold_count = max(0, ($variation->sold_count ?? 0) - $adjustment);
                    }
                }

                $variation->save();

                // Ghi lại điều chỉnh
                InventoryAdjustment::recordAdjustment(
                    $product->id,
                    $variation->id,
                    $quantityBefore,
                    $quantityAfter,
                    $type,
                    $reason
                );

                // Cập nhật lại tồn kho sản phẩm chính
                $product->updateQuantityFromVariations();

                // Kiểm tra tồn kho thấp
                if ($quantityAfter <= 5 && $quantityAfter > 0) {
                    $this->checkLowStock($product, $quantityAfter, 5, $variation);
                }
            } else {
                // Lưu trữ số lượng trước khi điều chỉnh
                $quantityBefore = $product->quantity;
                $quantityAfter = max(0, $quantityBefore + $adjustment);

                // Cập nhật sản phẩm chính
                $product->quantity = $quantityAfter;

                // Điều chỉnh số lượng đã bán nếu cần
                if ($adjustment < 0) {
                    // Nếu giảm tồn kho (không phải do đơn hàng), tăng sold_count
                    if ($type === 'manual' || $type === 'system') {
                        $product->sold_count = ($product->sold_count ?? 0) + abs($adjustment);
                    }
                } else if ($adjustment > 0 && $product->sold_count > 0) {
                    // Nếu tăng tồn kho và có sold_count, giảm sold_count
                    if ($type === 'manual' || $type === 'system') {
                        $product->sold_count = max(0, ($product->sold_count ?? 0) - $adjustment);
                    }
                }

                $product->save();

                // Ghi lại điều chỉnh
                InventoryAdjustment::recordAdjustment(
                    $product->id,
                    null,
                    $quantityBefore,
                    $quantityAfter,
                    $type,
                    $reason
                );

                // Kiểm tra tồn kho thấp
                if ($quantityAfter <= 5 && $quantityAfter > 0) {
                    $this->checkLowStock($product, $quantityAfter, 5);
                }
            }

            // Commit transaction
            DB::commit();

            return true;

        } catch (\Exception $e) {
            // Rollback transaction
            DB::rollBack();

            // Log lỗi
            Log::error('Lỗi khi điều chỉnh tồn kho: ' . $e->getMessage() . PHP_EOL . $e->getTraceAsString());

            return false;
        }
    }

    /**
     * Cập nhật số lượng tồn kho khi đơn hàng được tạo
     *
     * @param Order $order
     * @return bool
     */
    public function decreaseStockForOrder(Order $order): bool
    {
        try {
            // Bắt đầu transaction
            DB::beginTransaction();

            foreach ($order->items as $item) {
                $product = Product::find($item->product_id);
                if (!$product) continue;

                // Chuyển đổi options thành option_ids
                $optionIds = [];
                if ($item->options) {
                    $options = is_string($item->options) ? json_decode($item->options, true) : $item->options;
                    foreach ($options as $option) {
                        if (isset($option['id'])) {
                            $optionIds[] = $option['id'];
                        }
                    }
                }

                // Biến thể
                $variation = null;
                if (!empty($optionIds)) {
                    $variation = $product->getVariationForOptions($optionIds);
                }

                if ($variation) {
                    // Ghi lại số lượng trước khi thay đổi
                    $quantityBefore = $variation->quantity;
                    $quantityAfter = max(0, $quantityBefore - $item->quantity);

                    // Cập nhật biến thể
                    $variation->quantity = $quantityAfter;
                    $variation->sold_count = ($variation->sold_count ?? 0) + $item->quantity;
                    $variation->save();

                    // Ghi lại điều chỉnh tồn kho
                    InventoryAdjustment::recordAdjustment(
                        $product->id,
                        $variation->id,
                        $quantityBefore,
                        $quantityAfter,
                        'order',
                        "Giảm tồn kho do đơn hàng #{$order->id}",
                        (string)$order->id
                    );

                    // Kiểm tra tồn kho thấp
                    if ($quantityAfter <= 5 && $quantityAfter > 0) {
                        $this->checkLowStock($product, $quantityAfter, 5, $variation);
                    }
                } else {
                    // Ghi lại số lượng trước khi thay đổi
                    $quantityBefore = $product->quantity;
                    $quantityAfter = max(0, $quantityBefore - $item->quantity);

                    // Cập nhật sản phẩm
                    $product->quantity = $quantityAfter;
                    $product->sold_count = ($product->sold_count ?? 0) + $item->quantity;
                    $product->save();

                    // Ghi lại điều chỉnh tồn kho
                    InventoryAdjustment::recordAdjustment(
                        $product->id,
                        null,
                        $quantityBefore,
                        $quantityAfter,
                        'order',
                        "Giảm tồn kho do đơn hàng #{$order->id}",
                        (string)$order->id
                    );

                    // Kiểm tra tồn kho thấp
                    if ($quantityAfter <= 5 && $quantityAfter > 0) {
                        $this->checkLowStock($product, $quantityAfter, 5);
                    }
                }

                // Đồng bộ lại tồn kho sản phẩm nếu có biến thể
                if ($product->has_variations) {
                    $product->updateQuantityFromVariations();
                }
            }

            // Commit transaction
            DB::commit();

            return true;

        } catch (\Exception $e) {
            // Rollback transaction
            DB::rollBack();

            // Log lỗi
            Log::error('Lỗi khi cập nhật tồn kho đơn hàng: ' . $e->getMessage() . PHP_EOL . $e->getTraceAsString());

            return false;
        }
    }

    /**
     * Hoàn trả số lượng tồn kho khi đơn hàng bị hủy
     *
     * @param Order $order
     * @return bool
     */
    public function increaseStockForCancelledOrder(Order $order): bool
    {
        try {
            // Bắt đầu transaction
            DB::beginTransaction();

            foreach ($order->items as $item) {
                $product = Product::find($item->product_id);
                if (!$product) continue;

                // Chuyển đổi options thành option_ids
                $optionIds = [];
                if ($item->options) {
                    $options = is_string($item->options) ? json_decode($item->options, true) : $item->options;
                    foreach ($options as $option) {
                        if (isset($option['id'])) {
                            $optionIds[] = $option['id'];
                        }
                    }
                }

                // Biến thể
                $variation = null;
                if (!empty($optionIds) && $item->variation_id) {
                    $variation = ProductVariation::find($item->variation_id);
                    if (!$variation) {
                        $variation = $product->getVariationForOptions($optionIds);
                    }
                }

                if ($variation) {
                    // Ghi lại số lượng trước khi thay đổi
                    $quantityBefore = $variation->quantity;
                    $quantityAfter = $quantityBefore + $item->quantity;

                    // Cập nhật biến thể
                    $variation->quantity = $quantityAfter;
                    $variation->sold_count = max(0, ($variation->sold_count ?? 0) - $item->quantity);
                    $variation->save();

                    // Ghi lại điều chỉnh tồn kho
                    InventoryAdjustment::recordAdjustment(
                        $product->id,
                        $variation->id,
                        $quantityBefore,
                        $quantityAfter,
                        'order_cancel',
                        "Hoàn trả tồn kho do hủy đơn hàng #{$order->id}",
                        (string)$order->id
                    );
                } else {
                    // Ghi lại số lượng trước khi thay đổi
                    $quantityBefore = $product->quantity;
                    $quantityAfter = $quantityBefore + $item->quantity;

                    // Cập nhật sản phẩm
                    $product->quantity = $quantityAfter;
                    $product->sold_count = max(0, ($product->sold_count ?? 0) - $item->quantity);
                    $product->save();

                    // Ghi lại điều chỉnh tồn kho
                    InventoryAdjustment::recordAdjustment(
                        $product->id,
                        null,
                        $quantityBefore,
                        $quantityAfter,
                        'order_cancel',
                        "Hoàn trả tồn kho do hủy đơn hàng #{$order->id}",
                        (string)$order->id
                    );
                }

                // Đồng bộ lại tồn kho sản phẩm nếu có biến thể
                if ($product->has_variations) {
                    $product->updateQuantityFromVariations();
                }
            }

            // Commit transaction
            DB::commit();

            return true;

        } catch (\Exception $e) {
            // Rollback transaction
            DB::rollBack();

            // Log lỗi
            Log::error('Lỗi khi hoàn trả tồn kho: ' . $e->getMessage() . PHP_EOL . $e->getTraceAsString());

            return false;
        }
    }

    /**
     * Kiểm tra và gửi thông báo tồn kho thấp
     */
    protected function checkLowStock(Product $product, int $quantity, int $threshold, ?ProductVariation $variation = null): void
    {
        // Lấy danh sách người dùng cần nhận thông báo
        $receivers = User::whereHas('roles', function ($query) {
            $query->whereIn('name', ['admin', 'manager']);
        })->get();

        if ($receivers->isEmpty()) {
            return;
        }

        // Tạo và gửi thông báo
        foreach ($receivers as $receiver) {
            $receiver->notify(new LowStockNotification($product, $quantity, $threshold, $variation));
        }
    }

    /**
     * Kiểm tra tất cả các sản phẩm có tồn kho thấp
     *
     * @param int $threshold Ngưỡng tồn kho thấp
     * @return int Số lượng sản phẩm/biến thể tồn kho thấp
     */
    public function checkAllLowStock(int $threshold = 5): int
    {
        $lowStockCount = 0;

        // Lấy danh sách người dùng cần nhận thông báo
        $receivers = User::whereHas('roles', function ($query) {
            $query->whereIn('name', ['admin', 'manager']);
        })->get();

        if ($receivers->isEmpty()) {
            return 0;
        }

        // Kiểm tra sản phẩm không có biến thể
        $productsWithoutVariations = Product::doesntHave('variations')
            ->where('quantity', '<=', $threshold)
            ->where('quantity', '>', 0)
            ->get();

        foreach ($productsWithoutVariations as $product) {
            // Gửi thông báo cho tất cả receivers
            foreach ($receivers as $receiver) {
                $receiver->notify(new LowStockNotification($product, $product->quantity, $threshold));
            }

            $lowStockCount++;
        }

        // Kiểm tra sản phẩm có biến thể
        $productsWithVariations = Product::has('variations')
            ->with('variations', 'variationTypes')
            ->get();

        foreach ($productsWithVariations as $product) {
            foreach ($product->variations as $variation) {
                if ($variation->quantity <= $threshold && $variation->quantity > 0) {
                    // Gửi thông báo cho tất cả receivers
                    foreach ($receivers as $receiver) {
                        $receiver->notify(new LowStockNotification($product, $variation->quantity, $threshold, $variation));
                    }

                    $lowStockCount++;
                }
            }
        }

        return $lowStockCount;
    }

    /**
     * Lấy danh sách sản phẩm tồn kho thấp
     *
     * @param int $threshold Ngưỡng tồn kho thấp
     * @return array
     */
    public function getLowStockProducts(int $threshold = 5): array
    {
        $result = [
            'products' => [],
            'variations' => []
        ];

        // Lấy sản phẩm không có biến thể có tồn kho thấp
        $productsWithoutVariations = Product::doesntHave('variations')
            ->where('quantity', '<=', $threshold)
            ->where('quantity', '>', 0)
            ->get();

        foreach ($productsWithoutVariations as $product) {
            $result['products'][] = [
                'id' => $product->id,
                'title' => $product->title,
                'quantity' => $product->quantity,
                'threshold' => $threshold,
            ];
        }

        // Lấy biến thể có tồn kho thấp
        $productsWithVariations = Product::has('variations')
            ->with('variations', 'variationTypes.options')
            ->get();

        foreach ($productsWithVariations as $product) {
            foreach ($product->variations as $variation) {
                if ($variation->quantity <= $threshold && $variation->quantity > 0) {
                    // Lấy thông tin biến thể
                    $variationInfo = '';

                    // Xử lý hiển thị biến thể
                    foreach ($product->variationTypes as $type) {
                        $optionIds = is_array($variation->variation_type_option_ids)
                            ? $variation->variation_type_option_ids
                            : json_decode($variation->variation_type_option_ids, true);

                        foreach ($optionIds as $optionId) {
                            $option = $type->options->firstWhere('id', $optionId);
                            if ($option) {
                                $variationInfo .= "{$type->name}: {$option->name}, ";
                                break;
                            }
                        }
                    }

                    $variationInfo = rtrim($variationInfo, ', ');

                    $result['variations'][] = [
                        'product_id' => $product->id,
                        'product_title' => $product->title,
                        'variation_id' => $variation->id,
                        'variation_info' => $variationInfo ?: "Biến thể #{$variation->id}",
                        'quantity' => $variation->quantity,
                        'threshold' => $threshold,
                    ];
                }
            }
        }

        return $result;
    }

    /**
     * Đồng bộ lại số lượng tồn kho từ biến thể
     *
     * @param Product $product
     * @return bool
     */
    public function syncProductStock(Product $product): bool
    {
        try {
            // Bắt đầu transaction
            DB::beginTransaction();

            // Cập nhật lại số lượng và giá từ biến thể
            if ($product->variations->count() > 0) {
                $product->updatePriceFromVariations();
                $product->updateQuantityFromVariations();
            }

            // Commit transaction
            DB::commit();

            return true;

        } catch (\Exception $e) {
            // Rollback transaction
            DB::rollBack();

            // Log lỗi
            Log::error('Lỗi khi đồng bộ tồn kho: ' . $e->getMessage() . PHP_EOL . $e->getTraceAsString());

            return false;
        }
    }

    /**
     * Lấy lịch sử điều chỉnh tồn kho của một sản phẩm
     *
     * @param int $productId
     * @param int|null $variationId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getInventoryHistory(int $productId, ?int $variationId = null)
    {
        $query = InventoryAdjustment::where('product_id', $productId);

        if ($variationId !== null) {
            $query->where('variation_id', $variationId);
        }

        return $query->with('user')->orderBy('created_at', 'desc')->get();
    }
}
