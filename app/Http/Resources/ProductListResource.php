<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Symfony\Component\HttpFoundation\Request;

class ProductListResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $hasVariations = $this->variations->count() > 0;

        return[
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'price' => $this->price,
            'original_price' => $this->original_price,
            'discount_percent' => $this->discount_percent,
            'is_on_sale' => $this->is_on_sale,
            'has_variations' => $hasVariations,
            'price_label' => $hasVariations ? 'Từ ' . number_format($this->price) . 'đ' : number_format($this->price) . 'đ',
            'quantity' => $this->quantity,
            'sold_count' => $this->sold_count,
            'image' => $this->getFirstMediaUrl('images', 'small'),
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
            ]
        ];
    }
}
