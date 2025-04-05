<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Carbon;

class RevenueChart extends ChartWidget
{
    protected static ?string $heading = 'Doanh thu';

    protected function getData(): array
    {
        $days = collect(range(1, 30))->map(function ($day) {
            return Carbon::now()->subDays($day)->format('Y-m-d');
        })->reverse()->values();

        $revenues = $days->map(function ($date) {
            return Order::whereDate('created_at', $date)
                ->where('status', '!=', 'canceled')
                ->sum('total_price');
        });

        return [
            'datasets' => [
                [
                    'label' => 'Doanh thu',
                    'data' => $revenues,
                    'fill' => 'start',
                    'backgroundColor' => 'rgba(59, 130, 246, 0.1)',
                    'borderColor' => 'rgb(59, 130, 246)',
                ],
            ],
            'labels' => $days->map(fn ($date) => Carbon::parse($date)->format('d/m')),
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
