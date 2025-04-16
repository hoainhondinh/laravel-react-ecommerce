<?php

namespace App\Filament\Resources\BlogTagResource\Pages;

use App\Filament\Resources\BlogTagResource;
use Filament\Actions;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ListRecords;

class ListBlogTags extends ListRecords
{
    protected static string $resource = BlogTagResource::class;

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
                ->title('Xóa tag')
                ->body('Tag có bài viết liên kết sẽ không được xóa.')
                ->persistent(false);
        }

        return null;
    }
}
