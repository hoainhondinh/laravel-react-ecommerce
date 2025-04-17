<?php

namespace App\Filament\Resources\UserResource\Pages;

use App\Filament\Resources\UserResource;
use App\Models\User;
use Filament\Actions;
use Filament\Resources\Pages\ManageRecords;
use Filament\Actions\ImportAction;
use Filament\Actions\ExportAction;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\UsersImport;
use App\Exports\UsersExport;

class ManageUsers extends ManageRecords
{
    protected static string $resource = UserResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),

            // Nhập dữ liệu từ file
            ImportAction::make()
                ->label('Nhập Users')
                ->importer(UsersImport::class)
                ->icon('heroicon-o-arrow-down-tray'),

            // Xuất dữ liệu ra file
            ExportAction::make()
                ->label('Xuất Users')
                ->exporter(UsersExport::class)
                ->icon('heroicon-o-arrow-up-tray')
        ];
    }

    // Thêm các phương thức hỗ trợ
    public function impersonateUser(User $user)
    {
        auth()->login($user);
        return redirect()->route('dashboard');
    }
}
