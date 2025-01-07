<?php

namespace App\Enums;

enum ProductStatusEnum: string
{
    case Draft = 'Draft';
    case Published = 'Published';

    public static function labels(): array
    {
        return [
            self::Draft->value =>__('Draft'),
            self::Published->value =>__('Published'),
        ];
    }
    public static function colors(): array
    {
        return [
            'gray' => self::Draft->value,
            'success' => self::Published->value,
        ];
    }
}
