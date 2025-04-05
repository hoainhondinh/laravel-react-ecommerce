<?php
namespace App\Filament\Resources\OrderResource\RelationManagers;

use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class OrderItemsRelationManager extends RelationManager
{
    protected static string $relationship = 'items';

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('product_image')
                    ->label('Hình ảnh')
                    ->getStateUsing(function ($record) {
                        if (!$record || !$record->product) {
                            return null;
                        }

                        // Nếu product sử dụng Spatie Media Library
                        if (method_exists($record->product, 'getFirstMediaUrl')) {
                            return $record->product->getFirstMediaUrl('images');
                        }

                        return $record->product->image;
                    })
                    ->size(60)
                    ->square(),

                Tables\Columns\TextColumn::make('product.title')
                    ->label('Sản phẩm')
                    ->searchable()
                    ->limit(50),

                Tables\Columns\TextColumn::make('variation_id')
                    ->label('Biến thể ID')
                    ->visible(fn($record) => $record !== null && $record->variation_id !== null),

                Tables\Columns\TextColumn::make('quantity')
                    ->label('Số lượng'),

                Tables\Columns\TextColumn::make('price')
                    ->label('Đơn giá')
                    ->money('VND'),

                Tables\Columns\TextColumn::make('options')
                    ->label('Tùy chọn')
                    ->formatStateUsing(function ($state) {
                        if (empty($state)) return '';

                        // Nếu là chuỗi JSON, chuyển thành mảng
                        if (is_string($state)) {
                            try {
                                $state = json_decode($state, true);
                            } catch (\Exception $e) {
                                return $state;
                            }
                        }

                        if (is_array($state)) {
                            // Kiểm tra xem có phải mảng các object với thuộc tính name và type hay không
                            if (isset($state[0]) && is_array($state[0]) && isset($state[0]['name'])) {
                                return collect($state)->map(function ($item) {
                                    if (isset($item['type']) && isset($item['type']['name'])) {
                                        return "{$item['name']} ({$item['type']['name']})";
                                    }
                                    return $item['name'];
                                })->join(', ');
                            }

                            // Xử lý các trường hợp khác
                            return collect($state)
                                ->map(fn($value, $key) => is_numeric($key) ? $value : "$key: $value")
                                ->join(', ');
                        }

                        return $state;
                    }),

                Tables\Columns\TextColumn::make('total')
                    ->label('Thành tiền')
                    ->money('VND')
                    ->getStateUsing(fn($record) => $record->price * $record->quantity),
            ])
            ->defaultSort('id')
            ->bulkActions([])
            ->headerActions([]);
    }
}
