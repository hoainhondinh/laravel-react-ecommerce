<?php

namespace App\Filament\Resources;

use App\Filament\Resources\RoleResource\Pages;
use App\Enums\PermissionsEnum;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Spatie\Permission\Models\Role;

class RoleResource extends Resource
{
    protected static ?string $model = Role::class;

    protected static ?string $navigationIcon = 'heroicon-o-shield-check';
    protected static ?string $navigationGroup = 'Quyền và Vai trò';
    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Thông tin Role')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->label('Tên Role')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->placeholder('Nhập tên role (VD: Admin)')
                            ->columnSpanFull(),
                    ]),

                Forms\Components\Section::make('Phân quyền')
                    ->schema([
                        Forms\Components\CheckboxList::make('permissions')
                            ->label('Chọn Permissions')
                            ->options(
                                collect(PermissionsEnum::cases())
                                    ->mapWithKeys(fn($permission) => [$permission->value => $permission->value])
                            )
                            ->columns(3)
                            ->searchable()
                    ])
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Tên Role')
                    ->searchable(),

                Tables\Columns\TextColumn::make('permissions.name')
                    ->label('Permissions')
                    ->badge()
                    ->color('primary')
                    ->separator(',')
                    ->searchable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Ngày tạo')
                    ->date('d/m/Y')
                    ->sortable(),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ManageRoles::route('/'),
        ];
    }

    public static function getNavigationBadge(): ?string
    {
        return (string) Role::count();
    }
}
