<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Symfony\Component\HttpFoundation\Request;

class ProductListResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return[
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'price' => $this->price,
            'quantity' => $this->quantity,
            'image' => $this->getFirstMediaUrl('images', 'small'),
            'images' => $this->getMedia('images')->map(function ($image) {
                return[
                    'id' => $image->id,
                    'thumb' => $image->getUrl('thumb'),
                    'small' => $image->getUrl('small'),
                    'large' => $image->getUrl('large'),
                ];
            }),
//            'image' => $this->getFirstMediaUrl('url', 'small'),
//            'image' => $this->media->first()?->getUrl('small') ?? '/images/no-image.jpg',
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
