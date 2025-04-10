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

//    public function toMail($notifiable)
//    {
//        $url = route('orders.show', $this->order->id);
//
//        return (new MailMessage)
//            ->subject('Đơn hàng #' . $this->order->id . ' đã được đặt thành công')
//            ->greeting('Xin chào ' . $this->order->name . '!')
//            ->line('Cảm ơn bạn đã đặt hàng tại cửa hàng của chúng tôi.')
//            ->line('Đơn hàng của bạn đã được đặt thành công và đang chờ xử lý.')
//            ->line('Thông tin đơn hàng:')
//            ->line('- Mã đơn hàng: #' . $this->order->id)
//            ->line('- Ngày đặt hàng: ' . $this->order->created_at->format('d/m/Y H:i'))
//            ->line('- Tổng giá trị: ' . number_format($this->order->total_price) . ' đ')
//            ->line('- Phương thức thanh toán: ' . ($this->order->payment_method === 'cod' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản ngân hàng'))
//            ->action('Xem chi tiết đơn hàng', $url)
//            ->line('Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi!');
//    }
    public function toMail($notifiable)
    {
        $mailMessage = (new MailMessage)
            ->subject(__('order.subject.new_order', ['id' => $this->order->id]))
            ->greeting(__('order.greeting', ['name' => $this->order->name]))
            ->line(__('order.thank_you'))
            ->line(__('order.order_placed'))
            ->line(__('order.order_info'))
            ->line(__('order.order_id', ['id' => $this->order->id]))
            ->line(__('order.order_date', ['date' => $this->order->created_at->format('d/m/Y H:i')]))
            ->line(__('order.total_price', ['price' => number_format($this->order->total_price)]))
            ->line(__('order.payment_method', ['method' => $this->getPaymentMethodText($this->order->payment_method)]));

        // Thêm chi tiết sản phẩm
        $this->order->load('items.product');
        foreach ($this->order->items as $item) {
            $options = '';
            if (!empty($item->options)) {
                $optionsData = is_string($item->options) ? json_decode($item->options, true) : $item->options;
                if (is_array($optionsData) && !empty($optionsData)) {
                    $optionTexts = [];
                    foreach ($optionsData as $option) {
                        if (isset($option['name'])) {
                            $optionTexts[] = $option['name'];
                        }
                    }
                    if (!empty($optionTexts)) {
                        $options = ' (' . implode(', ', $optionTexts) . ')';
                    }
                }
            }

            $mailMessage->line("- {$item->product->title}{$options}: " .
                number_format($item->price) . " đ x {$item->quantity} = " .
                number_format($item->price * $item->quantity) . " đ");
        }

        $mailMessage->action(__('order.view_order'), $this->getOrderUrl())
            ->line(__('order.thank_you_shopping'));

        return (new MailMessage)
            ->subject('Đơn hàng #' . $this->order->id . ' đã được đặt thành công')
            ->markdown('emails.orders.new-order', ['order' => $this->order]);
    }
}
