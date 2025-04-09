<?php

namespace App\Filament\Widgets;

use App\Models\Product;
use App\Models\ProductVariation;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class InventoryStatsWidget extends BaseWidget
{
    protected static ?int $sort = 2;

    protected function getStats(): array
    {
        // Lấy thông tin tồn kho tổng
        $totalProducts = Product::count();
        $totalStock = Product::sum('quantity');

        // Lấy thông tin sản phẩm có tồn kho thấp
        $lowStockCount = $this->getLowStockCount();

        // Lấy thông tin sản phẩm hết hàng
        $outOfStockCount = $this->getOutOfStockCount();

        // Lấy thông tin biến thể
        $totalVariations = ProductVariation::count();
        $totalVariationStock = ProductVariation::sum('quantity');

        return [
            Stat::make('Tổng sản phẩm', number_format($totalProducts))
                ->description('Tổng số lượng sản phẩm')
                ->chart([7, 2, 10, 3, 15, 4, 17])
                ->color('primary'),

            Stat::make('Tổng tồn kho', number_format($totalStock))
                ->description('Tổng số lượng trong kho')
                ->chart([17, 16, 14, 15, 14, 13, 12])
                ->color('success'),

            Stat::make('Tồn kho thấp', number_format($lowStockCount))
                ->description('Sản phẩm sắp hết hàng')
                ->chart([3, 5, 2, 7, 4, 3, 6])
                ->color('warning'),

            Stat::make('Hết hàng', number_format($outOfStockCount))
                ->description('Sản phẩm đã hết hàng')
                ->chart([1, 2, 3, 2, 4, 5, 6])
                ->color('danger'),

            Stat::make('Tổng biến thể', number_format($totalVariations))
                ->description('Tổng số biến thể sản phẩm')
                ->chart([5, 8, 10, 12, 15, 19, 24])
                ->color('info'),

            Stat::make('Tồn kho biến thể', number_format($totalVariationStock))
                ->description('Tổng số lượng biến thể')
                ->chart([10, 12, 15, 14, 12, 10, 8])
                ->color('success'),
        ];
    }

    /**
     * Đếm số lượng sản phẩm có tồn kho thấp
     */
    protected function getLowStockCount(): int
    {
        // Đếm sản phẩm không có biến thể có tồn kho thấp
        $productsWithoutVariations = Product::doesntHave('variations')
            ->where('quantity', '<=', 5)
            ->where('quantity', '>', 0)
            ->count();

        // Đếm sản phẩm có biến thể có tồn kho thấp (theo biến thể)
        $productsWithVariations = Product::whereHas('variations', function ($query) {
            $query->where('quantity', '<=', 5)
                ->where('quantity', '>', 0);
        })->count();

        return $productsWithoutVariations + $productsWithVariations;
    }

    /**
     * Đếm số lượng sản phẩm hết hàng
     */
    protected function getOutOfStockCount(): int
    {
        // Đếm sản phẩm không có biến thể đã hết hàng
        $productsWithoutVariations = Product::doesntHave('variations')
            ->where('quantity', '=', 0)
            ->count();

        // Đếm sản phẩm có tất cả biến thể đều hết hàng
        $productsWithVariations = Product::has('variations')
            ->whereDoesntHave('variations', function ($query) {
                $query->where('quantity', '>', 0);
            })
            ->count();

        return $productsWithoutVariations + $productsWithVariations;
    }
}
