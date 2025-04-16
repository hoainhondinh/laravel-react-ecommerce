<?php

namespace App\Filament\Resources;

use App\Enums\RolesEnum;
use App\Filament\Resources\BlogCategoryResource\Pages;
use App\Models\BlogCategory;
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

class BlogCategoryResource extends Resource
{
    protected static ?string $model = BlogCategory::class;
    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';
    protected static ?string $navigationGroup = 'Blog';
    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Category Details')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(255)
                            ->autofocus(),
                        Forms\Components\Textarea::make('description')
                            ->rows(3)
                            ->maxLength(500),
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
                    ->tooltip('Delete this category')
                    ->modalHeading('Delete Category')
                    ->modalDescription('Are you sure you want to delete this category? This action cannot be undone.')
                    ->modalSubmitActionLabel('Yes, delete it')
                    ->successNotification(
                        Notification::make()
                            ->success()
                            ->title('Category deleted')
                            ->body('The category has been deleted successfully.')
                    )
                    ->failureNotification(
                        Notification::make()
                            ->danger()
                            ->title('Cannot delete category')
                            ->body('This category cannot be deleted because it has associated posts.')
                            ->persistent()
                    )
                    ->before(function (Tables\Actions\DeleteAction $action, BlogCategory $record) {
                        // Kiểm tra xem danh mục có bài viết không
                        $postsCount = $record->posts()->count();

                        if ($postsCount > 0) {
                            Notification::make()
                                ->danger()
                                ->title('Không thể xóa danh mục')
                                ->body("Danh mục này có {$postsCount} bài viết liên kết. Vui lòng xóa hoặc chuyển các bài viết trước.")
                                ->persistent()
                                ->send();

                            $action->cancel();
                        }
                    }),
                // Thêm nút để xem các bài viết liên kết
                Tables\Actions\Action::make('view_posts')
                    ->label('Xem bài viết')
                    ->icon('heroicon-o-document-text')
                    ->url(fn (BlogCategory $record) => route('filament.admin.resources.blog-posts.index', [
                        'tableFilters[category][value]' => $record->id,
                    ]))
                    ->visible(fn (BlogCategory $record) => $record->posts()->count() > 0)
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

                            // Nếu có danh mục không thể xóa thì hiển thị thông báo
                            if (!empty($cannotDelete)) {
                                Notification::make()
                                    ->danger()
                                    ->title('Một số danh mục không thể xóa')
                                    ->body('Các danh mục sau có bài viết liên kết và không thể xóa: ' . implode(', ', $cannotDelete))
                                    ->persistent()
                                    ->send();
                            }

                            // Xóa các danh mục có thể xóa
                            if (!empty($canDelete)) {
                                BlogCategory::whereIn('id', $canDelete)->delete();

                                Notification::make()
                                    ->success()
                                    ->title('Đã xóa danh mục')
                                    ->body(count($canDelete) . ' danh mục đã được xóa thành công.')
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
            'index' => Pages\ListBlogCategories::route('/'),
            'create' => Pages\CreateBlogCategory::route('/create'),
            'edit' => Pages\EditBlogCategory::route('/{record}/edit'),
        ];
    }
    public static function canViewAny(): bool
    {
        $user = Filament::auth()->user();
        return $user && $user->hasRole(RolesEnum::Admin);
    }
}
