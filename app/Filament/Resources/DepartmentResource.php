<?php

namespace App\Filament\Resources;

use App\Enums\RolesEnum;
use App\Filament\Resources\DepartmentResource\Pages;
use App\Filament\Resources\DepartmentResource\RelationManagers;
use App\Filament\Resources\DepartmentResource\RelationManagers\CategoriesRelationManager;
use App\Models\Department;
use Filament\Facades\Filament;
use Filament\Forms;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Checkbox;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Str;

class DepartmentResource extends Resource
{
    protected static ?string $model = Department::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Textinput::make('name')
                    ->live(onBlur: true)
                    ->required()
                    ->afterStateUpdated(function (string $operation, $state, callable $set) {
                        $set('slug', Str::slug($state));
                    }),
                Textinput::make('slug')
                    ->required(),
                Checkbox::make('active'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('categories_count')
                    ->label('Categories')
                    ->counts('categories')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make()
                    ->requiresConfirmation()
                    ->tooltip('Xóa phòng ban')
                    ->modalHeading('Xóa phòng ban')
                    ->modalDescription('Bạn có chắc chắn muốn xóa phòng ban này? Hành động này không thể hoàn tác.')
                    ->modalSubmitActionLabel('Có, xóa nó')
                    ->before(function (Tables\Actions\DeleteAction $action, Department $record) {
                        // Kiểm tra xem department có danh mục không
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
                // Thêm nút để xem các danh mục liên kết
                Tables\Actions\Action::make('view_categories')
                    ->label('Xem danh mục')
                    ->tooltip('Xem các danh mục của phòng ban này')
                    ->icon('heroicon-o-rectangle-stack')
                    ->url(fn (Department $record) => route('filament.admin.resources.departments.edit', ['record' => $record]) . '#relation-manager-departments-categories-relation-manager')
                    ->visible(fn (Department $record) => $record->categories()->count() > 0)
                    ->color('secondary'),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make()
                        ->action(function (Collection $records) {
                            $canDelete = [];
                            $cannotDelete = [];

                            foreach ($records as $record) {
                                if ($record->categories()->count() === 0) {
                                    $canDelete[] = $record->id;
                                } else {
                                    $cannotDelete[] = $record->name;
                                }
                            }

                            // Nếu có department không thể xóa thì hiển thị thông báo
                            if (!empty($cannotDelete)) {
                                Notification::make()
                                    ->danger()
                                    ->title('Một số phòng ban không thể xóa')
                                    ->body('Các phòng ban sau có danh mục liên kết và không thể xóa: ' . implode(', ', $cannotDelete))
                                    ->persistent()
                                    ->send();
                            }

                            // Xóa các department có thể xóa
                            if (!empty($canDelete)) {
                                Department::whereIn('id', $canDelete)->delete();

                                Notification::make()
                                    ->success()
                                    ->title('Đã xóa phòng ban')
                                    ->body(count($canDelete) . ' phòng ban đã được xóa thành công.')
                                    ->send();
                            }
                        }),
                ]),
            ]);
    }
    public static function getRelations(): array
    {
        return [
            CategoriesRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListDepartments::route('/'),
            'create' => Pages\CreateDepartment::route('/create'),
            'edit' => Pages\EditDepartment::route('/{record}/edit'),
        ];
    }

    public static function canViewAny(): bool
    {
        $user = Filament::auth()->user();
        return $user && $user->hasRole(RolesEnum::Admin);
    }
}
