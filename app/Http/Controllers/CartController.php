<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Services\CartService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class CartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(CartService $cartService)
    {
        return Inertia::render('Cart/Index', [
            'cartItems' => $cartService->getCartItemsGrouped(),
            'totalQuantity' => $cartService->getTotalQuantity(),
            'totalPrice' => $cartService->getTotalPrice(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Product $product, CartService $cartService)
    {
        $request->mergeIfMissing(['quantity' => 1]);

        $data = $request->validate([
            'option_ids' => ['nullable', 'array'],
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        try {
            $cartService->addItemToCart(
                $product,
                $data['quantity'],
                $data['option_ids'] ?: []
            );

            return back()->with('success', 'Sản phẩm đã được thêm vào giỏ hàng thành công.');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors());
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.']);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product, CartService $cartService)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'quantity' => ['required', 'integer', 'min:1'],
            'option_ids' => ['nullable', 'array'],
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator);
        }

        $optionIds = $request->input('option_ids') ?: []; // Get the option IDs
        $quantity = $request->input('quantity'); // Get the new quantity

        try {
            // Kiểm tra tồn kho trước khi cập nhật
            if (!$product->hasStock($quantity, $optionIds)) {
                $availableQuantity = $product->getAvailableQuantity($optionIds);
                return back()->withErrors([
                    'quantity' => "Chỉ còn {$availableQuantity} sản phẩm trong kho"
                ]);
            }

            $cartService->updateItemQuantity($product->id, $quantity, $optionIds);

            return back()->with('success', 'Số lượng sản phẩm đã được cập nhật thành công.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Có lỗi xảy ra khi cập nhật giỏ hàng.']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Product $product, CartService $cartService)
    {
        $optionIds = $request->input('option_ids', []);

        try {
            $cartService->removeItemFromCart($product->id, $optionIds);

            return back()->with('success', 'Sản phẩm đã được xóa khỏi giỏ hàng.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Có lỗi xảy ra khi xóa sản phẩm khỏi giỏ hàng.']);
        }
    }

    public function checkout(Request $request, CartService $cartService)
    {
        // Kiểm tra giỏ hàng có trống không
        if ($cartService->getTotalQuantity() === 0) {
            return redirect()->route('cart.index')
                ->withErrors(['error' => 'Giỏ hàng của bạn đang trống']);
        }

        // Kiểm tra tồn kho
        $stockCheck = $cartService->canCheckout();
        if ($stockCheck !== true) {
            // Tạo thông báo lỗi
            $errorMessages = collect($stockCheck)->map(function($item) {
                return "{$item['title']}: Yêu cầu {$item['requested']}, hiện có {$item['available']}";
            })->join(', ');

            return redirect()->route('cart.index')
                ->withErrors(['error' => 'Một số sản phẩm không đủ số lượng: ' . $errorMessages]);
        }

        // Lưu trạng thái checkout trong session
        session()->put('checkout_pending', true);

        // Nếu user chưa đăng nhập, chuyển đến trang checkout dành cho khách
        if (!auth()->check()) {
            // Chuyển hướng đến guest checkout
            return redirect()->route('checkout.guest');
        }

        // Nếu đã đăng nhập, chuyển đến trang checkout thông thường
        return redirect()->route('checkout.index');
    }
}
