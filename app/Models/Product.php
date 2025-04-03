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
        'created_by'
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

    // Scopes...
    public function scopeForVendor(Builder $query):Builder
    {
        return $query->where('created_by', auth()->user()->id);
    }

    public function scopePublished(Builder $query):Builder
    {
        return $query->where('status', ProductStatusEnum::Published);
    }

    public function scopeForWebsite(Builder $query):Builder
    {
        return $query->published();
    }

    // Relationships...
    public function user():BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function department():BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function category():BelongsTo
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
}
