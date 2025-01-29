<?php

namespace App\Livewire;

use App\Models\BlogPosts;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Card;
use Filament\Widgets\StatsOverviewWidget\Stat;


class BlogStatsWidget extends BaseWidget
{
    protected function getStats(): array
    {
        return [
            Card::make('Total Posts', BlogPosts::count())
                ->description('Total number of blog posts')
                ->descriptionIcon('heroicon-s-document-text')
                ->color('success'),

            Card::make('Published Posts', BlogPosts::published()->count())
                ->description('Number of published posts')
                ->descriptionIcon('heroicon-s-check-circle')
                ->color('success'),

            Card::make('Draft Posts', BlogPosts::where('status', 'draft')->count())
                ->description('Number of draft posts')
                ->descriptionIcon('heroicon-s-pencil')
                ->color('warning'),

            Card::make('Comments', BlogPosts::count())
                ->description('Total number of comments')
                ->descriptionIcon('heroicon-s-chat-alt')
                ->color('primary'),
        ];
    }
}
