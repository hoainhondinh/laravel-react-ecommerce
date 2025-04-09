<?php

namespace App\Notifications;

use App\Models\Product;
use App\Models\ProductVariation;
use Filament\Notifications\Actions\Action;
use Filament\Notifications\Notification as FilamentNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LowStockNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $product;
    protected $variation;
    protected $quantity;
    protected $threshold;

    /**
     * Create a new notification instance.
     */
    public function __construct(Product $product, $quantity, $threshold, ?ProductVariation $variation = null)
    {
        $this->product = $product;
        $this->variation = $variation;
        $this->quantity = $quantity;
        $this->threshold = $threshold;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $message = (new MailMessage)
            ->subject('Cảnh báo: Tồn kho thấp')
            ->greeting('Xin chào!')
            ->line('Đây là thông báo về tồn kho thấp cho sản phẩm sau:')
            ->line('Sản phẩm: ' . $this->product->title);

        if ($this->variation) {
            // Xử lý hiển thị biến thể
            $variationInfo = '';
            foreach ($this->product->variationTypes as $type) {
                $optionIds = is_array($this->variation->variation_type_option_ids)
                    ? $this->variation->variation_type_option_ids
                    : json_decode($this->variation->variation_type_option_ids, true);

                foreach ($optionIds as $optionId) {
                    $option = $type->options->firstWhere('id', $optionId);
                    if ($option) {
                        $variationInfo .= "{$type->name}: {$option->name}, ";
                        break;
                    }
                }
            }

            $variationInfo = rtrim($variationInfo, ', ');
            $message->line('Biến thể: ' . $variationInfo);
        }

        return $message
            ->line('Số lượng hiện tại: ' . $this->quantity)
            ->line('Ngưỡng cảnh báo: ' . $this->threshold)
            ->action('Quản lý tồn kho', url(route('filament.admin.resources.products.inventory', $this->product->id)))
            ->line('Vui lòng cập nhật tồn kho để đảm bảo khả năng đáp ứng đơn hàng.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $data = [
            'product_id' => $this->product->id,
            'product_title' => $this->product->title,
            'quantity' => $this->quantity,
            'threshold' => $this->threshold,
            'type' => 'low_stock',
        ];

        if ($this->variation) {
            $data['variation_id'] = $this->variation->id;

            // Xử lý hiển thị biến thể
            $variationInfo = '';
            foreach ($this->product->variationTypes as $type) {
                $optionIds = is_array($this->variation->variation_type_option_ids)
                    ? $this->variation->variation_type_option_ids
                    : json_decode($this->variation->variation_type_option_ids, true);

                foreach ($optionIds as $optionId) {
                    $option = $type->options->firstWhere('id', $optionId);
                    if ($option) {
                        $variationInfo .= "{$type->name}: {$option->name}, ";
                        break;
                    }
                }
            }

            $variationInfo = rtrim($variationInfo, ', ');
            $data['variation_info'] = $variationInfo ?: "Biến thể #{$this->variation->id}";
        }

        return $data;
    }

    /**
     * Tạo thông báo Filament
     */
    public function toFilament($notifiable): FilamentNotification
    {
        $title = 'Tồn kho thấp';

        $message = "Sản phẩm '{$this->product->title}' ";

        if ($this->variation) {
            // Xử lý hiển thị biến thể
            $variationInfo = '';
            foreach ($this->product->variationTypes as $type) {
                $optionIds = is_array($this->variation->variation_type_option_ids)
                    ? $this->variation->variation_type_option_ids
                    : json_decode($this->variation->variation_type_option_ids, true);

                foreach ($optionIds as $optionId) {
                    $option = $type->options->firstWhere('id', $optionId);
                    if ($option) {
                        $variationInfo .= "{$type->name}: {$option->name}, ";
                        break;
                    }
                }
            }

            $variationInfo = rtrim($variationInfo, ', ');
            $message .= "biến thể '{$variationInfo}' ";
        }

        $message .= "chỉ còn {$this->quantity} sản phẩm trong kho.";

        return FilamentNotification::make()
            ->warning()
            ->title($title)
            ->body($message)
            ->actions([
                Action::make('view')
                    ->label('Quản lý tồn kho')
                    ->url(route('filament.admin.resources.products.inventory', $this->product->id))
                    ->button(),
            ]);
    }
}
