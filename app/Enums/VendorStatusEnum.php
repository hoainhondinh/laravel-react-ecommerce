<?php

namespace App\Enums;

enum VendorStatusEnum
{
    case Pending = 'pending';
    case Approved = 'approved';
    case Rejected = 'rejected';

}
