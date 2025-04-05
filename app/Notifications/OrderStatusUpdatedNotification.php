<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderStatusUpdatedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $order;
    protected $previousStatus;

    public function __construct(Order $order, string $previousStatus)
    {
        $this->order = $order;
        $this->previousStatus = $previousStatus;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $url = route('orders.show', $this->order->id);

        $statusText = match($this->order->status) {
            'pending' => 'chờ xử lý',
            'processing' => 'đang xử lý',
            'completed' => 'đã hoàn thành',
            'canceled' => 'đã hủy',
            default => $this->order->status,
        };

        return (new MailMessage)
            ->subject('Cập nhật trạng thái đơn hàng #' . $this->order->id)
            ->greeting('Xin chào ' . $this->order->name . '!')
            ->line('Đơn hàng #' . $this->order->id . ' của bạn đã được cập nhật trạng thái.')
            ->line('Trạng thái mới: ' . $statusText)
            ->action('Xem chi tiết đơn hàng', $url)
            ->line('Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi!');
    }
}
