<?php
namespace App\Filament\Actions;

use Filament\Tables\Actions\Action;
use Illuminate\Database\Eloquent\Model;

class PublishAction extends Action
{
    public static function getDefaultName(): ?string
    {
        return 'publish';
    }

    protected function setUp(): void
    {
        parent::setUp();

        $this->label('Publish')
            ->color('success')
            ->icon('heroicon-o-check')
            ->requiresConfirmation()
            ->action(function (Model $record): void {
                $record->update([
                    'status' => 'published',
                    'published_at' => now(),
                ]);

                $this->success();
            });
    }
}
