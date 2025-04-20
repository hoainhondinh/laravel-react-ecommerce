<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Notifications\NewOrderNotification;
use App\Notifications\GuestOrderNotification;
use App\Services\CartService;
use App\Services\StockManagementService;
use App\Services\VietQRService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    // Phương thức cho guest checkout
    public function guestCheckout()
    {
        return Inertia::render('Checkout/Guest');
    }

    public function processGuestCheckout(Request $request, CartService $cartService)
    {
        // Kiểm tra giỏ hàng có trống không
        if ($cartService->getTotalQuantity() === 0) {
            return redirect()->route('cart.index')
                ->with('error', 'Giỏ hàng của bạn đang trống');
        }

        // Validate thông tin khách
        $validated = $request->validate([
            'name' => 'required|string|min:2|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|regex:/^([0-9\s\-\+\(\)]*)$/|min:10|max:20',
        ], [
            'name.required' => 'Vui lòng nhập họ tên của bạn.',
            'name.min' => 'Họ tên phải có ít nhất :min ký tự.',
            'email.required' => 'Vui lòng nhập địa chỉ email.',
            'email.email' => 'Địa chỉ email không hợp lệ.',
            'phone.required' => 'Vui lòng nhập số điện thoại.',
            'phone.regex' => 'Số điện thoại chỉ được chứa chữ số và các ký tự +()-.',
            'phone.min' => 'Số điện thoại phải có ít nhất :min ký tự.',
        ]);

        // Lưu thông tin khách vào session
        session()->put('guest_information', $validated);
        session()->save(); // Đảm bảo session được lưu ngay lập tức

        // Chuyển tiếp đến trang checkout
        return redirect()->route('checkout.index');
    }

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

        // Kiểm tra nếu là guest checkout
        $isGuest = !auth()->check();
        $guestInfo = session('guest_information', []);

        $userAddresses = [];

        // Nếu người dùng đã đăng nhập, lấy danh sách địa chỉ của họ
        if (!$isGuest) {
            $userAddresses = auth()->user()->addresses()
                ->orderBy('is_default', 'desc')
                ->get()
                ->map(function ($address) {
                    // Thêm accessor full_address để hiển thị trên frontend
                    $address->full_address = $address->getFullAddressAttribute();
                    return $address;
                });
        }

        return Inertia::render('Checkout/Index', [
            'cartItems' => $cartItems,
            'totalPrice' => $totalPrice,
            'isGuest' => $isGuest,
            'guestInfo' => $guestInfo,
            'userAddresses' => $userAddresses,
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
        $stockCheck = $cartService->canCheckout();
        if ($stockCheck !== true) {
            // Tạo thông báo lỗi
            $errorMessages = collect($stockCheck)->map(function ($item) {
                return "{$item['title']}: Yêu cầu {$item['requested']}, hiện có {$item['available']}";
            })->join(', ');

            return back()->withInput()->with(
                'error',
                'Một số sản phẩm không đủ số lượng: ' . $errorMessages
            );
        }

        // Validate thông tin với quy tắc chi tiết hơn
        $validated = $request->validate([
            'name' => 'required|string|min:2|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|regex:/^([0-9\s\-\+\(\)]*)$/|min:10|max:20',
            'address' => 'required|string|min:10|max:500',
            'payment_method' => 'required|string|in:cod,bank_transfer',
        ]);

        try {
            // Bắt đầu transaction
            DB::beginTransaction();

            // Kiểm tra xem khách hàng có đăng nhập không
            $isGuest = !auth()->check();
            $userId = auth()->id();

            // Lưu thông tin người dùng nếu đã đăng nhập
            if (!$isGuest) {
                $user = auth()->user();
                // Nếu địa chỉ hoặc số điện thoại chưa được lưu trong hồ sơ, lưu lại
                $userUpdated = false;

                if (!$user->phone && $validated['phone']) {
                    $user->phone = $validated['phone'];
                    $userUpdated = true;
                }

                if (!$user->address && $validated['address']) {
                    $user->address = $validated['address'];
                    $userUpdated = true;
                }

                if ($userUpdated) {
                    $user->save();
                }
            }

            // Tạo đơn hàng
            $orderData = [
                'user_id' => $userId,
                'total_price' => $cartService->getTotalPrice(),
                'status' => 'pending',
                'payment_status' => ($validated['payment_method'] === 'cod') ? 'pending' : 'awaiting',
                'payment_method' => $validated['payment_method'],
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'address' => $validated['address'],
            ];

            // Nếu là khách không đăng nhập, thêm các trường bổ sung
            if ($isGuest) {
                $orderData['user_id'] = null;
                $orderData['is_guest'] = true;
                $orderData['token'] = Str::random(32);
            }

            $order = Order::create($orderData);

            // Lưu lịch sử đơn hàng
            $order->histories()->create([
                'status' => 'pending',
                'note' => $isGuest ? 'Đơn hàng được tạo bởi khách không đăng nhập' : 'Đơn hàng được tạo'
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
            }

            // Giảm số lượng tồn kho
            $stockManagementService = app(StockManagementService::class);
            $stockManagementService->decreaseStockForOrder($order);

            // Gửi email xác nhận đơn hàng
            if (!$isGuest) {
                // Nếu đã đăng nhập, gửi thông báo qua hệ thống notification
                $order->user->notify(new NewOrderNotification($order));
            } else {
                // Nếu là guest, lưu token vào session để theo dõi đơn hàng
                $sessionKey = 'guest_order_' . $order->id;
                session()->put($sessionKey, $order->token);
                session()->save(); // Đảm bảo session được lưu ngay lập tức

                // Debug log
                Log::info('Guest order token saved', [
                    'order_id' => $order->id,
                    'token' => $order->token,
                    'session_key' => $sessionKey
                ]);

                // Thêm dòng này để khắc phục vấn đề
                session()->put('recent_guest_order_id', $order->id);
                session()->save();

                // Gửi email thông báo cho guest
                Notification::route('mail', $validated['email'])
                    ->notify(new GuestOrderNotification($order));
            }

            // Xóa giỏ hàng
            $cartService->clearCart();

            // Xóa thông tin guest checkout trong session
            session()->forget(['checkout_pending', 'guest_information']);
            session()->save(); // Đảm bảo session được lưu ngay lập tức

            // Commit transaction
            DB::commit();

            // Thêm order_id vào session flash để có thể truy cập ở frontend
            session()->flash('order_id', $order->id);

            // Đảm bảo session được lưu trước khi redirect
            session()->save();

            // Chuyển đến trang xác nhận đơn hàng
            return redirect()->route('checkout.confirmation', $order->id)
                ->with('order_id', $order->id);

        } catch (\Exception $e) {
            // Rollback transaction
            DB::rollBack();

            // Log lỗi nếu có
            Log::error('Lỗi khi tạo đơn hàng: ' . $e->getMessage() . PHP_EOL . $e->getTraceAsString());

            // Trả về thông báo lỗi
            if ($request->ajax()) {
                return response()->json([
                    'success' => false,
                    'error' => 'Có lỗi xảy ra khi xử lý đơn hàng. Vui lòng thử lại sau.'
                ], 422);
            }

            return back()->withInput()->with('error', 'Có lỗi xảy ra khi xử lý đơn hàng. Vui lòng thử lại sau.');
        }
    }

    // Phương thức confirmation() giữ nguyên như đã có
    public function confirmation(Order $order, VietQRService $vietQRService)
    {
        // Kiểm tra quyền truy cập
        if (auth()->check()) {
            // Nếu đã đăng nhập, kiểm tra xem đơn hàng có thuộc về người dùng không
            if ($order->user_id !== auth()->id()) {
                abort(403);
            }
        } else {
            // Nếu là guest, kiểm tra token trong session
            $sessionKey = 'guest_order_' . $order->id;
            $orderToken = session($sessionKey);
            $recentOrderId = session('recent_guest_order_id');

            // Debug log
            Log::info('Checking guest access to order', [
                'order_id' => $order->id,
                'session_has_token' => session()->has($sessionKey),
                'session_token' => $orderToken,
                'order_token' => $order->token,
                'is_guest_order' => $order->is_guest,
                'recent_order_id' => $recentOrderId
            ]);

            // Kiểm tra xem đây có phải đơn hàng mới nhất vừa tạo không
            if ($recentOrderId && $recentOrderId == $order->id) {
                // Cho phép truy cập vì đây là đơn hàng mới tạo
                // Đồng thời cập nhật token đúng để sử dụng về sau
                session()->put($sessionKey, $order->token);
                session()->save();
            }
            // Nếu không phải đơn hàng mới, kiểm tra token thông thường
            else if (!$orderToken || $order->token !== $orderToken) {
                // Không có token hợp lệ, từ chối truy cập
                abort(403, 'Bạn không có quyền truy cập đơn hàng này');
            }
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

        // Kiểm tra xem đây có phải là khách không đăng nhập không
        $isGuest = !auth()->check();

        return Inertia::render('Checkout/Confirmation', [
            'order' => $order,
            'qrCodeUrl' => $qrCodeUrl,
            'isGuest' => $isGuest
        ]);
    }
}
