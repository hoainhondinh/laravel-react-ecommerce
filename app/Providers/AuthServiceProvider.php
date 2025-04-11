<?php

namespace App\Providers;

use App\Enums\RolesEnum;
use App\Models\Order;
use App\Policies\OrderPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     */
    protected $policies = [
        Order::class => OrderPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // Gate cho phép Admin xem tất cả đơn hàng
        Gate::before(function ($user, $ability) {
            // Admin luôn có tất cả quyền
            if ($user->hasRole(RolesEnum::Admin->value)) {
                return true;
            }
        });

        // Gate cho khách không đăng nhập có thể xem đơn hàng
        Gate::define('view-guest-order', function ($user = null, Order $order) {
            // Nếu user đã đăng nhập
            if ($user) {
                return $user->id === $order->user_id;
            }

            // Nếu là đơn hàng của khách không đăng nhập, kiểm tra bằng session token
            $orderToken = session('guest_order_' . $order->id);
            return $order->is_guest && $orderToken === $order->token;
        });
    }
}
