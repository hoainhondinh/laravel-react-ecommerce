<?php

namespace App\Filament\Widgets;

use App\Models\Product;
use App\Models\ProductVariation;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;
use Illuminate\Database\Eloquent\Builder;

class OutOfStockWidget extends BaseWidget
{
    protected static ?int $sort = 4;

    protected int|string|array $columnSpan = 'full';

    protected static ?string $heading = 'Sản phẩm hết hàng';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Product::query()
                    ->where(function ($query) {
                        // Sản phẩm không có biến thể đã hết hàng
                        $query->doesntHave('variations')
                            ->where('quantity', '=', 0);
                    })
                    ->orWhere(function ($query) {
                        // Sản phẩm có tất cả biến thể đều hết hàng
                        $query->has('variations')
                            ->whereDoesntHave('variations', function ($variationQuery) {
                                $variationQuery->where('quantity', '>', 0);
                            });
                    })
                    ->with(['variations', 'department', 'category'])
            )
            ->columns([
                Tables\Columns\TextColumn::make('title')
                    ->label('Sản phẩm')
                    ->searchable()
                    ->sortable()
                    ->wrap(),

                Tables\Columns\TextColumn::make('department.name')
                    ->label('Danh mục')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('quantity')
                    ->label('Tồn kho')
                    ->sortable()
                    ->formatStateUsing(fn (Product $record): string =>
                    $record->has_variations
                        ? "Tất cả biến thể: 0"
                        : "0"
                    )
                    ->color('danger'),

                Tables\Columns\TextColumn::make('price')
                    ->label('Giá')
                    ->money('VND')
                    ->sortable(),

                Tables\Columns\TextColumn::make('sold_count')
                    ->label('Đã bán')
                    ->sortable(),

                Tables\Columns\TextColumn::make('updated_at')
                    ->label('Cập nhật cuối')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ])
            ->actions([
                Tables\Actions\Action::make('manage_inventory')
                    ->label('Quản lý tồn kho')
                    ->url(fn (Product $record): string => route('filament.admin.resources.products.inventory', $record))
                    ->icon('heroicon-o-cube')
                    ->color('danger'),
            ])
            ->recordUrl(
                fn (Product $record): string => route('filament.admin.resources.products.inventory', $record)
            )
            ->defaultSort('updated_at', 'desc')
            ->paginated([10, 25, 50, 100]);

    }
}
