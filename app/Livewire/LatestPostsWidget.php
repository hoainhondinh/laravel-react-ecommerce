<?php

namespace App\Livewire;

use App\Models\BlogPosts;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class LatestPostsWidget extends BaseWidget
{
    protected int | string | array $columnSpan = 'full';

    protected function getTableQuery()
    {
        return BlogPosts::latest()->limit(5);
    }

    protected function getTableColumns(): array
    {
        return [
            Tables\Columns\TextColumn::make('title')
                ->searchable()
                ->sortable(),
            Tables\Columns\TextColumn::make('author.name')
                ->sortable(),
            Tables\Columns\BadgeColumn::make('status')
                ->colors([
                    'danger' => 'draft',
                    'warning' => 'reviewing',
                    'success' => 'published',
                ]),
            Tables\Columns\TextColumn::make('published_at')
                ->dateTime(),
        ];
    }
}
