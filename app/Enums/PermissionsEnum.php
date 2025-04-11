<?php

namespace App\Enums;

enum PermissionsEnum: string
{
    case ApproveVendor = 'ApproveVendor';
    case SellProducts = 'SellProducts';
    case BuyProducts = 'BuyProducts';
// Thêm quyền quản lý đơn hàng
    case ViewOrders = 'ViewOrders';
    case ManageOrders = 'ManageOrders';
    case DeleteOrders = 'DeleteOrders';
}
