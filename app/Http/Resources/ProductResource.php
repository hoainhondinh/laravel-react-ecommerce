<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Symfony\Component\HttpFoundation\Request;

class ProductResource extends JsonResource
{
    public static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'price' => $this->price,
            'original_price' => $this->original_price, // Thêm original_price
            'is_on_sale' => $this->is_on_sale, // Thêm is_on_sale
            'discount_percent' => $this->discount_percent, // Thêm discount_percent
            'quantity' => $this->quantity,
            'sold_count' => $this->sold_count, // Thêm sold_count nếu chưa có
            'image' => $this->getFirstMediaUrl('images'),
            'images' => $this->getMedia('images')->map(function ($image) {
                return[
                    'id' => $image->id,
                    'thumb' => $image->getUrl('thumb'),
                    'small' => $image->getUrl('small'),
                    'large' => $image->getUrl('large'),
                ];
            }),
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ],
            'department' => [
                'id' => $this->department->id,
                'name' => $this->department->name,
                'slug' => $this->department->slug,
            ],
            'variationTypes' => $this->variationTypes->map(function ($variationType) {
                return[
                    'id' => $variationType->id,
                    'name' => $variationType->name,
                    'type' => $variationType->type,
                    'options' => $variationType->options->map(function ($option) {
                        return[
                            'id' => $option->id,
                            'name' => $option->name,
                            'images' => $option->getMedia('images')->map(function ($image) {
                                return[
                                    'id' => $image->id,
                                    'thumb' => $image->getUrl('thumb'),
                                    'small' => $image->getUrl('small'),
                                    'large' => $image->getUrl('large'),
                                ];
                            })
                        ];
                    })
                ];
            }),
            'variations' => $this->variations->map(function ($variation) {
                return[
                    'id' => $variation->id,
                    'variation_type_option_ids' => $variation->variation_type_option_ids,
                    'quantity' => $variation->quantity,
                    'price' => $variation->price,
                    'original_price' => $variation->original_price, // Thêm original_price cho biến thể
                    'is_on_sale' => $variation->is_on_sale, // Thêm is_on_sale cho biến thể
                    'discount_percent' => $variation->discount_percent, // Thêm discount_percent cho biến thể
                    'sold_count' => $variation->sold_count ?? 0, // Thêm sold_count cho biến thể
                ];
            }),
            'inventoryAdjustments' => $this->whenLoaded('inventoryAdjustments', function() {
                return $this->inventoryAdjustments->map(function($adjustment) {
                    return [
                        'id' => $adjustment->id,
                        'quantity_before' => $adjustment->quantity_before,
                        'quantity_after' => $adjustment->quantity_after,
                        'adjustment' => $adjustment->adjustment,
                        'type' => $adjustment->type,
                        'reason' => $adjustment->reason,
                        'created_at' => $adjustment->created_at,
                        'user' => [
                            'name' => $adjustment->user->name,
                        ],
                    ];
                });
            }),
        ];
    }
}
