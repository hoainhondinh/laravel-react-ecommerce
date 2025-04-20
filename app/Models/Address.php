<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Address extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'phone',
        'address',
        'is_default',
        'province',
        'district',
        'ward',
    ];

    protected $casts = [
        'is_default' => 'boolean',
    ];

    /**
     * Relation with user
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the full address as a string.
     */
    public function getFullAddressAttribute(): string
    {
        $parts = [];

        if ($this->address) {
            $parts[] = $this->address;
        }

        if ($this->ward) {
            $parts[] = $this->ward;
        }

        if ($this->district) {
            $parts[] = $this->district;
        }

        if ($this->province) {
            $parts[] = $this->province;
        }

        return implode(', ', $parts);
    }
}
