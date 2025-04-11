<?php


namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\URL;

class GuestOrderNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected Order $order;

    /**
     * Create a new notification instance.
     */
    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $orderUrl = $this->order->getSignedGuestUrl();
        $items = $this->order->items()->with('product')->get();

        $mailMessage = (new MailMessage)
            ->subject('Xác nhận đơn hàng #' . $this->order->id)
            ->greeting('Xin chào ' . $this->order->name)
            ->line('Đơn hàng của bạn đã được đặt thành công!')
            ->line('Mã đơn hàng: #' . $this->order->id)
            ->line('Ngày đặt hàng: ' . $this->order->created_at->format('d/m/Y H:i'))
            ->line('Trạng thái: ' . $this->getOrderStatusText($this->order->status))
            ->line('Phương thức thanh toán: ' . $this->getPaymentMethodText($this->order->payment_method))
            ->line('Tổng thanh toán: ' . number_format($this->order->total_price, 0, ',', '.') . 'đ');

        // Thêm danh sách sản phẩm
        $mailMessage->line('Sản phẩm:');
        foreach ($items as $item) {
            $mailMessage->line('- ' . $item->product->title . ' (x' . $item->quantity . '): ' .
                number_format($item->price * $item->quantity, 0, ',', '.') . 'đ');
        }

        // Thông tin địa chỉ giao hàng
        $mailMessage
            ->line('Địa chỉ giao hàng:')
            ->line($this->order->name)
            ->line($this->order->phone)
            ->line($this->order->address);

        // Thêm liên kết theo dõi đơn hàng
        $mailMessage
            ->line('Bạn có thể theo dõi đơn hàng của mình bằng cách nhấp vào nút bên dưới.')
            ->action('Theo dõi đơn hàng', $orderUrl)
            ->line('Lưu ý: Liên kết này chỉ dành riêng cho bạn. Vui lòng không chia sẻ với người khác.')
            ->line('Cảm ơn bạn đã mua sắm tại cửa hàng chúng tôi!');

        return $mailMessage;
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'order_id' => $this->order->id,
            'total_price' => $this->order->total_price,
            'status' => $this->order->status,
        ];
    }

    /**
     * Lấy text trạng thái đơn hàng
     */
    protected function getOrderStatusText(string $status): string
    {
        return match ($status) {
            'pending' => 'Chờ xử lý',
            'processing' => 'Đang xử lý',
            'completed' => 'Hoàn thành',
            'canceled' => 'Đã hủy',
            default => $status,
        };
    }

    /**
     * Lấy text phương thức thanh toán
     */
    protected function getPaymentMethodText(string $method): string
    {
        return match ($method) {
            'cod' => 'Thanh toán khi nhận hàng (COD)',
            'bank_transfer' => 'Chuyển khoản ngân hàng',
            default => $method,
        };
    }
}
