<?php

namespace App\Filament\Widgets;

use App\Models\Product;
use App\Models\ProductVariation;
use App\Services\StockManagementService;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;
use Illuminate\Database\Eloquent\Builder;

class LowStockWidget extends BaseWidget
{
    protected static ?int $sort = 3;

    protected int|string|array $columnSpan = 'full';

    protected static ?string $heading = 'Sản phẩm tồn kho thấp';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                Product::query()
                    ->where(function ($query) {
                        // Sản phẩm không có biến thể có tồn kho thấp
                        $query->doesntHave('variations')
                            ->where('quantity', '<=', 5)
                            ->where('quantity', '>', 0);
                    })
                    ->orWhereHas('variations', function ($query) {
                        // Sản phẩm có ít nhất một biến thể có tồn kho thấp
                        $query->where('quantity', '<=', 5)
                            ->where('quantity', '>', 0);
                    })
                    ->with(['variations', 'variationTypes.options', 'department', 'category'])
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
                        ? "Biến thể: " . $this->getLowStockVariationsCount($record) . " biến thể thấp"
                        : number_format($record->quantity)
                    )
                    ->color(fn (Product $record): string =>
                    $record->quantity <= 5 && $record->quantity > 0 ? 'warning' : 'gray'
                    ),

                Tables\Columns\TextColumn::make('price')
                    ->label('Giá')
                    ->money('VND')
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
                    ->color('warning'),
            ])
            ->recordUrl(
                fn (Product $record): string => route('filament.admin.resources.products.inventory', $record)
            )
            ->defaultSort('updated_at', 'desc')
            ->paginated([10, 25, 50, 100]);

    }

    /**
     * Lấy số lượng biến thể có tồn kho thấp
     */
    protected function getLowStockVariationsCount(Product $product): int
    {
        return $product->variations()
            ->where('quantity', '<=', 5)
            ->where('quantity', '>', 0)
            ->count();
    }
}
