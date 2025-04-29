<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles, SoftDeletes;
    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($user) {
            // Xóa các bản ghi liên quan
            $user->orders()->delete();
            if ($user->vendor) {
                $user->vendor()->delete();
            }
            // Xóa địa chỉ khi xóa tài khoản
            $user->addresses()->delete();
        });

        static::forceDeleting(function ($user) {
            try {
                // Ngắt kết nối các quan hệ
                $user->roles()->detach();
                $user->permissions()->detach();

                // Cập nhật user_id thành null thay vì xóa
                $user->blogPosts()->update(['user_id' => null]);
                $user->orders()->update(['user_id' => null]);

                // Với vendor, có thể xóa hoặc cập nhật tùy trường hợp
                if ($user->vendor) {
                    $user->vendor()->delete();
                }

                // Force delete địa chỉ
                $user->addresses()->forceDelete();
            } catch (\Exception $e) {
                \Log::error('Lỗi khi xử lý forceDeleting cho user: ' . $e->getMessage());
            }
        });
    }
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'address',
        'phone',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function vendor(): HasOne
    {
        return $this->hasOne(Vendor::class, 'user_id');
    }

    /**
     * Relationship with orders
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function blogPosts(): HasMany
    {
        return $this->hasMany(BlogPost::class, 'user_id');
    }

    /**
     * Relationship with addresses
     */
    public function addresses(): HasMany
    {
        return $this->hasMany(Address::class);
    }

    /**
     * Get default address of user
     */
    public function getDefaultAddressAttribute()
    {
        return $this->addresses()->where('is_default', true)->first();
    }
}
