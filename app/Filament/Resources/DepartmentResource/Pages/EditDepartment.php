<?php

namespace App\Filament\Resources\DepartmentResource\Pages;

use App\Filament\Resources\DepartmentResource;
use Filament\Actions;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\EditRecord;

class EditDepartment extends EditRecord
{
    protected static string $resource = DepartmentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make()
                ->before(function (Actions\DeleteAction $action) {
                    $record = $this->getRecord();
                    $categoriesCount = $record->categories()->count();

                    if ($categoriesCount > 0) {
                        Notification::make()
                            ->danger()
                            ->title('Không thể xóa phòng ban')
                            ->body("Phòng ban này có {$categoriesCount} danh mục. Vui lòng xóa các danh mục trước.")
                            ->persistent()
                            ->send();

                        $action->cancel();
                    }
                }),
        ];
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
