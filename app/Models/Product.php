<?php

namespace App\Models;

use App\Enums\ProductStatusEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Product extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'department_id',
        'category_id',
        'price',
        'original_price',
        'quantity',
        'sold_count',
        'status',
        'created_by',
        'updated_by'
    ];

    // Media conversions...
    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(100);

        $this->addMediaConversion('small')
            ->width(480);

        $this->addMediaConversion('large')
            ->width(1200);
    }

    public function getImageAttribute()
    {
        return $this->getFirstMediaUrl('images', 'small');
    }

    // Scopes...
    public function scopeForVendor(Builder $query): Builder
    {
        return $query->where('created_by', auth()->id());
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', ProductStatusEnum::Published);
    }

    public function scopeForWebsite(Builder $query): Builder
    {
        return $query->published();
    }

    // Scope cho sản phẩm có tồn kho thấp
    public function scopeLowStock(Builder $query, $threshold = 5): Builder
    {
        return $query->where('quantity', '<=', $threshold)
            ->where('quantity', '>', 0);
    }

    // Scope cho sản phẩm hết hàng
    public function scopeOutOfStock(Builder $query): Builder
    {
        return $query->where('quantity', 0);
    }

    // Relationships...
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function variationTypes(): HasMany
    {
        return $this->hasMany(VariationType::class);
    }

    public function variations(): HasMany
    {
        return $this->hasMany(ProductVariation::class, 'product_id');
    }

    // Quan hệ với InventoryAdjustment
    public function inventoryAdjustments(): HasMany
    {
        return $this->hasMany(InventoryAdjustment::class);
    }

    // Accessor để tính % giảm giá
    public function getDiscountPercentAttribute()
    {
        if (!$this->original_price || $this->original_price <= $this->price) {
            return 0;
        }

        return round((($this->original_price - $this->price) / $this->original_price) * 100);
    }

    // Kiểm tra nếu sản phẩm đang giảm giá
    public function getIsOnSaleAttribute()
    {
        return $this->original_price && $this->original_price > $this->price;
    }

    // Kiểm tra nếu sản phẩm có biến thể
    public function getHasVariationsAttribute()
    {
        return $this->variations->count() > 0;
    }

    // Lấy giá cho các tùy chọn được chọn
    public function getPriceForOptions($optionIds = [])
    {
        if (empty($optionIds)) {
            return $this->price;
        }

        $optionIds = array_values($optionIds);
        sort($optionIds);

        foreach ($this->variations as $variation) {
            $variationOptionIds = $variation->variation_type_option_ids;
            if (!is_array($variationOptionIds)) {
                $variationOptionIds = json_decode($variationOptionIds, true);
            }

            sort($variationOptionIds);

            if ($optionIds == $variationOptionIds) {
                return $variation->price !== null ? $variation->price : $this->price;
            }
        }

        return $this->price;
    }

    // Lấy số lượng tồn kho cho các tùy chọn được chọn
    public function getQuantityForOptions($optionIds = [])
    {
        if (empty($optionIds)) {
            return $this->quantity;
        }

        $optionIds = array_values($optionIds);
        sort($optionIds);

        foreach ($this->variations as $variation) {
            $variationOptionIds = $variation->variation_type_option_ids;
            if (!is_array($variationOptionIds)) {
                $variationOptionIds = json_decode($variationOptionIds, true);
            }

            sort($variationOptionIds);

            if ($optionIds == $variationOptionIds) {
                return $variation->quantity !== null ? $variation->quantity : $this->quantity;
            }
        }

        return $this->quantity;
    }

    // Lấy variation cho các tùy chọn được chọn
    public function getVariationForOptions($optionIds = [])
    {
        if (empty($optionIds)) {
            return null;
        }

        $optionIds = array_values($optionIds);
        sort($optionIds);

        foreach ($this->variations as $variation) {
            $variationOptionIds = $variation->variation_type_option_ids;
            if (!is_array($variationOptionIds)) {
                $variationOptionIds = json_decode($variationOptionIds, true);
            }

            sort($variationOptionIds);

            if ($optionIds == $variationOptionIds) {
                return $variation;
            }
        }

        return null;
    }

    // Kiểm tra nếu có đủ số lượng tồn kho
    public function hasStock($quantity = 1, $optionIds = [])
    {
        $stockQuantity = $this->getQuantityForOptions($optionIds);
        return $stockQuantity >= $quantity;
    }

    // Giảm số lượng tồn kho cho một sản phẩm hoặc biến thể
    public function decreaseStock($quantity = 1, $optionIds = [])
    {
        if (empty($optionIds) || !$this->hasVariations) {
            // Ghi lại số lượng trước khi thay đổi
            $quantityBefore = $this->quantity;

            // Giảm số lượng cho sản phẩm chính
            $this->decrement('quantity', $quantity);
            $this->increment('sold_count', $quantity);

            // Ghi lại lịch sử điều chỉnh
            InventoryAdjustment::recordAdjustment(
                $this->id,
                null,
                $quantityBefore,
                $this->quantity,
                'system',
                'Giảm tồn kho tự động'
            );

            return true;
        }

        // Giảm số lượng cho biến thể
        $variation = $this->getVariationForOptions($optionIds);
        if ($variation) {
            // Ghi lại số lượng trước khi thay đổi
            $quantityBefore = $variation->quantity;

            $variation->decrement('quantity', $quantity);
            $variation->increment('sold_count', $quantity);

            // Ghi lại lịch sử điều chỉnh
            InventoryAdjustment::recordAdjustment(
                $this->id,
                $variation->id,
                $quantityBefore,
                $variation->quantity,
                'system',
                'Giảm tồn kho tự động (biến thể)'
            );

            // Cập nhật lại giá và sold_count của sản phẩm chính
            $this->updatePriceFromVariations();
            $this->updateQuantityFromVariations();

            return true;
        }

        return false;
    }

    // Tăng số lượng tồn kho cho một sản phẩm hoặc biến thể
    public function increaseStock($quantity = 1, $optionIds = [])
    {
        if (empty($optionIds) || !$this->hasVariations) {
            // Ghi lại số lượng trước khi thay đổi
            $quantityBefore = $this->quantity;

            // Tăng số lượng cho sản phẩm chính
            $this->increment('quantity', $quantity);
            $this->decrement('sold_count', min($quantity, $this->sold_count));

            // Ghi lại lịch sử điều chỉnh
            InventoryAdjustment::recordAdjustment(
                $this->id,
                null,
                $quantityBefore,
                $this->quantity,
                'system',
                'Tăng tồn kho tự động'
            );

            return true;
        }

        // Tăng số lượng cho biến thể
        $variation = $this->getVariationForOptions($optionIds);
        if ($variation) {
            // Ghi lại số lượng trước khi thay đổi
            $quantityBefore = $variation->quantity;

            $variation->increment('quantity', $quantity);
            $variation->decrement('sold_count', min($quantity, $variation->sold_count));

            // Ghi lại lịch sử điều chỉnh
            InventoryAdjustment::recordAdjustment(
                $this->id,
                $variation->id,
                $quantityBefore,
                $variation->quantity,
                'system',
                'Tăng tồn kho tự động (biến thể)'
            );

            // Cập nhật lại giá và số lượng của sản phẩm chính
            $this->updatePriceFromVariations();
            $this->updateQuantityFromVariations();

            return true;
        }

        return false;
    }

    // Phương thức để cập nhật giá sản phẩm từ các biến thể
    public function updatePriceFromVariations()
    {
        if ($this->variations->count() == 0) {
            return;
        }

        $minPrice = $this->variations->min('price');
        $minOriginalPrice = $this->variations->min('original_price');

        if ($minPrice) {
            $this->price = $minPrice;
        }

        if ($minOriginalPrice) {
            $this->original_price = $minOriginalPrice;
        }

        $this->save();
    }

    // Phương thức để cập nhật số lượng sản phẩm từ các biến thể
    public function updateQuantityFromVariations()
    {
        if ($this->variations->count() == 0) {
            return;
        }

        $totalQuantity = $this->variations->sum('quantity');
        $totalSold = $this->variations->sum('sold_count');

        $this->quantity = $totalQuantity;
        $this->sold_count = $totalSold;
        $this->save();
    }

    // Phương thức điều chỉnh tồn kho sử dụng bởi StockManagementService
    public function adjustStock(int $adjustment, string $reason, ?int $variationId = null): bool
    {
        try {
            if ($variationId) {
                // Điều chỉnh tồn kho biến thể
                $variation = $this->variations()->find($variationId);
                if (!$variation) {
                    return false;
                }

                $quantityBefore = $variation->quantity;
                $quantityAfter = max(0, $quantityBefore + $adjustment);

                $variation->quantity = $quantityAfter;
                if ($adjustment < 0) {
                    // Nếu giảm tồn kho, tăng sold_count
                    $variation->sold_count = ($variation->sold_count ?? 0) + abs($adjustment);
                } else if ($adjustment > 0 && $variation->sold_count > 0) {
                    // Nếu tăng tồn kho và có sold_count, giảm sold_count
                    $variation->sold_count = max(0, ($variation->sold_count ?? 0) - $adjustment);
                }

                $variation->save();

                // Ghi lại lịch sử điều chỉnh
                InventoryAdjustment::recordAdjustment(
                    $this->id,
                    $variation->id,
                    $quantityBefore,
                    $quantityAfter,
                    'manual',
                    $reason
                );

                // Cập nhật lại số lượng sản phẩm chính
                $this->updateQuantityFromVariations();
            } else {
                // Điều chỉnh tồn kho sản phẩm chính
                $quantityBefore = $this->quantity;
                $quantityAfter = max(0, $quantityBefore + $adjustment);

                $this->quantity = $quantityAfter;
                if ($adjustment < 0) {
                    // Nếu giảm tồn kho, tăng sold_count
                    $this->sold_count = ($this->sold_count ?? 0) + abs($adjustment);
                } else if ($adjustment > 0 && $this->sold_count > 0) {
                    // Nếu tăng tồn kho và có sold_count, giảm sold_count
                    $this->sold_count = max(0, ($this->sold_count ?? 0) - $adjustment);
                }

                $this->save();

                // Ghi lại lịch sử điều chỉnh
                InventoryAdjustment::recordAdjustment(
                    $this->id,
                    null,
                    $quantityBefore,
                    $quantityAfter,
                    'manual',
                    $reason
                );
            }

            return true;
        } catch (\Exception $e) {
            \Log::error('Lỗi khi điều chỉnh tồn kho: ' . $e->getMessage() . PHP_EOL . $e->getTraceAsString());
            return false;
        }
    }

    // Phương thức kiểm tra tồn kho thấp
    public function isLowStock($threshold = 5): bool
    {
        if ($this->hasVariations) {
            // Kiểm tra nếu có ít nhất một biến thể có tồn kho thấp
            return $this->variations()
                ->where('quantity', '<=', $threshold)
                ->where('quantity', '>', 0)
                ->exists();
        } else {
            return $this->quantity <= $threshold && $this->quantity > 0;
        }
    }

    // Phương thức kiểm tra hết hàng
    public function isOutOfStock(): bool
    {
        if ($this->hasVariations) {
            // Hết hàng nếu tất cả biến thể đều hết hàng
            return $this->variations()->where('quantity', '>', 0)->doesntExist();
        } else {
            return $this->quantity <= 0;
        }
    }
}
