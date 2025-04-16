<?php

namespace App\Filament\Resources;

use App\Enums\ProductStatusEnum;
use App\Enums\RolesEnum;
use App\Filament\Resources\ProductResource\Pages;
use App\Filament\Resources\ProductResource\Pages\EditProduct;
use App\Filament\Resources\ProductResource\Pages\ProductImages;
use App\Filament\Resources\ProductResource\Pages\ProductVariations;
use App\Filament\Resources\ProductResource\Pages\ProductVariationTypes;
use App\Filament\Resources\ProductResource\RelationManagers;
use App\Models\Product;
use Filament\Facades\Filament;
use Filament\Forms;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Pages\SubNavigationPosition;
use Filament\Resources\Pages\Page;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\SpatieMediaLibraryImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static ?string $navigationIcon = 'heroicon-s-queue-list';

    protected static SubNavigationPosition $subNavigationPosition = SubNavigationPosition::End;

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->forVendor();
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Grid::make()
                ->schema([
                    TextInput::make('title')
                        ->live(onBlur: true)
                        ->required()
                        ->afterStateUpdated(
                            function (string $operation, $state, callable $set)
                            {
                                $set("slug", Str::slug($state));
                            }),
                    TextInput::make('slug')
                        ->required(),
                    Select::make('department_id')
                        ->relationship('department', 'name')
                        ->label(__('Department'))
                        ->preload()
                        ->searchable()
                        ->required()
                        ->reactive() //Make the field reactive to changes
                        ->afterStateUpdated(function (callable $set) {
                            $set('category_id', null); //Reset category when department changes
                        }),
                    Select::make('category_id')
                        ->relationship(
                            name:'category',
                            titleAttribute: 'name',
                            modifyQueryUsing: function (Builder $query, callable $get) {
                                //Modify the category query based on the selected department
                                $departmentId = $get('department_id'); //Get selected department
                                if ($departmentId) {
                                    $query->where('department_id', $departmentId);//Filter category based on department

                                }
                            }
                        )
                    ->label(__('Category'))
                    ->preload()
                    ->searchable()
                    ->required(),
                ]),
                Forms\Components\RichEditor::make('description')
                    ->required()
                    ->toolbarButtons([
                        'block-quote',
                            'bold',
                            'bulletList',
                            'h2',
                            'h3',
                            'italic',
                            'link',
                            'orderedList',
                            'redo',
                            'strike',
                            'undo',
                            'underline',
                            'table'
                        ])
                        ->columnSpan(2),
                TextInput::make('price')
                    ->required()
                    ->numeric(),
                TextInput::make('quantity')
                    ->required()
                    ->integer(),
                Select::make('status')
                    ->options(ProductStatusEnum::labels())
                    ->default(ProductStatusEnum::Draft->value)
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                SpatieMediaLibraryImageColumn::make('images')
                    ->collection('images')
                    ->limit(1)
                    ->label('Image')
                    ->conversion('thumb'),
                TextColumn::make('title')
                    ->sortable()
                    ->words(10)
                    ->searchable(),
                TextColumn::make('status')
                    ->badge()
                    ->colors(ProductStatusEnum::colors()),
                TextColumn::make('department.name'),
                TextColumn::make('category.name'),
                TextColumn::make('created_at')
                    ->dateTime(),
                TextColumn::make('variations_count')
                    ->label('Biến thể')
                    ->counts('variations')
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->options(ProductStatusEnum::labels()),
                SelectFilter::make('department_id')
                ->relationship('department', 'name'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make()
                    ->requiresConfirmation()
                    ->tooltip('Xóa sản phẩm')
                    ->modalHeading('Xóa sản phẩm')
                    ->modalDescription('Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.')
                    ->modalSubmitActionLabel('Có, xóa nó')
                    ->before(function (Tables\Actions\DeleteAction $action, Product $record) {
                        // Kiểm tra xem sản phẩm có biến thể không
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
                // Thêm nút để xem các biến thể liên kết
                Tables\Actions\Action::make('view_variations')
                    ->label('Xem biến thể')
                    ->tooltip('Xem các biến thể của sản phẩm này')
                    ->icon('heroicon-o-view-columns')
                    ->url(fn (Product $record) => ProductResource::getUrl('variations', ['record' => $record]))
                    ->visible(fn (Product $record) => $record->variations()->count() > 0)
                    ->color('secondary'),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make()
                        ->action(function (Collection $records) {
                            $canDelete = [];
                            $cannotDelete = [];

                            foreach ($records as $record) {
                                if ($record->variations()->count() === 0) {
                                    $canDelete[] = $record->id;
                                } else {
                                    $cannotDelete[] = $record->title;
                                }
                            }

                            // Nếu có sản phẩm không thể xóa thì hiển thị thông báo
                            if (!empty($cannotDelete)) {
                                Notification::make()
                                    ->danger()
                                    ->title('Một số sản phẩm không thể xóa')
                                    ->body('Các sản phẩm sau có biến thể liên kết và không thể xóa: ' . implode(', ', $cannotDelete))
                                    ->persistent()
                                    ->send();
                            }

                            // Xóa các sản phẩm có thể xóa
                            if (!empty($canDelete)) {
                                Product::whereIn('id', $canDelete)->delete();

                                Notification::make()
                                    ->success()
                                    ->title('Đã xóa sản phẩm')
                                    ->body(count($canDelete) . ' sản phẩm đã được xóa thành công.')
                                    ->send();
                            }
                        }),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            RelationManagers\InventoryAdjustmentsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'edit' => Pages\EditProduct::route('/{record}/edit'),
            'images' => Pages\ProductImages::route('/{record}/images'),
            'variation-types' => Pages\ProductVariationTypes::route('/{record}/variation-types'),
            'variations' => Pages\ProductVariations::route('/{record}/variations'),
            'inventory' => Pages\ManageInventory::route('/{record}/inventory'),
        ];
    }

    public static function getRecordSubNavigation(Page $page): array
    {
        return $page->generateNavigationItems([
            EditProduct::class,
            ProductImages::class,
            ProductVariationTypes::class,
            ProductVariations::class,
        ]);
    }

    public static function canViewAny(): bool
    {
        $user = Filament::auth()->user();
        return $user && $user->hasAnyRole([RolesEnum::Admin, RolesEnum::Vendor]);
    }
}
