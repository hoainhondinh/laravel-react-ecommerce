<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\VietQRService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PaymentController extends Controller
{
    /**
     * Xác nhận thanh toán đã hoàn thành (cho user đã đăng nhập)
     */
    public function confirmPayment(Request $request, Order $order, VietQRService $vietQRService)
    {
        // Kiểm tra quyền sở hữu đơn hàng
        if ($order->user_id !== auth()->id()) {
            abort(403);
        }

        // Kiểm tra trạng thái đơn hàng
        if ($order->payment_status !== 'awaiting') {
            return back()->with('error', 'Đơn hàng này không thể xác nhận thanh toán.');
        }

        // Cập nhật trạng thái đơn hàng
        $order->update([
            'payment_status' => 'pending_confirmation',
            'payment_notes' => 'Khách hàng đã xác nhận đã chuyển khoản. Đang chờ kiểm tra.',
        ]);

        // Lưu lịch sử đơn hàng
        $order->histories()->create([
            'status' => 'payment_confirmation',
            'note' => 'Khách hàng xác nhận đã thanh toán.',
        ]);

        // Gửi thông báo cho admin (sẽ triển khai ở phần sau)

        return back()->with('success', 'Cảm ơn bạn đã xác nhận thanh toán. Chúng tôi sẽ kiểm tra và cập nhật đơn hàng của bạn sớm nhất có thể.');
    }

    /**
     * Tạo lại mã QR thanh toán (cho user đã đăng nhập)
     */
    public function regenerateQR(Order $order, VietQRService $vietQRService)
    {
        // Kiểm tra quyền sở hữu đơn hàng
        if ($order->user_id !== auth()->id()) {
            abort(403);
        }

        // Kiểm tra trạng thái đơn hàng
        if (!in_array($order->payment_status, ['awaiting', 'failed'])) {
            return back()->with('error', 'Không thể tạo lại mã QR cho đơn hàng này.');
        }

        // Tạo mã tham chiếu mới
        $qrCodeUrl = $vietQRService->generateQRUrl($order);

        // Cập nhật đơn hàng
        $order->update([
            'payment_status' => 'awaiting',
            'payment_expires_at' => now()->addDays(1), // Hết hạn sau 1 ngày
        ]);

        // Lưu lịch sử
        $order->histories()->create([
            'status' => 'payment_qr_regenerated',
            'note' => 'Mã QR thanh toán đã được tạo lại.',
        ]);

        return back()->with('success', 'Mã QR thanh toán đã được tạo lại thành công.')
            ->with('qrCodeUrl', $qrCodeUrl);
    }

    /**
     * Xác nhận thanh toán đã hoàn thành (cho khách không đăng nhập)
     */
    public function guestConfirmPayment(Request $request, Order $order, VietQRService $vietQRService)
    {
        // Kiểm tra đã được xác thực bởi middleware guest.order

        // Kiểm tra trạng thái đơn hàng
        if ($order->payment_status !== 'awaiting') {
            return back()->with('error', 'Đơn hàng này không thể xác nhận thanh toán.');
        }

        // Cập nhật trạng thái đơn hàng
        $order->update([
            'payment_status' => 'pending_confirmation',
            'payment_notes' => 'Khách hàng đã xác nhận đã chuyển khoản. Đang chờ kiểm tra.',
        ]);

        // Lưu lịch sử đơn hàng
        $order->histories()->create([
            'status' => 'payment_confirmation',
            'note' => 'Khách hàng xác nhận đã thanh toán.',
        ]);

        // Gửi thông báo cho admin (sẽ triển khai ở phần sau)

        return back()->with('success', 'Cảm ơn bạn đã xác nhận thanh toán. Chúng tôi sẽ kiểm tra và cập nhật đơn hàng của bạn sớm nhất có thể.');
    }

    /**
     * Tạo lại mã QR thanh toán (cho khách không đăng nhập)
     */
    public function guestRegenerateQR(Order $order, VietQRService $vietQRService)
    {
        // Kiểm tra đã được xác thực bởi middleware guest.order

        // Kiểm tra trạng thái đơn hàng
        if (!in_array($order->payment_status, ['awaiting', 'failed'])) {
            return back()->with('error', 'Không thể tạo lại mã QR cho đơn hàng này.');
        }

        // Tạo mã tham chiếu mới
        $qrCodeUrl = $vietQRService->generateQRUrl($order);

        // Cập nhật đơn hàng
        $order->update([
            'payment_status' => 'awaiting',
            'payment_expires_at' => now()->addDays(1), // Hết hạn sau 1 ngày
        ]);

        // Lưu lịch sử
        $order->histories()->create([
            'status' => 'payment_qr_regenerated',
            'note' => 'Mã QR thanh toán đã được tạo lại.',
        ]);

        return back()->with('success', 'Mã QR thanh toán đã được tạo lại thành công.')
            ->with('qrCodeUrl', $qrCodeUrl);
    }
}
