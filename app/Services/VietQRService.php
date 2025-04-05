<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Str;

class VietQRService
{
    private $bankId;
    private $accountNo;
    private $accountName;
    private $template;
    private $hashKey;

    public function __construct()
    {
        $this->bankId = config('services.vietqr.bank_id');
        $this->accountNo = config('services.vietqr.account_no');
        $this->accountName = config('services.vietqr.account_name');
        $this->template = config('services.vietqr.template', 'compact');
        $this->hashKey = config('services.vietqr.hash_key', 'your-secret-key');
    }

    /**
     * Tạo URL QR Code cho đơn hàng với mã xác thực
     */
    public function generateQRUrl(Order $order)
    {
        $amount = (int) $order->total_price;

        // Tạo mã tham chiếu an toàn
        $reference = $this->generateSecureReference($order);

        $description = "Thanh toan don hang #{$order->id} - {$reference}";

        $url = "https://img.vietqr.io/image/{$this->bankId}-{$this->accountNo}-{$this->template}.png";
        $url .= "?amount={$amount}";
        $url .= "&addInfo=" . urlencode($description);
        $url .= "&accountName=" . urlencode($this->accountName);

        return $url;
    }

    /**
     * Tạo mã tham chiếu an toàn cho đơn hàng
     */
    private function generateSecureReference(Order $order)
    {
        // Kết hợp ID đơn hàng, email người dùng và mật khẩu
        $data = $order->id . $order->user_id . $order->email;

        // Băm dữ liệu với mật khẩu để tạo mã tham chiếu
        $hash = hash_hmac('sha256', $data, $this->hashKey);

        // Trả về 8 ký tự đầu tiên của hash
        return strtoupper(substr($hash, 0, 8));
    }

    /**
     * Xác minh mã tham chiếu thanh toán
     */
    public function verifyReference(Order $order, string $reference)
    {
        $expectedReference = $this->generateSecureReference($order);
        return $reference === $expectedReference;
    }
}
