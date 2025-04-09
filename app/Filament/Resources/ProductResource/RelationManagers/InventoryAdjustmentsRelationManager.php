<?php

namespace App\Filament\Resources\ProductResource\RelationManagers;

use App\Models\InventoryAdjustment;
use App\Models\ProductVariation;
use App\Services\StockManagementService;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class InventoryAdjustmentsRelationManager extends RelationManager
{
    protected static string $relationship = 'inventoryAdjustments';

    protected static ?string $recordTitleAttribute = 'id';

    protected static ?string $title = 'Lịch sử tồn kho';

    protected static ?string $icon = 'heroicon-o-clock';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                // Không cho phép chỉnh sửa trực tiếp từ form này
                Forms\Components\Placeholder::make('id')
                    ->label('ID'),
                Forms\Components\Placeholder::make('adjustment')
                    ->label('Điều chỉnh'),
                Forms\Components\Placeholder::make('type')
                    ->label('Loại'),
                Forms\Components\Placeholder::make('reason')
                    ->label('Lý do'),
            ]);
    }

    public function table(Table $table): Table    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Thời gian')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),

                Tables\Columns\TextColumn::make('user.name')
                    ->label('Người thực hiện')
                    ->sortable(),

                Tables\Columns\TextColumn::make('type')
                    ->label('Loại')
                    ->formatStateUsing(function ($state) {
                        return match($state) {
                            'manual' => 'Thủ công',
                            'order' => 'Đơn hàng',
                            'order_cancel' => 'Hủy đơn hàng',
                            'system' => 'Hệ thống',
                            default => ucfirst($state),
                        };
                    })
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'manual' => 'primary',
                        'order' => 'warning',
                        'order_cancel' => 'success',
                        'system' => 'info',
                        default => 'gray',
                    }),

                Tables\Columns\TextColumn::make('variation_id')
                    ->label('Biến thể')
                    ->formatStateUsing(function ($state, $record) {
                        if (!$state) {
                            return 'Sản phẩm chính';
                        }

                        // Lấy chi tiết biến thể
                        if ($record->variation) {
                            $variationOptions = [];
                            $variation = $record->variation;
                            $product = $record->product;

                            // Nếu có biến thể, hiển thị chi tiết biến thể
                            if ($product->variationTypes) {
                                foreach ($product->variationTypes as $type) {
                                    foreach ($variation->variation_type_option_ids as $optionId) {
                                        $option = $type->options->firstWhere('id', $optionId);
                                        if ($option) {
                                            $variationOptions[] = "{$type->name}: {$option->name}";
                                            break;
                                        }
                                    }
                                }
                            }

                            return count($variationOptions) > 0
                                ? implode(', ', $variationOptions)
                                : "Biến thể #{$state}";
                        }

                        return "Biến thể #{$state}";
                    }),

                Tables\Columns\TextColumn::make('quantity_before')
                    ->label('Trước')
                    ->numeric(),

                Tables\Columns\TextColumn::make('adjustment')
                    ->label('Thay đổi')
                    ->numeric()
                    ->formatStateUsing(fn ($state) => $state > 0 ? "+{$state}" : $state)
                    ->color(fn ($state) => $state > 0 ? 'success' : ($state < 0 ? 'danger' : 'gray')),

                Tables\Columns\TextColumn::make('quantity_after')
                    ->label('Sau')
                    ->numeric(),

                Tables\Columns\TextColumn::make('reason')
                    ->label('Lý do')
                    ->limit(30)
                    ->tooltip(function ($record) {
                        return $record->reason;
                    }),
            ])
            ->filters([
                // Filter theo loại điều chỉnh
                Tables\Filters\SelectFilter::make('type')
                    ->options([
                        'manual' => 'Điều chỉnh thủ công',
                        'order' => 'Đơn hàng',
                        'order_cancel' => 'Hủy đơn hàng',
                        'system' => 'Hệ thống',
                    ])
                    ->label('Loại điều chỉnh'),

                // Filter theo biến thể
                Tables\Filters\Filter::make('variation')
                    ->form([
                        Forms\Components\Select::make('variation_filter')
                            ->options([
                                'main_product' => 'Sản phẩm chính',
                                'variations' => 'Chỉ biến thể',
                            ])
                            ->placeholder('Tất cả'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        if (empty($data['variation_filter'])) {
                            return $query;
                        }

                        return $query->when(
                            $data['variation_filter'] === 'main_product',
                            fn (Builder $q) => $q->whereNull('variation_id'),
                            fn (Builder $q) => $q->whereNotNull('variation_id')
                        );
                    }),

                // Filter theo khoảng thời gian
                Tables\Filters\Filter::make('created_at')
                    ->form([
                        Forms\Components\DatePicker::make('created_from')
                            ->placeholder('Từ ngày'),
                        Forms\Components\DatePicker::make('created_until')
                            ->placeholder('Đến ngày'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['created_from'],
                                fn (Builder $query, $date): Builder => $query->whereDate('created_at', '>=', $date),
                            )
                            ->when(
                                $data['created_until'],
                                fn (Builder $query, $date): Builder => $query->whereDate('created_at', '<=', $date),
                            );
                    }),
            ])
            ->headerActions([
                // Thêm action để điều chỉnh tồn kho
                Tables\Actions\Action::make('adjust_stock')
                    ->label('Điều chỉnh tồn kho')
                    ->icon('heroicon-o-adjustments-horizontal')
                    ->color('primary')
                    ->form([
                        Forms\Components\Select::make('adjustment_type')
                            ->label('Loại điều chỉnh')
                            ->options([
                                'increase' => 'Tăng tồn kho',
                                'decrease' => 'Giảm tồn kho',
                                'set' => 'Đặt giá trị tồn kho',
                            ])
                            ->required()
                            ->default('increase'),

                        Forms\Components\Select::make('variation_id')
                            ->label('Áp dụng cho')
                            ->options(function (RelationManager $livewire) {
                                $product = $livewire->getOwnerRecord();

                                // Nếu sản phẩm không có biến thể, chỉ hiển thị sản phẩm chính
                                if ($product->variations()->count() == 0) {
                                    return ['main_product' => 'Sản phẩm chính'];
                                }

                                // Tạo danh sách các biến thể
                                $options = ['main_product' => 'Sản phẩm chính'];

                                foreach ($product->variations as $variation) {
                                    $variationName = [];

                                    foreach ($product->variationTypes as $type) {
                                        foreach ($variation->variation_type_option_ids as $optionId) {
                                            $option = $type->options->firstWhere('id', $optionId);
                                            if ($option) {
                                                $variationName[] = "{$type->name}: {$option->name}";
                                                break;
                                            }
                                        }
                                    }

                                    $variantLabel = count($variationName) > 0
                                        ? implode(', ', $variationName)
                                        : "Biến thể #{$variation->id}";

                                    $options[$variation->id] = $variantLabel;
                                }

                                return $options;
                            })
                            ->required()
                            ->default('main_product'),

                        Forms\Components\TextInput::make('quantity')
                            ->label('Số lượng')
                            ->numeric()
                            ->required()
                            ->minValue(0),

                        Forms\Components\Textarea::make('reason')
                            ->label('Lý do')
                            ->required(),
                    ])
                    ->action(function (RelationManager $livewire, array $data): void {
                        $product = $livewire->getOwnerRecord();
                        $stockManagementService = app(StockManagementService::class);

                        $variationId = $data['variation_id'] === 'main_product' ? null : (int)$data['variation_id'];

                        // Lấy số lượng ban đầu
                        if ($variationId) {
                            $variation = $product->variations()->find($variationId);
                            $originalQuantity = $variation ? $variation->quantity : 0;
                        } else {
                            $originalQuantity = $product->quantity;
                        }

                        $quantity = (int)$data['quantity'];

                        // Tính toán giá trị điều chỉnh
                        switch ($data['adjustment_type']) {
                            case 'increase':
                                $adjustment = $quantity;
                                break;
                            case 'decrease':
                                $adjustment = -$quantity;
                                break;
                            case 'set':
                                $adjustment = $quantity - $originalQuantity;
                                break;
                            default:
                                $adjustment = 0;
                        }

                        // Thực hiện điều chỉnh tồn kho
                        $stockManagementService->adjustStock($product, $adjustment, $data['reason'], $variationId);

                        // Hiển thị thông báo
                        $actionLabel = match($data['adjustment_type']) {
                            'increase' => 'Đã tăng tồn kho thêm',
                            'decrease' => 'Đã giảm tồn kho',
                            'set' => 'Đã đặt tồn kho thành',
                            default => 'Đã điều chỉnh tồn kho',
                        };

                        \Filament\Notifications\Notification::make()
                            ->success()
                            ->title('Điều chỉnh tồn kho thành công')
                            ->body("{$actionLabel} {$quantity}")
                            ->send();

                        $livewire->refresh();
                    }),
            ])
            ->actions([
                // Chỉ cho phép xem, không cho phép sửa hoặc xóa lịch sử
                Tables\Actions\ViewAction::make(),
            ])
            ->defaultSort('created_at', 'desc')
            ->bulkActions([
                // Không có bulk actions
            ]);
    }
}
