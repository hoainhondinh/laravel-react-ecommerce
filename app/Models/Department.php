<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Department extends Model
{
    protected $fillable = ['name', 'slug', 'active'];

    protected $casts = [
        'active' => 'boolean',
    ];
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('active', true);
    }
    public function categories(): HasMany
    {
        return $this->hasMany(Category::class);
    }
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}
