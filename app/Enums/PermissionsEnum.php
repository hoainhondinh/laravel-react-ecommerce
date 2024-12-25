<?php

namespace App\Enums;

enum PermissionsEnum: string
{
    case ApproveVendor = 'ApproveVendor';
    case SellProducts = 'SellProducts';
    case BuyProducts = 'BuyProducts';

}
