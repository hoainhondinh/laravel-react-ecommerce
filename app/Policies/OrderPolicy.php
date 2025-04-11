<?php

namespace App\Policies;

use App\Enums\RolesEnum;
use App\Enums\PermissionsEnum;
use App\Models\Order;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class OrderPolicy
{
    use HandlesAuthorization;

    /**
     * Xác định liệu admin có thể xem danh sách đơn hàng không
     */
    public function viewAny(User $user): bool
    {
        // Admin luôn có thể xem danh sách đơn hàng
        return $user->hasRole(RolesEnum::Admin->value) ||
            $user->can(PermissionsEnum::ViewOrders->value) ||
            $user->can(PermissionsEnum::ManageOrders->value);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(?User $user, Order $order)
    {
        // Trong Filament Admin, chỉ user đã đăng nhập mới có thể truy cập
        if ($user) {
            // Admin hoặc user với quyền xem đơn hàng có thể xem tất cả đơn hàng
            if ($user->hasRole(RolesEnum::Admin->value) ||
                $user->can(PermissionsEnum::ViewOrders->value) ||
                $user->can(PermissionsEnum::ManageOrders->value)) {
                return true;
            }

            // Người dùng thường chỉ có thể xem đơn hàng của chính họ
            return $user->id === $order->user_id;
        }

        // Trong frontend, guest có thể xem đơn hàng của họ nếu có token hợp lệ
        $orderToken = session('guest_order_' . $order->id);
        return $order->is_guest && $orderToken === $order->token;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Order $order): bool
    {
        // Admin hoặc user với quyền quản lý đơn hàng có thể cập nhật
        return $user->hasRole(RolesEnum::Admin->value) ||
            $user->can(PermissionsEnum::ManageOrders->value);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Order $order): bool
    {
        // Chỉ Admin hoặc user với quyền xóa đơn hàng mới có thể xóa
        return $user->hasRole(RolesEnum::Admin->value) ||
            $user->can(PermissionsEnum::DeleteOrders->value);
    }

    /**
     * Determine whether the user can cancel the model.
     */
    public function cancel(?User $user, Order $order)
    {
        // Kiểm tra trạng thái đơn hàng trước
        if (!in_array($order->status, ['pending', 'processing'])) {
            return false;
        }

        // Admin hoặc user với quyền quản lý đơn hàng có thể hủy bất kỳ đơn hàng nào
        if ($user && ($user->hasRole(RolesEnum::Admin->value) ||
                $user->can(PermissionsEnum::ManageOrders->value))) {
            return true;
        }

        // Người dùng đã đăng nhập chỉ có thể hủy đơn hàng của họ
        if ($user) {
            return $user->id === $order->user_id;
        }

        // Khách không đăng nhập có thể hủy đơn hàng của họ nếu có token hợp lệ
        $orderToken = session('guest_order_' . $order->id);
        return $order->is_guest && $orderToken === $order->token;
    }
}
