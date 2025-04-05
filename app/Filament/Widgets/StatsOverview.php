<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Carbon;

class StatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        // Lấy tổng doanh thu trong ngày
        $todayRevenue = Order::whereDate('created_at', Carbon::today())
            ->where('status', '!=', 'canceled')
            ->sum('total_price');

        // Lấy tổng doanh thu trong tuần
        $weekRevenue = Order::whereBetween('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])
            ->where('status', '!=', 'canceled')
            ->sum('total_price');

        // Lấy tổng doanh thu trong tháng
        $monthRevenue = Order::whereMonth('created_at', Carbon::now()->month)
            ->where('status', '!=', 'canceled')
            ->sum('total_price');

        // Số đơn hàng mới trong ngày
        $newOrders = Order::whereDate('created_at', Carbon::today())->count();

        // Số khách hàng mới trong tuần
        $newUsers = User::whereBetween('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])->count();

        // Số lượng sản phẩm đã bán trong tuần
        $soldProducts = Order::whereBetween('orders.created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])
            ->where('status', '!=', 'canceled')
            ->join('order_items', 'orders.id', '=', 'order_items.order_id')
            ->sum('order_items.quantity');

        return [
            Stat::make('Doanh thu hôm nay', number_format($todayRevenue) . ' đ')
                ->description('Từ đơn hàng mới')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->chart([7, 2, 10, 3, 15, 4, 17])
                ->color('success'),

            Stat::make('Đơn hàng mới', $newOrders)
                ->description('Hôm nay')
                ->descriptionIcon('heroicon-m-shopping-cart')
                ->color('warning'),

            Stat::make('Doanh thu tuần này', number_format($weekRevenue) . ' đ')
                ->description('Từ ' . Order::whereBetween('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])->count() . ' đơn hàng')
                ->descriptionIcon('heroicon-m-banknotes')
                ->color('success'),

            Stat::make('Doanh thu tháng này', number_format($monthRevenue) . ' đ')
                ->description('Từ ' . Order::whereMonth('created_at', Carbon::now()->month)->count() . ' đơn hàng')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color('success'),

            Stat::make('Khách hàng mới', $newUsers)
                ->description('Tuần này')
                ->descriptionIcon('heroicon-m-user')
                ->color('info'),

            Stat::make('Sản phẩm đã bán', $soldProducts)
                ->description('Tuần này')
                ->descriptionIcon('heroicon-m-shopping-bag')
                ->color('info'),
        ];
    }
}
