<?php

namespace App\Filament\Resources\DepartmentResource\RelationManagers;

use App\Models\Category;
use App\Models\Product;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class CategoriesRelationManager extends RelationManager
{
    protected static string $relationship = 'categories';

    public function form(Form $form): Form
    {
        $department = $this->getOwnerRecord();
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                Forms\Components\Select::make('parent_id')
                    ->options(function () use ($department) {
                        return Category::query()
                            ->where('department_id', $department->id)
                            ->pluck('name', 'id')
                            ->toArray();
                    })
                ->label('Parent Category')
                ->preload()
                ->searchable(),
                Forms\Components\Checkbox::make('active'),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('name')
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->sortable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('parent.name')
                    ->sortable()
                    ->searchable(),
                IconColumn::make('active')
                    ->boolean(),
                Tables\Columns\TextColumn::make('products_count')
                    ->label('Sản phẩm')
                    ->counts('products')
                    ->sortable(),
            ])
            ->filters([
                //
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make()
                        ->requiresConfirmation() // Đảm bảo yêu cầu xác nhận
                        ->modalHeading('Xóa danh mục')
                        ->modalDescription('Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể hoàn tác.')
                        ->modalSubmitActionLabel('Có, xóa nó')
                        ->before(function (Tables\Actions\DeleteAction $action, Category $record) {
                            // Kiểm tra sản phẩm
                            $productsCount = Product::where('category_id', $record->id)->count();

                            if ($productsCount > 0) {
                                Notification::make()
                                    ->danger()
                                    ->title('Không thể xóa danh mục')
                                    ->body("Danh mục này có {$productsCount} sản phẩm. Vui lòng xóa các sản phẩm trước.")
                                    ->persistent()
                                    ->send();

                                $action->cancel();
                                return;
                            }

                            // Kiểm tra danh mục con - quan trọng!
                            $childrenCount = Category::where('parent_id', $record->id)->count();

                            if ($childrenCount > 0) {
                                Notification::make()
                                    ->danger()
                                    ->title('Không thể xóa danh mục')
                                    ->body("Danh mục này có {$childrenCount} danh mục con. Vui lòng xóa các danh mục con trước.")
                                    ->persistent()
                                    ->send();

                                $action->cancel();
                                return;
                            }
                        }),
                // Thêm nút để xem các sản phẩm liên kết
                Tables\Actions\Action::make('view_products')
                    ->label('Xem sản phẩm')
                    ->tooltip('Xem các sản phẩm thuộc danh mục này')
                    ->icon('heroicon-o-shopping-bag')
                    ->url(fn (Category $record) => route('filament.admin.resources.products.index', [
                        'tableFilters[category_id][value]' => $record->id,
                    ]))
                    ->visible(fn (Category $record) => $record->products()->count() > 0)
                    ->openUrlInNewTab()
                    ->color('secondary'),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make()
                        ->action(function (Collection $records) {
                            $canDelete = [];
                            $cannotDelete = [];

                            foreach ($records as $record) {
                                $hasProducts = Product::where('category_id', $record->id)->count() > 0;
                                $hasChildren = Category::where('parent_id', $record->id)->count() > 0;

                                if (!$hasProducts && !$hasChildren) {
                                    $canDelete[] = $record->id;
                                } else {
                                    $reason = [];
                                    if ($hasProducts) $reason[] = 'có sản phẩm';
                                    if ($hasChildren) $reason[] = 'có danh mục con';
                                    $cannotDelete[] = $record->name . ' (' . implode(', ', $reason) . ')';
                                }
                            }

                            // Hiển thị thông báo chi tiết hơn
                            if (!empty($cannotDelete)) {
                                Notification::make()
                                    ->danger()
                                    ->title('Một số danh mục không thể xóa')
                                    ->body('Các danh mục sau không thể xóa: ' . implode('; ', $cannotDelete))
                                    ->persistent()
                                    ->send();
                            }

                            // Xóa các danh mục có thể xóa
                            if (!empty($canDelete)) {
                                Category::whereIn('id', $canDelete)->delete();

                                Notification::make()
                                    ->success()
                                    ->title('Đã xóa danh mục')
                                    ->body(count($canDelete) . ' danh mục đã được xóa thành công.')
                                    ->send();
                            }
                        }),
                ]),
            ]);
    }
}
