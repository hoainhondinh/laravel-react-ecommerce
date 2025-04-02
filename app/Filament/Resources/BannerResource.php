<?php

namespace App\Filament\Resources;

use App\Filament\Resources\BannerResource\Pages;
use App\Models\Banner;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class BannerResource extends Resource
{
    protected static ?string $model = Banner::class;
    protected static ?string $navigationIcon = 'heroicon-o-photo';
    protected static ?string $navigationGroup = 'Content';
    protected static ?int $navigationSort = 3;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Card::make()
                    ->schema([
                        Forms\Components\Grid::make()
                            ->schema([
                                Forms\Components\TextInput::make('title')
                                    ->label('Tiêu đề')
                                    ->nullable() // Không bắt buộc
                                    ->maxLength(255)
                                    ->helperText('Không bắt buộc. Tiêu đề sẽ hiển thị phía dưới banner.'),

                                Forms\Components\TextInput::make('url')
                                    ->label('URL liên kết')
                                    ->url()
                                    ->nullable()
                                    ->maxLength(255),
                            ])->columns(2),

                        Forms\Components\Textarea::make('description')
                            ->label('Mô tả')
                            ->nullable()
                            ->rows(3)
                            ->maxLength(255)
                            ->helperText('Không bắt buộc. Mô tả sẽ hiển thị dưới tiêu đề.'),

                        Forms\Components\SpatieMediaLibraryFileUpload::make('banner')
                            ->collection('banner')
                            ->label('Hình ảnh desktop')
                            ->image()
                            ->imageResizeMode('cover')
                            ->imageCropAspectRatio('16:5')
                            ->imageResizeTargetWidth('1920')
                            ->imageResizeTargetHeight('600')
                            ->helperText('Kích thước đề xuất: 1920×600px')
                            ->required(),

                        Forms\Components\SpatieMediaLibraryFileUpload::make('mobile_banner')
                            ->collection('mobile_banner')
                            ->label('Hình ảnh mobile')
                            ->image()
                            ->imageResizeMode('cover')
                            ->imageCropAspectRatio('1:1')
                            ->imageResizeTargetWidth('768')
                            ->imageResizeTargetHeight('768')
                            ->helperText('Kích thước đề xuất: 768×768px (vuông cho mobile)')
                            ->required(),

                        Forms\Components\Grid::make()
                            ->schema([
                                Forms\Components\DateTimePicker::make('start_date')
                                    ->label('Ngày bắt đầu')
                                    ->nullable()
                                    ->helperText('Để trống nếu muốn hiển thị ngay lập tức'),

                                Forms\Components\DateTimePicker::make('end_date')
                                    ->label('Ngày kết thúc')
                                    ->nullable()
                                    ->after('start_date')
                                    ->helperText('Để trống nếu muốn hiển thị vô thời hạn'),
                            ])->columns(2),

                        Forms\Components\Grid::make()
                            ->schema([
                                Forms\Components\Toggle::make('is_active')
                                    ->label('Kích hoạt')
                                    ->default(true),

                                Forms\Components\TextInput::make('order')
                                    ->label('Thứ tự hiển thị')
                                    ->integer()
                                    ->default(0)
                                    ->minValue(0),
                            ])->columns(2),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\SpatieMediaLibraryImageColumn::make('banner')
                    ->label('Hình ảnh')
                    ->collection('banner')
                    ->width(200)
                    ->height(60),

                Tables\Columns\TextColumn::make('title')
                    ->label('Tiêu đề')
                    ->searchable()
                    ->sortable()
                    ->placeholder('Không có tiêu đề'),

                Tables\Columns\TextColumn::make('url')
                    ->label('Liên kết')
                    ->limit(30)
                    ->url(fn ($record) => $record->url)
                    ->openUrlInNewTab(),

                Tables\Columns\IconColumn::make('is_active')
                    ->label('Kích hoạt')
                    ->boolean()
                    ->sortable(),

                Tables\Columns\TextColumn::make('order')
                    ->label('Thứ tự')
                    ->sortable(),

                Tables\Columns\TextColumn::make('start_date')
                    ->label('Ngày bắt đầu')
                    ->dateTime()
                    ->sortable(),

                Tables\Columns\TextColumn::make('end_date')
                    ->label('Ngày kết thúc')
                    ->dateTime()
                    ->sortable(),
            ])
            ->defaultSort('order')
            ->filters([
                Tables\Filters\Filter::make('active')
                    ->label('Đang kích hoạt')
                    ->query(fn (Builder $query): Builder => $query->where('is_active', true)),

                Tables\Filters\Filter::make('inactive')
                    ->label('Không kích hoạt')
                    ->query(fn (Builder $query): Builder => $query->where('is_active', false)),

                Tables\Filters\Filter::make('current')
                    ->label('Đang hiển thị')
                    ->query(function (Builder $query): Builder {
                        return $query->where('is_active', true)
                            ->where(function ($q) {
                                $q->whereNull('start_date')
                                    ->orWhere('start_date', '<=', now());
                            })
                            ->where(function ($q) {
                                $q->whereNull('end_date')
                                    ->orWhere('end_date', '>=', now());
                            });
                    }),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListBanners::route('/'),
            'create' => Pages\CreateBanner::route('/create'),
            'edit' => Pages\EditBanner::route('/{record}/edit'),
        ];
    }
}
