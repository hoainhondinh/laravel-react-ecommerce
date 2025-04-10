<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Notifications\NewOrderNotification;
use App\Notifications\OrderStatusUpdatedNotification;
use App\Notifications\PaymentConfirmedNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\View;
use Inertia\Inertia;

class EmailTestController extends Controller
{
    public function index()
    {
        $orders = Order::latest()->take(10)->get();

        return Inertia::render('Admin/EmailTest', [
            'orders' => $orders
        ]);
    }

    /**
     * Preview email in browser
     */
    public function previewEmail(Request $request)
    {
        $request->validate([
            'type' => 'required|in:new_order,status_update,payment_confirmed',
            'order_id' => 'required|exists:orders,id',
            'previous_status' => 'nullable|string'
        ]);

        $order = Order::findOrFail($request->order_id);
        $previousStatus = $request->previous_status ?? 'pending';

        switch ($request->type) {
            case 'new_order':
                $mailMessage = (new NewOrderNotification($order))->toMail($order->user);
                break;
            case 'status_update':
                $mailMessage = (new OrderStatusUpdatedNotification($order, $previousStatus))->toMail($order->user);
                break;
            case 'payment_confirmed':
                $mailMessage = (new PaymentConfirmedNotification($order))->toMail($order->user);
                break;
            default:
                abort(400, 'Invalid notification type');
        }

        // Get the Markdown template content
        $markdown = new \Illuminate\Mail\Markdown(View::getFinder(), config('mail.markdown'));
        $html = $markdown->render($mailMessage->markdown, $mailMessage->data());

        return response($html);
    }

    /**
     * Send a test email
     */
    public function sendTestEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'type' => 'required|in:new_order,status_update,payment_confirmed',
            'order_id' => 'required|exists:orders,id',
            'previous_status' => 'nullable|string'
        ]);

        $order = Order::findOrFail($request->order_id);

        switch ($request->type) {
            case 'new_order':
                Mail::to($request->email)
                    ->send(new \Illuminate\Mail\Mailable($order, function ($message) use ($order) {
                        $message->subject('Test - Đơn hàng #' . $order->id . ' đã được đặt thành công');
                        $message->markdown('vendor.notifications.email', (new NewOrderNotification($order))->toMail($order->user)->data());
                    }));
                break;
            case 'status_update':
                $previousStatus = $request->previous_status ?? 'pending';
                Mail::to($request->email)
                    ->send(new \Illuminate\Mail\Mailable($order, function ($message) use ($order, $previousStatus) {
                        $message->subject('Test - Cập nhật trạng thái đơn hàng #' . $order->id);
                        $message->markdown('vendor.notifications.email', (new OrderStatusUpdatedNotification($order, $previousStatus))->toMail($order->user)->data());
                    }));
                break;
            case 'payment_confirmed':
                Mail::to($request->email)
                    ->send(new \Illuminate\Mail\Mailable($order, function ($message) use ($order) {
                        $message->subject('Test - Xác nhận thanh toán đơn hàng #' . $order->id);
                        $message->markdown('vendor.notifications.email', (new PaymentConfirmedNotification($order))->toMail($order->user)->data());
                    }));
                break;
        }

        return back()->with('success', 'Email gửi thành công!');
    }

    /**
     * React component for email testing
     */
    public function reactComponent()
    {
        $orders = Order::with(['user'])
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'name' => $order->name,
                    'email' => $order->email,
                    'phone' => $order->phone,
                    'address' => $order->address,
                    'created_at' => $order->created_at->format('d/m/Y H:i'),
                    'total_price' => number_format($order->total_price) . ' đ',
                    'status' => $order->status,
                    'payment_status' => $order->payment_status,
                    'payment_method' => $order->payment_method,
                    'user' => $order->user ? [
                        'id' => $order->user->id,
                        'name' => $order->user->name,
                        'email' => $order->user->email
                    ] : null
                ];
            });

        return Inertia::render('Admin/EmailTest', [
            'orders' => $orders
        ]);
    }
}
