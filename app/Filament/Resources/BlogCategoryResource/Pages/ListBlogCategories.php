<?php

namespace App\Filament\Resources\BlogCategoryResource\Pages;

use App\Filament\Resources\BlogCategoryResource;
use Filament\Actions;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ListRecords;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ListBlogCategories extends ListRecords
{
    protected static string $resource = BlogCategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }

    protected function getDeleteBulkActionNotification(): Notification
    {
        return Notification::make()
            ->warning()
            ->title('Xóa danh mục')
            ->body('Một số danh mục có thể không xóa được nếu chúng có bài viết liên kết.');
    }
}
