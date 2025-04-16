<?php

namespace App\Filament\Resources\ProductResource\Pages;

use App\Filament\Resources\ProductResource;
use Filament\Actions;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\EditRecord;

class EditProduct extends EditRecord
{
    protected static string $resource = ProductResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make()
                ->before(function (Actions\DeleteAction $action) {
                    $record = $this->getRecord();
                    $variationsCount = $record->variations()->count();

                    if ($variationsCount > 0) {
                        Notification::make()
                            ->danger()
                            ->title('Không thể xóa sản phẩm')
                            ->body("Sản phẩm này có {$variationsCount} biến thể. Vui lòng xóa các biến thể trước.")
                            ->persistent()
                            ->send();

                        $action->cancel();
                    }
                }),
        ];
    }
}
