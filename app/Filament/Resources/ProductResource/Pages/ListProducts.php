<?php

namespace App\Filament\Resources\ProductResource\Pages;

use App\Filament\Resources\ProductResource;
use Filament\Actions;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ListRecords;

class ListProducts extends ListRecords
{
    protected static string $resource = ProductResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }

    // Thêm thông báo khi thực hiện bulk action xóa
    protected function getBulkActionNotification(?string $status = null): ?Notification
    {
        if ($status === 'deleting') {
            return Notification::make()
                ->warning()
                ->title('Xóa sản phẩm')
                ->body('Sản phẩm có biến thể liên kết sẽ không được xóa.')
                ->persistent(false);
        }

        return null;
    }
}
