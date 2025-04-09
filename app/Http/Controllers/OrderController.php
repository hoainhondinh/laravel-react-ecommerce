<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariation;
use App\Services\StockManagementService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Order/Index', [
            'orders' => $orders
        ]);
    }

    public function show(Order $order)
    {
        // Đảm bảo rằng người dùng chỉ xem được đơn hàng của mình
        if ($order->user_id !== auth()->id()) {
            abort(403);
        }

        // Load đơn hàng với sản phẩm
        $order = $order->load(['items.product', 'histories']);

        // Chuẩn bị dữ liệu order để trả về frontend
        $order->load(['items.product', 'histories']);

        // Xử lý hình ảnh và options cho từng item
        foreach ($order->items as $item) {
            if ($item->product) {
                // Thêm thuộc tính image cho sản phẩm
                $item->product->image = $item->product->getFirstMediaUrl('images', 'small');
            }

            // Chuẩn bị options nếu cần
            if (is_string($item->options)) {
                $item->options = json_decode($item->options, true);
            }
        }

        return Inertia::render('Order/Show', [
            'order' => $order
        ]);
    }

    public function cancel(Request $request, Order $order)
    {
        // Kiểm tra quyền sở hữu đơn hàng
        if ($order->user_id !== auth()->id()) {
            abort(403);
        }

        // Kiểm tra xem đơn hàng có thể hủy không
        if (!in_array($order->status, ['pending', 'processing'])) {
            return back()->with('error', 'Không thể hủy đơn hàng ở trạng thái hiện tại.');
        }

        // Validate lý do hủy (tùy chọn)
        $request->validate([
            'cancel_reason' => 'nullable|string|max:255',
        ]);

        try {
            // Bắt đầu transaction
            DB::beginTransaction();

            // Cập nhật trạng thái đơn hàng
            $order->update([
                'status' => 'canceled',
                'payment_status' => $order->payment_status === 'awaiting' ? 'failed' : $order->payment_status,
                'cancel_reason' => $request->cancel_reason,
                'canceled_at' => now(),
            ]);

            // Cập nhật lại số lượng trong kho
            foreach ($order->items as $item) {
                $product = Product::find($item->product_id);
                if (!$product) continue;

                // Chuyển đổi options thành option_ids nếu cần
                $optionIds = [];
                if ($item->options) {
                    $options = is_string($item->options) ? json_decode($item->options, true) : $item->options;
                    foreach ($options as $option) {
                        if (isset($option['id'])) {
                            $optionIds[] = $option['id'];
                        }
                    }
                }

                // Hoan tra tồn kho
                $stockManagementService = app(StockManagementService::class);
                $stockManagementService->increaseStockForCancelledOrder($order);
            }

            // Lưu lịch sử đơn hàng
            $order->histories()->create([
                'status' => 'canceled',
                'note' => 'Đơn hàng đã bị hủy bởi khách hàng. ' . ($request->cancel_reason ? 'Lý do: ' . $request->cancel_reason : ''),
            ]);

            // Commit transaction
            DB::commit();

            return back()->with('success', 'Đơn hàng đã được hủy thành công.');

        } catch (\Exception $e) {
            // Rollback transaction
            DB::rollBack();

            // Log lỗi
            Log::error('Lỗi khi hủy đơn hàng: ' . $e->getMessage() . PHP_EOL . $e->getTraceAsString());

            return back()->with('error', 'Có lỗi xảy ra khi hủy đơn hàng. Vui lòng thử lại sau.');
        }
    }
}
