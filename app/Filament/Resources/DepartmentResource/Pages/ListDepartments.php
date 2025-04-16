<?php

namespace App\Filament\Resources\DepartmentResource\Pages;

use App\Filament\Resources\DepartmentResource;
use Filament\Actions;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ListRecords;

class ListDepartments extends ListRecords
{
    protected static string $resource = DepartmentResource::class;

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
                ->title('Xóa phòng ban')
                ->body('Phòng ban có danh mục liên kết sẽ không được xóa.')
                ->persistent(false);
        }

        return null;
    }
}
