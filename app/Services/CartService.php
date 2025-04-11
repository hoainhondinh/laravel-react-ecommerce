<?php

namespace App\Services;

use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductVariation;
use App\Models\VariationType;
use App\Models\VariationTypeOption;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CartService
{
    private ?array $cachedCartItems = null;

    protected const COOKIE_NAME = 'cartItems';
    protected const COOKIE_LIFETIME = 60 * 24 * 365; //1 YEAR

    public function addItemToCart(Product $product, int $quantity = 1, $optionIds = null)
    {
        if ($optionIds === null){
            $optionIds = $product->variationTypes
                ->mapWithKeys(fn(VariationType $type) => [$type->id => $type->options[0]?->id])
                ->toArray();
        }

        // Kiểm tra xem có đủ số lượng tồn kho không
        if (!$product->hasStock($quantity, $optionIds)) {
            throw ValidationException::withMessages([
                'quantity' => 'Số lượng sản phẩm trong kho không đủ'
            ]);
        }

        $price = $product->getPriceForOptions($optionIds);

        if(Auth::check()){
            $this->saveItemToDatabase($product->id, $quantity, $price, $optionIds);
        } else {
            $this->saveItemToCookies($product->id, $quantity, $price, $optionIds);
        }

        // Xóa cache
        $this->cachedCartItems = null;
    }

    public function updateItemQuantity(int $productId, int $quantity, $optionIds = null)
    {
        // Kiểm tra xem có đủ số lượng tồn kho không
        $product = Product::findOrFail($productId);

        if (!$product->hasStock($quantity, $optionIds)) {
            throw ValidationException::withMessages([
                'quantity' => 'Số lượng sản phẩm trong kho không đủ'
            ]);
        }

        if (\Auth::check()){
            $this->updateItemQuantityInDatabase($productId, $quantity, $optionIds);
        } else{
            $this->updateItemQuantityInCookies($productId, $quantity, $optionIds);
        }

        // Xóa cache
        $this->cachedCartItems = null;
    }

    public function removeItemFromCart(int $productId, $optionIds = null)
    {
        if (\Auth::check()) {
            $this->removeItemFromDatabase($productId, $optionIds);
        } else {
            $this->removeItemFromCookies($productId, $optionIds);
        }

        // Xóa cache
        $this->cachedCartItems = null;
    }

    public function clearCart(): void
    {
        if (Auth::check()) {
            // Xóa giỏ hàng từ cơ sở dữ liệu
            CartItem::where('user_id', Auth::id())->delete();
        } else {
            // Xóa giỏ hàng từ cookie
            Cookie::queue(self::COOKIE_NAME, '', -1);
        }

        // Xóa cache
        $this->cachedCartItems = null;
    }

    public function getCartItems(): array
    {
        //We need to put this in try-catch, otherwise if something goes wrong
        //the web will not open at all
        try{
            if ($this->cachedCartItems === null){
                //If the user is authenticated, retrieve from the database
                if (Auth::check()){
                    $cartItems = $this->getCartItemsFromDatabase();
                } else {
                    //if the user is a guest, retrieve from the cookies
                    $cartItems = $this->getCartItemsFromCookies();
                }

                $productIds = collect($cartItems)->map(fn($item) => $item['product_id']);
                $products = Product::whereIn('id', $productIds)
                    ->with('user.vendor', 'variations')
                    ->forWebsite()
                    ->get()
                    ->keyBy('id');

                $cartItemData = [];
                foreach ($cartItems as $key => $cartItem){
                    $product = data_get($products, $cartItem['product_id']);
                    if (!$product) continue;

                    // Kiểm tra biến thể và lấy thông tin
                    $variation = null;
                    $optionInfo = [];
                    $options = VariationTypeOption::with('variationType')
                        ->whereIn('id', $cartItem['option_ids'])
                        ->get()
                        ->keyBy('id');

                    if (count($cartItem['option_ids']) > 0) {
                        $variation = $product->getVariationForOptions($cartItem['option_ids']);
                    }

                    $imageUrl = null;
                    foreach ($cartItem['option_ids'] as $option_id){
                        $option = data_get($options, $option_id);
                        if (!$option) continue;

                        if (!$imageUrl) {
                            $imageUrl = $option->getfirstMediaUrl('images', 'small');
                        }
                        $optionInfo[] = [
                            'id' => $option->id,
                            'name' => $option->name,
                            'type' => [
                                'id' => $option->variationType->id,
                                'name' => $option->variationType->name,
                            ]
                        ];
                    }

                    $availableQuantity = $variation ? $variation->quantity : $product->quantity;

                    $cartItemData[] = [
                        'id' => $cartItem['id'],
                        'product_id' => $product->id,
                        'variation_id' => $variation ? $variation->id : null,
                        'title' => $product->title,
                        'slug' => $product->slug,
                        'price' => $cartItem['price'],
                        'quantity' => $cartItem['quantity'],
                        'available_quantity' => $availableQuantity,
                        'option_ids' => $cartItem['option_ids'],
                        'options' => $optionInfo,
                        'image' => $imageUrl ?: $product->getFirstMediaUrl('images', 'small'),
                        'user' => [
                            'id' => $product->created_by,
                            'name' => $product->user && $product->user->vendor ? $product->user->vendor->store_name : 'Không có cửa hàng',
                        ],
                    ];
                }

                $this->cachedCartItems = $cartItemData;
            }
            return $this->cachedCartItems;
        } catch (\Exception $e){
            Log::error($e->getMessage() . PHP_EOL . $e->getTraceAsString());
        }
        return [];
    }

    public function getTotalQuantity(): int
    {
        $totalQuantity = 0;
        foreach ($this->getCartItems() as $item){
            $totalQuantity += $item['quantity'];
        }
        return $totalQuantity;
    }

    public function getTotalPrice(): float
    {
        $total = 0;

        //Assuming $this->>getCartItems() returns an array of cart items with
        foreach ($this->getCartItems() as $item){
            $total += $item['price'] * $item['quantity'];
        }
        return $total;
    }

    protected function updateItemQuantityInDatabase(int $productId, int $quantity, array $optionIds): void
    {
        $userId = Auth::id();

        $cartItem = CartItem::where('user_id', $userId)
            ->where('product_id', $productId)
            ->where('variation_type_option_ids', json_encode($optionIds))
            ->first();

        if ($cartItem) {
            $cartItem->update([
                'quantity' => $quantity,
            ]);
        }
    }
    /**
     * Kiểm tra số lượng tồn kho cho tất cả các sản phẩm trong giỏ hàng
     *
     * @return array Danh sách các sản phẩm không đủ số lượng
     */
    public function checkCartItemsStock(): array
    {
        $outOfStockItems = [];
        $cartItems = $this->getCartItems();

        foreach ($cartItems as $item) {
            $product = Product::find($item['product_id']);
            if (!$product) continue;

            if (!$product->hasStock($item['quantity'], $item['option_ids'])) {
                $outOfStockItems[] = [
                    'id' => $item['product_id'],
                    'title' => $item['title'],
                    'available' => $product->getAvailableQuantity($item['option_ids']),
                    'requested' => $item['quantity']
                ];
            }
        }

        return $outOfStockItems;
    }

    /**
     * Kiểm tra xem có thể checkout không
     *
     * @return bool|array true nếu có thể checkout, danh sách các sản phẩm không đủ số lượng nếu không thể
     */
    public function canCheckout()
    {
        $outOfStockItems = $this->checkCartItemsStock();

        if (count($outOfStockItems) > 0) {
            return $outOfStockItems;
        }

        return true;
    }
    protected function updateItemQuantityInCookies(int $productId, int $quantity, array $optionIds): void
    {
        $cartItems = $this->getCartItemsFromCookies();

        ksort($optionIds);

        //Use a unique key based on product ID and option IDs
        $itemKey = $productId . '_' . json_encode($optionIds);

        if (isset($cartItems[$itemKey])) {
            $cartItems[$itemKey]['quantity'] = $quantity;
        }

        //Save updated cart items back to the cookie
        Cookie::queue(self::COOKIE_NAME, json_encode($cartItems), self::COOKIE_LIFETIME);
    }

    protected function saveItemToDatabase(int $productId, int $quantity, $price, array $optionIds): void
    {
        $userId = Auth::id();
        ksort($optionIds);

        $cartItem = CartItem::where('user_id', $userId)
            ->where('product_id', $productId)
            ->where('variation_type_option_ids', json_encode($optionIds))
            ->first();

        if ($cartItem) {
            $cartItem->update([
                'quantity' => DB::raw('quantity + ' . $quantity),
            ]);
        } else {
            CartItem::create([
                'user_id' => $userId,
                'product_id' => $productId,
                'quantity' => $quantity,
                'price' => $price,
                'variation_type_option_ids' => $optionIds,
            ]);
        }
    }

    protected function saveItemToCookies(int $productId, int $quantity, $price, array $optionIds): void
    {
        $cartItems = $this->getCartItemsFromCookies();

        ksort($optionIds);

        // Use a unique key based on product ID and option IDs
        $itemKey = $productId . '-' . json_encode($optionIds);

        if (isset($cartItems[$itemKey])) {
            $cartItems[$itemKey]['quantity'] += $quantity;
            $cartItems[$itemKey]['price'] = $price;
        } else {
            $cartItems[$itemKey] = [
                'id' => \Str::uuid(),
                'product_id' => $productId,
                'quantity' => $quantity,
                'price' => $price,
                'option_ids' => $optionIds,
            ];
        }

        //Save updated cart items back to the cookie
        Cookie::queue(self::COOKIE_NAME, json_encode($cartItems), self::COOKIE_LIFETIME);
    }

    protected function removeItemFromDatabase(int $productId, array $optionIds): void
    {
        $userId = Auth::id();

        ksort($optionIds);

        CartItem::where ('user_id', $userId)
            ->where('product_id', $productId)
            ->where('variation_type_option_ids', json_encode($optionIds))
            ->delete();
    }

    protected function removeItemFromCookies(int $productId, array $optionIds): void
    {
        $cartItems = $this->getCartItemsFromCookies();

        ksort($optionIds);

        //Define the cart key
        $cartKey = $productId . '-' . json_encode($optionIds);

        //Remove the item from the cart
        unset($cartItems[$cartKey]);

        Cookie::queue(self::COOKIE_NAME, json_encode($cartItems), self::COOKIE_LIFETIME);
    }

    protected function getCartItemsFromDatabase()
    {
        $userId = Auth::id();

        $cartItems = CartItem::where('user_id', $userId)
            ->get()
            ->map(function ($cartItem) {
                return [
                    'id' => $cartItem->id,
                    'product_id' => $cartItem->product_id,
                    'quantity' => $cartItem->quantity,
                    'price' => $cartItem->price,
                    'option_ids' => $cartItem->variation_type_option_ids,
                ];
            })
            ->toArray();

        return $cartItems;
    }

    protected function getCartItemsFromCookies()
    {
        $cartItems = json_decode(Cookie::get(self::COOKIE_NAME, '[]'), true);

        return $cartItems;
    }

    public function getCartItemsGrouped():array
    {
        $cartItems = $this->getCartItems();

        return collect($cartItems)
            ->groupBy(fn ($item) => $item['user']['id'])
            ->map(fn($items, $userId) =>[
                'user' => $items->first()['user'],
                'items' => $items->toArray(),
                'totalQuantity' => $items->sum('quantity'),
                'totalPrice' => $items->sum(fn ($item) => $item['price'] * $item['quantity']),
            ])
            ->toArray();
    }

    public function moveCartItemsToDatabase($userId): void
    {
        //Get the cart items from the cookie
        $cartItems = $this->getCartItemsFromCookies();

        //Loop through the cart items and insert them into the database
        foreach ($cartItems as $itemKey => $cartItem) {
            //Check if the cart item already exists for the user
            $existingItem = CartItem::where('user_id', $userId)
                ->where('product_id', $cartItem['product_id'])
                ->where('variation_type_option_ids', json_encode($cartItem['option_ids']))
                ->first();

            if ($existingItem) {
                //If the item exist, update the quantity
                $existingItem->update([
                    'quantity' => $existingItem->quantity + $cartItem['quantity'],
                    'price' => $cartItem['price'], //Optional: Update price if needed
                ]);
            } else {
                //If the item doesn't exist, create a new record
                CartItem::create([
                    'user_id' => $userId,
                    'product_id' => $cartItem['product_id'],
                    'quantity' => $cartItem['quantity'],
                    'price' => $cartItem['price'],
                    'variation_type_option_ids' => $cartItem['option_ids'],
                ]);
            }
        }
        //After transferring the items, delete the cart from the cookies
        Cookie::queue(self::COOKIE_NAME,'',-1); //Delete cookie by setting a

        // Xóa cache
        $this->cachedCartItems = null;
    }
}
