<?php

namespace App\Http\Middleware;

use App\Models\Order;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class GuestOrderAccess
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Kiểm tra nếu URL có chữ ký
        if ($request->hasValidSignature()) {
            // Nếu URL có chữ ký hợp lệ, cho phép truy cập
            return $next($request);
        }

        // Lấy đơn hàng từ route
        $order = $request->route('order');

        // Nếu không phải là đối tượng Order, lấy từ ID
        if (!($order instanceof Order)) {
            $order = Order::findOrFail($order);
        }

        // Lấy token từ session
        $orderToken = session('guest_order_' . $order->id);

        // Nếu không có token hoặc đơn hàng không phải của khách không đăng nhập
        if ($order->is_guest !== true || $order->token !== $orderToken) {
            abort(403, 'Bạn không có quyền truy cập đơn hàng này.');
        }

        return $next($request);
    }
}
