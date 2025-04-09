<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Notifications\NewOrderNotification;
use App\Services\CartService;
use App\Services\StockManagementService;
use App\Services\VietQRService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function index(CartService $cartService)
    {
        // Kiểm tra giỏ hàng có trống không
        if ($cartService->getTotalQuantity() === 0) {
            return redirect()->route('cart.index')
                ->with('error', 'Giỏ hàng của bạn đang trống');
        }

        // Lấy thông tin giỏ hàng để hiển thị trong trang thanh toán
        $cartItems = $cartService->getCartItemsGrouped();
        $totalPrice = $cartService->getTotalPrice();

        return Inertia::render('Checkout/Index', [
            'cartItems' => $cartItems,
            'totalPrice' => $totalPrice,
        ]);
    }

    public function store(Request $request, CartService $cartService)
    {
        // Kiểm tra lại giỏ hàng trước khi xử lý đơn hàng
        $cartItems = $cartService->getCartItems();

        if (count($cartItems) === 0) {
            return redirect()->route('cart.index')
                ->with('error', 'Giỏ hàng của bạn đang trống');
        }

        // Kiểm tra số lượng tồn kho trước khi tạo đơn hàng
        $stockValid = true;
        $outOfStockItems = [];

        foreach ($cartItems as $item) {
            $product = Product::find($item['product_id']);
            if (!$product) continue;

            if (!$product->hasStock($item['quantity'], $item['option_ids'])) {
                $stockValid = false;
                $outOfStockItems[] = $item['title'];
            }
        }

        if (!$stockValid) {
            return back()->withInput()->with(
                'error',
                'Một số sản phẩm không đủ số lượng: ' . implode(', ', $outOfStockItems)
            );
        }

        // Validate thông tin với quy tắc chi tiết hơn
        $validated = $request->validate([
            'name' => 'required|string|min:2|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|regex:/^([0-9\s\-\+\(\)]*)$/|min:10|max:20',
            'address' => 'required|string|min:10|max:500',
            'payment_method' => 'required|string|in:cod,bank_transfer',
        ], [
            'name.required' => 'Vui lòng nhập họ tên của bạn.',
            'name.min' => 'Họ tên phải có ít nhất :min ký tự.',
            'email.required' => 'Vui lòng nhập địa chỉ email.',
            'email.email' => 'Địa chỉ email không hợp lệ.',
            'phone.required' => 'Vui lòng nhập số điện thoại.',
            'phone.regex' => 'Số điện thoại chỉ được chứa chữ số và các ký tự +()-.',
            'phone.min' => 'Số điện thoại phải có ít nhất :min ký tự.',
            'address.required' => 'Vui lòng nhập địa chỉ giao hàng.',
            'address.min' => 'Địa chỉ giao hàng phải có ít nhất :min ký tự.',
            'payment_method.required' => 'Vui lòng chọn phương thức thanh toán.',
            'payment_method.in' => 'Phương thức thanh toán không hợp lệ.',
        ]);

        try {
            // Bắt đầu transaction
            DB::beginTransaction();

            // Tạo đơn hàng
            $order = Order::create([
                'user_id' => auth()->id(),
                'total_price' => $cartService->getTotalPrice(),
                'status' => 'pending',
                'payment_status' => ($validated['payment_method'] === 'cod') ? 'pending' : 'awaiting',
                'payment_method' => $validated['payment_method'],
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'address' => $validated['address'],
            ]);

            // Thêm các sản phẩm từ giỏ hàng vào đơn hàng và giảm số lượng tồn kho
            foreach ($cartItems as $item) {
                $product = Product::findOrFail($item['product_id']);

                // Lưu thông tin vào bảng order_items
                $order->items()->create([
                    'product_id' => $item['product_id'],
                    'variation_id' => $item['variation_id'] ?? null,
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'options' => json_encode($item['options'] ?? []),
                ]);

                // Giảm số lượng tồn kho
//                $product->decreaseStock($item['quantity'], $item['option_ids']);
                $stockManagementService = app(StockManagementService::class);
                $stockManagementService->decreaseStockForOrder($order);
            }

            // Gửi email xác nhận đơn hàng
            $order->user->notify(new NewOrderNotification($order));

            // Xóa giỏ hàng
            $cartService->clearCart();

            // Commit transaction
            DB::commit();

            // Chuyển đến trang xác nhận đơn hàng
            return redirect()->route('checkout.confirmation', $order->id);

        } catch (\Exception $e) {
            // Rollback transaction
            DB::rollBack();

            // Log lỗi nếu có
            Log::error('Lỗi khi tạo đơn hàng: ' . $e->getMessage() . PHP_EOL . $e->getTraceAsString());

            // Trả về thông báo lỗi
            return back()->withInput()->with('error', 'Có lỗi xảy ra khi xử lý đơn hàng. Vui lòng thử lại sau.');
        }
    }

    public function confirmation(Order $order, VietQRService $vietQRService)
    {
        // Nếu đơn hàng không thuộc về người dùng hiện tại
        if ($order->user_id !== auth()->id()) {
            abort(403);
        }

        // Nếu phương thức thanh toán là chuyển khoản, tạo mã QR
        $qrCodeUrl = null;
        if ($order->payment_method === 'bank_transfer') {
            $qrCodeUrl = $vietQRService->generateQRUrl($order);
        }

        // Load đơn hàng với sản phẩm
        $order->load(['items.product']);

        // Xử lý hình ảnh cho từng sản phẩm
        foreach ($order->items as $item) {
            if ($item->product) {
                // Thêm URL hình ảnh
                $item->product->image = $item->product->getFirstMediaUrl('images', 'small');
            }

            // Chuyển đổi options từ chuỗi JSON sang array nếu cần
            if (is_string($item->options)) {
                $item->options = json_decode($item->options, true);
            }
        }

        return Inertia::render('Checkout/Confirmation', [
            'order' => $order,
            'qrCodeUrl' => $qrCodeUrl,
        ]);
    }

    public function success(Order $order)
    {

        if ($order->user_id !== auth()->id()) {
            abort(403);
        }

        $order->load(['items.product']);

        foreach ($order->items as $item) {
            if ($item->product) {
                $item->product->image = $item->product->getFirstMediaUrl('images', 'small');
            }

            if (is_string($item->options)) {
                $item->options = json_decode($item->options, true);
            }
        }

        return Inertia::render('Checkout/Success', [
            'order' => $order,
        ]);
    }
}
