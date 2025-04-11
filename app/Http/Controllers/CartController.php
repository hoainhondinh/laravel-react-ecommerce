<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Services\CartService;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Request;

class CartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(CartService $cartService)
    {
        return Inertia::render('Cart/Index', [
            'cartItems' => $cartService->getCartItemsGrouped(),
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

        $cartService->addItemToCart(
            $product,
            $data['quantity'],
            $data['option_ids'] ?: []
        );

        return back()->with('success', 'Product added to cart successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product, CartService $cartService)
    {
        $request->validate([
            'quantity' => ['integer','min:1'],
        ]);
        $optionIds = $request->input('option_ids') ?: []; //Get the option IDs
        $quantity = $request->input('quantity'); // Get the new quantity

        $cartService->updateItemQuantity($product->id, $quantity, $optionIds);

        return back()->with('success', 'Product quantity updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Product $product, CartService $cartService)
    {
        $optionIds = $request->input('option_ids');

        $cartService->removeItemFromCart($product->id, $optionIds);

        return back()->with('success', 'Product removed from cart successfully.');
    }

    public function checkout(CartService $cartService)
    {
        // Kiểm tra giỏ hàng có trống không
        if ($cartService->getTotalQuantity() === 0) {
            return redirect()->route('cart.index')
                ->with('error', 'Giỏ hàng của bạn đang trống');
        }

        // Kiểm tra tồn kho
        $stockCheck = $cartService->canCheckout();
        if ($stockCheck !== true) {
            // Tạo thông báo lỗi
            $errorMessages = collect($stockCheck)->map(function($item) {
                return "{$item['title']}: Yêu cầu {$item['requested']}, hiện có {$item['available']}";
            })->join(', ');

            return redirect()->route('cart.index')
                ->with('error', 'Một số sản phẩm không đủ số lượng: ' . $errorMessages);
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
