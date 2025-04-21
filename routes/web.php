<?php

use App\Http\Controllers\AboutController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\SupportPageController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Guest Routes
Route::get('/', [ProductController::class, 'home'])->name('dashboard');
Route::get('/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/department/{department:slug}', [ProductController::class, 'department'])->name('department.show');
Route::get('/product/{product:slug}', [ProductController::class, 'show'])->name('product.show');
// Search results page
Route::get('/search', [SearchController::class, 'index'])->name('search.index');

// API endpoint for search suggestions
Route::get('/api/search-suggestions', [SearchController::class, 'searchSuggestions'])->name('api.search.suggestions');
// Blog Routes
Route::prefix('blog')->name('blog.')->group(function () {
    Route::get('/', [BlogController::class, 'index'])->name('index');
    Route::get('/category/{slug}', [BlogController::class, 'category'])->name('category');
    Route::get('/tag/{slug}', [BlogController::class, 'tag'])->name('tag');
    Route::get('/{slug}', [BlogController::class, 'show'])->name('show');
});
// About Routes
Route::get('/about', [AboutController::class, 'index'])->name('about.index');
// Support Pages
Route::get('/ho-tro', [SupportPageController::class, 'index'])->name('support.index');
Route::get('/ho-tro/{slug}', [SupportPageController::class, 'show'])->name('support.show');
// Contact Routes
Route::get('/lien-he', [ContactController::class, 'index'])->name('contact.index');
Route::post('/lien-he', [ContactController::class, 'store'])->name('contact.store');
Route::get('/lien-he/cam-on', [ContactController::class, 'success'])->name('contact.success');
// Robots.txt
Route::get('/robots.txt', function () {
    $content = "User-agent: *\nAllow: /\nSitemap: " . url('/sitemap.xml');
    return response($content)->header('Content-Type', 'text/plain');
});
// Cart Routes - Mở cho tất cả người dùng
Route::controller(CartController::class)->group(function () {
    Route::get('/cart', 'index')->name('cart.index');
    Route::post('/cart/add/{product}', 'store')->name('cart.store');
    Route::put('/cart/{product}', 'update')->name('cart.update');
    Route::delete('/cart/{product}', 'destroy')->name('cart.destroy');
    Route::post('/cart/checkout', 'checkout')->name('cart.checkout');
});

// Checkout Routes - Di chuyển ra khỏi middleware auth để hỗ trợ guest
Route::controller(CheckoutController::class)->group(function () {
    // Routes cho guest checkout
    Route::get('/checkout/guest', 'guestCheckout')->name('checkout.guest');
    Route::post('/checkout/guest', 'processGuestCheckout')->name('checkout.process-guest');

    // Các routes checkout chung cho cả guest và user đã đăng nhập
    Route::get('/checkout', 'index')->name('checkout.index');
    Route::post('/checkout', 'store')->name('checkout.store');
    Route::get('/checkout/confirmation/{order}', 'confirmation')->name('checkout.confirmation');
    Route::get('/checkout/success/{order}', 'success')->name('checkout.success');
});

// Auth routes
Route::middleware('auth')->group(function () {
    Route::get('/profile', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Profile routes
    Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Address management routes
    Route::get('/profile/addresses', [AddressController::class, 'index'])->name('profile.addresses');
    Route::post('/profile/addresses', [AddressController::class, 'store'])->name('profile.addresses.store');
    Route::post('/profile/addresses/{address}', [AddressController::class, 'update'])->name('profile.addresses.update');
    Route::put('/profile/addresses/{address}/set-default', [AddressController::class, 'setDefault'])->name('profile.addresses.set-default');
    Route::delete('/profile/addresses/{address}', [AddressController::class, 'destroy'])->name('profile.addresses.destroy');


    Route::middleware(['verified'])->group(function () {
        // Order routes - Cần đăng nhập
        Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
        Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
        Route::post('/orders/{order}/cancel', [OrderController::class, 'cancel'])->name('orders.cancel');

        // Payment routes - Cần đăng nhập
        Route::post('/orders/{order}/confirm-payment', [PaymentController::class, 'confirmPayment'])->name('payment.confirm');
        Route::post('/orders/{order}/regenerate-qr', [PaymentController::class, 'regenerateQR'])->name('payment.regenerate-qr');

        Route::get('/products/{product}/inventory', [ProductController::class, 'manageInventory'])
            ->name('products.inventory');
        Route::post('/products/{product}/adjust-inventory', [ProductController::class, 'adjustProductInventory'])
            ->name('products.adjust-inventory');
        Route::post('/products/{product}/variations/{variation}/adjust-inventory', [ProductController::class, 'adjustVariationInventory'])
            ->name('products.adjust-variation-inventory');
    });
});

// Guest Order Routes - Cho phép guest truy cập đơn hàng của họ với middleware
Route::middleware(['guest.order'])->group(function () {
    Route::get('/guest/orders/{order}', [OrderController::class, 'guestOrderShow'])
        ->name('guest.orders.show');
    Route::post('/guest/orders/{order}/cancel', [OrderController::class, 'guestOrderCancel'])
        ->name('guest.orders.cancel');

    // Chức năng thanh toán cho đơn hàng guest
    Route::post('/guest/orders/{order}/confirm-payment', [PaymentController::class, 'guestConfirmPayment'])
        ->name('guest.payment.confirm');
    Route::post('/guest/orders/{order}/regenerate-qr', [PaymentController::class, 'guestRegenerateQR'])
        ->name('guest.payment.regenerate-qr');
});

require __DIR__.'/auth.php';
