<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventoryAdjustment extends Model
{
    protected $fillable = [
        'product_id',
        'variation_id',
        'user_id',
        'quantity_before',
        'quantity_after',
        'adjustment',
        'type',
        'reason',
        'reference_id',
    ];

    protected $casts = [
        'adjustment' => 'integer',
        'quantity_before' => 'integer',
        'quantity_after' => 'integer',
    ];

    /**
     * Quan hệ với sản phẩm
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Quan hệ với biến thể
     */
    public function variation(): BelongsTo
    {
        return $this->belongsTo(ProductVariation::class);
    }

    /**
     * Quan hệ với người dùng
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Tạo một bản ghi điều chỉnh tồn kho
     */
    public static function recordAdjustment(
        int $productId,
        ?int $variationId,
        int $quantityBefore,
        int $quantityAfter,
        string $type = 'manual',
        ?string $reason = null,
        ?string $referenceId = null
    ): self
    {
        return self::create([
            'product_id' => $productId,
            'variation_id' => $variationId,
            'user_id' => auth()->id(),
            'quantity_before' => $quantityBefore,
            'quantity_after' => $quantityAfter,
            'adjustment' => $quantityAfter - $quantityBefore,
            'type' => $type,
            'reason' => $reason,
            'reference_id' => $referenceId,
        ]);
    }

    /**
     * Tạo bản ghi điều chỉnh tồn kho từ đơn hàng
     */
    public static function recordOrderAdjustment(
        OrderItem $orderItem,
        int $quantityBefore,
        int $quantityAfter,
        string $orderId
    ): self
    {
        return self::create([
            'product_id' => $orderItem->product_id,
            'variation_id' => $orderItem->variation_id,
            'user_id' => auth()->id(),
            'quantity_before' => $quantityBefore,
            'quantity_after' => $quantityAfter,
            'adjustment' => $quantityAfter - $quantityBefore,
            'type' => 'order',
            'reason' => "Giảm tồn kho do đơn hàng #{$orderId}",
            'reference_id' => $orderId,
        ]);
    }

    /**
     * Tạo bản ghi điều chỉnh tồn kho từ hủy đơn hàng
     */
    public static function recordOrderCancelAdjustment(
        OrderItem $orderItem,
        int $quantityBefore,
        int $quantityAfter,
        string $orderId
    ): self
    {
        return self::create([
            'product_id' => $orderItem->product_id,
            'variation_id' => $orderItem->variation_id,
            'user_id' => auth()->id(),
            'quantity_before' => $quantityBefore,
            'quantity_after' => $quantityAfter,
            'adjustment' => $quantityAfter - $quantityBefore,
            'type' => 'order_cancel',
            'reason' => "Hoàn trả tồn kho do hủy đơn hàng #{$orderId}",
            'reference_id' => $orderId,
        ]);
    }

    /**
     * Scope để lấy các điều chỉnh gần đây
     */
    public function scopeRecent($query, $limit = 5)
    {
        return $query->latest()->limit($limit);
    }

    /**
     * Scope để lọc theo loại điều chỉnh
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope để lọc theo sản phẩm chính (không phải biến thể)
     */
    public function scopeMainProduct($query)
    {
        return $query->whereNull('variation_id');
    }

    /**
     * Scope để lọc theo biến thể
     */
    public function scopeOfVariation($query, $variationId)
    {
        return $query->where('variation_id', $variationId);
    }
}
