<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\URL;

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
        'is_guest', // Thêm trường này
        'token',    // Thêm trường này
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
            'pending_confirmation' => 'Chờ xác nhận thanh toán',
            default => 'Không xác định',
        };
    }

    /**
     * Tạo URL có chữ ký cho khách không đăng nhập
     * Dùng để gửi URL theo dõi đơn hàng qua email
     *
     * @param int $expirationInMinutes Thời gian hết hạn của URL (phút)
     * @return string URL có chữ ký
     */
    public function getSignedGuestUrl(int $expirationInMinutes = 43200): string
    {
        // Mặc định: hết hạn sau 30 ngày (43200 phút)
        if ($this->is_guest !== true) {
            throw new \Exception('Chỉ áp dụng cho đơn hàng của khách không đăng nhập.');
        }

        return URL::temporarySignedRoute(
            'guest.orders.show',
            now()->addMinutes($expirationInMinutes),
            ['order' => $this->id]
        );
    }

    /**
     * Kiểm tra token của đơn hàng guest
     *
     * @param string $token Token cần kiểm tra
     * @return bool Kết quả kiểm tra
     */
    public function validateGuestToken(string $token): bool
    {
        if ($this->is_guest !== true) {
            return false;
        }

        return $this->token === $token;
    }
}
