<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentConfirmedNotification extends Notification implements ShouldQueue
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

    public function toMail($notifiable)
    {
        $url = route('orders.show', $this->order->id);

        return (new MailMessage)
            ->subject('Xác nhận thanh toán đơn hàng #' . $this->order->id)
            ->greeting('Xin chào ' . $this->order->name . '!')
            ->line('Chúng tôi đã nhận được thanh toán cho đơn hàng #' . $this->order->id . ' của bạn.')
            ->line('Đơn hàng của bạn đang được xử lý và sẽ được giao sớm nhất có thể.')
            ->action('Xem chi tiết đơn hàng', $url)
            ->line('Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi!');
    }
}
