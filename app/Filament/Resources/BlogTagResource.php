<?php


namespace App\Filament\Resources;

use App\Enums\RolesEnum;
use App\Filament\Resources\BlogTagResource\Pages;
use App\Models\BlogTag;
use Filament\Facades\Filament;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;

class BlogTagResource extends Resource
{
    protected static ?string $model = BlogTag::class;
    protected static ?string $navigationIcon = 'heroicon-o-tag';
    protected static ?string $navigationGroup = 'Blog';
    protected static ?int $navigationSort = 3;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Tag Details')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(255)
                            ->autofocus(),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('slug')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('posts_count')
                    ->label('Posts')
                    ->counts('posts')
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make()
                    ->requiresConfirmation()
                    ->tooltip('Delete this tag')
                    ->modalHeading('Delete Tag')
                    ->modalDescription('Are you sure you want to delete this tag? This action cannot be undone.')
                    ->modalSubmitActionLabel('Yes, delete it')
                    ->before(function (Tables\Actions\DeleteAction $action, BlogTag $record) {
                        // Kiểm tra xem tag có bài viết liên kết không
                        $postsCount = $record->posts()->count();

                        if ($postsCount > 0) {
                            Notification::make()
                                ->danger()
                                ->title('Không thể xóa tag')
                                ->body("Tag này có {$postsCount} bài viết liên kết. Vui lòng xóa liên kết các bài viết trước.")
                                ->persistent()
                                ->send();

                            $action->cancel();
                        }
                    }),
                // Thêm nút để xem các bài viết liên kết
                Tables\Actions\Action::make('view_posts')
                    ->label('Xem bài viết')
                    ->tooltip('Xem các bài viết sử dụng tag này')
                    ->icon('heroicon-o-document-text')
                    ->url(fn (BlogTag $record) => route('filament.admin.resources.blog-posts.index', [
                        'tableFilters[tags][value]' => $record->id,
                    ]))
                    ->visible(fn (BlogTag $record) => $record->posts()->count() > 0)
                    ->openUrlInNewTab(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make()
                        ->action(function (Collection $records) {
                            $canDelete = [];
                            $cannotDelete = [];

                            foreach ($records as $record) {
                                if ($record->posts()->count() === 0) {
                                    $canDelete[] = $record->id;
                                } else {
                                    $cannotDelete[] = $record->name;
                                }
                            }

                            // Nếu có tag không thể xóa thì hiển thị thông báo
                            if (!empty($cannotDelete)) {
                                Notification::make()
                                    ->danger()
                                    ->title('Một số tag không thể xóa')
                                    ->body('Các tag sau có bài viết liên kết và không thể xóa: ' . implode(', ', $cannotDelete))
                                    ->persistent()
                                    ->send();
                            }

                            // Xóa các tag có thể xóa
                            if (!empty($canDelete)) {
                                BlogTag::whereIn('id', $canDelete)->delete();

                                Notification::make()
                                    ->success()
                                    ->title('Đã xóa tag')
                                    ->body(count($canDelete) . ' tag đã được xóa thành công.')
                                    ->send();
                            }
                        }),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListBlogTags::route('/'),
            'create' => Pages\CreateBlogTag::route('/create'),
            'edit' => Pages\EditBlogTag::route('/{record}/edit'),
        ];
    }
    public static function canViewAny(): bool
    {
        $user = Filament::auth()->user();
        return $user && $user->hasRole(RolesEnum::Admin);
    }
}

