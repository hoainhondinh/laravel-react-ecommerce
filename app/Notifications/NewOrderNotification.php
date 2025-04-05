<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewOrderNotification extends Notification implements ShouldQueue
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
            ->subject('Đơn hàng #' . $this->order->id . ' đã được đặt thành công')
            ->greeting('Xin chào ' . $this->order->name . '!')
            ->line('Cảm ơn bạn đã đặt hàng tại cửa hàng của chúng tôi.')
            ->line('Đơn hàng của bạn đã được đặt thành công và đang chờ xử lý.')
            ->line('Thông tin đơn hàng:')
            ->line('- Mã đơn hàng: #' . $this->order->id)
            ->line('- Ngày đặt hàng: ' . $this->order->created_at->format('d/m/Y H:i'))
            ->line('- Tổng giá trị: ' . number_format($this->order->total_price) . ' đ')
            ->line('- Phương thức thanh toán: ' . ($this->order->payment_method === 'cod' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản ngân hàng'))
            ->action('Xem chi tiết đơn hàng', $url)
            ->line('Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi!');
    }
}
