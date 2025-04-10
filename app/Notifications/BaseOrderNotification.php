<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

abstract class BaseOrderNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $order;

    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    abstract public function toMail($notifiable);

    protected function getOrderUrl()
    {
        return route('orders.show', $this->order->id);
    }

    protected function getStatusText($status)
    {
        return match($status) {
            'pending' => 'chờ xử lý',
            'processing' => 'đang xử lý',
            'completed' => 'đã hoàn thành',
            'canceled' => 'đã hủy',
            default => $status,
        };
    }

    protected function getPaymentMethodText($method)
    {
        return match($method) {
            'cod' => 'Thanh toán khi nhận hàng',
            'bank_transfer' => 'Chuyển khoản ngân hàng',
            default => $method,
        };
    }
}
