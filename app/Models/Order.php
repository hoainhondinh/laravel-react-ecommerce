<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'total_price',
        'status',
        'payment_status',
        'payment_method',
        'transaction_id',
        'payment_error',
        'name',
        'email',
        'phone',
        'address',
        'cancel_reason',
        'canceled_at',
    ];

    protected $dates = [
        'created_at',
        'updated_at',
        'canceled_at',
    ];
    protected $appends = ['status_text', 'payment_status_text', 'can_be_canceled'];
    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function histories(): HasMany
    {
        return $this->hasMany(OrderHistory::class);
    }

    // Kiểm tra xem đơn hàng có thể hủy không
    public function canBeCanceled(): bool
    {
        // Chỉ cho phép hủy đơn hàng ở trạng thái pending hoặc processing
        return in_array($this->status, ['pending', 'processing'])
            && $this->payment_status !== 'paid';

        // - Không cho phép hủy đơn hàng đã thanh toán
        // - Chỉ cho phép hủy trong vòng 24 giờ sau khi đặt hàng
        // return in_array($this->status, ['pending', 'processing'])
        //     && $this->payment_status !== 'paid'
        //     && $this->created_at->diffInHours(now()) <= 24;
    }

    // Accessor để trả về trạng thái có thể hủy cho giao diện
    public function getCanBeCanceledAttribute(): bool
    {
        return $this->canBeCanceled();
    }

    // Accessor để chuyển đổi trạng thái sang tiếng Việt
    public function getStatusTextAttribute()
    {
        return match($this->status) {
            'pending' => 'Chờ xử lý',
            'processing' => 'Đang xử lý',
            'completed' => 'Hoàn thành',
            'canceled' => 'Đã hủy',
            default => 'Không xác định',
        };
    }

    // Accessor để chuyển đổi trạng thái thanh toán sang tiếng Việt
    public function getPaymentStatusTextAttribute()
    {
        return match ($this->payment_status) {
            'pending' => 'Chờ thanh toán',
            'paid' => 'Đã thanh toán',
            'awaiting' => 'Chờ chuyển khoản',
            'failed' => 'Thất bại',
            default => 'Không xác định',
        };
    }
}
