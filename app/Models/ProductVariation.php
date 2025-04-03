<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductVariation extends Model
{
    protected $fillable = [
        'product_id',
        'variation_type_option_ids',
        'price',
        'original_price',
        'quantity',
        'sold_count'
    ];

    protected $casts = [
        'variation_type_option_ids' => 'json'
    ];

    // Accessor để tính % giảm giá
    public function getDiscountPercentAttribute()
    {
        if (!$this->original_price || $this->original_price <= $this->price) {
            return 0;
        }

        return round((($this->original_price - $this->price) / $this->original_price) * 100);
    }

    // Kiểm tra nếu biến thể đang giảm giá
    public function getIsOnSaleAttribute()
    {
        return $this->original_price && $this->original_price > $this->price;
    }

    // Quan hệ với sản phẩm
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
