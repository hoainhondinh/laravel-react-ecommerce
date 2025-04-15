<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ContactMessageResource\Pages;
use App\Models\ContactMessage;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class ContactMessageResource extends Resource
{
    protected static ?string $model = ContactMessage::class;

    protected static ?string $navigationIcon = 'heroicon-o-envelope';

    protected static ?string $navigationLabel = 'Tin nhắn liên hệ';

    protected static ?string $navigationGroup = 'Quản lý liên hệ';

    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Thông tin liên hệ')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->label('Họ tên')
                            ->required()
                            ->maxLength(255)
                            ->disabled(),

                        Forms\Components\TextInput::make('email')
                            ->label('Email')
                            ->email()
                            ->required()
                            ->maxLength(255)
                            ->disabled(),

                        Forms\Components\TextInput::make('phone')
                            ->label('Số điện thoại')
                            ->tel()
                            ->required()
                            ->maxLength(20)
                            ->disabled(),

                        Forms\Components\TextInput::make('subject')
                            ->label('Chủ đề')
                            ->required()
                            ->maxLength(255)
                            ->disabled(),

                        Forms\Components\Textarea::make('message')
                            ->label('Nội dung tin nhắn')
                            ->required()
                            ->disabled()
                            ->rows(6),
                    ])->columns(2),

                Forms\Components\Section::make('Thông tin xử lý')
                    ->schema([
                        Forms\Components\Select::make('status')
                            ->label('Trạng thái')
                            ->options([
                                'pending' => 'Chờ xử lý',
                                'processed' => 'Đã xử lý',
                                'spam' => 'Spam',
                            ])
                            ->required()
                            ->default('pending'),

                        Forms\Components\Textarea::make('admin_notes')
                            ->label('Ghi chú')
                            ->placeholder('Nhập ghi chú hoặc hành động đã thực hiện')
                            ->rows(4),
                    ]),

                Forms\Components\Section::make('Thông tin bổ sung')
                    ->schema([
                        Forms\Components\TextInput::make('ip_address')
                            ->label('Địa chỉ IP')
                            ->disabled(),

                        Forms\Components\Textarea::make('user_agent')
                            ->label('User Agent')
                            ->disabled()
                            ->rows(2),

                        Forms\Components\DateTimePicker::make('created_at')
                            ->label('Thời gian gửi')
                            ->disabled(),

                        Forms\Components\DateTimePicker::make('processed_at')
                            ->label('Thời gian xử lý'),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Họ tên')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('email')
                    ->label('Email')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('phone')
                    ->label('Điện thoại')
                    ->searchable(),

                Tables\Columns\TextColumn::make('subject')
                    ->label('Chủ đề')
                    ->searchable()
                    ->limit(30),

                Tables\Columns\TextColumn::make('status')
                    ->label('Trạng thái')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => match($state) {
                        'pending' => 'Chờ xử lý',
                        'processed' => 'Đã xử lý',
                        'spam' => 'Spam',
                        default => $state,
                    })
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'warning',
                        'processed' => 'success',
                        'spam' => 'danger',
                        default => 'gray',
                    }),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Thời gian gửi')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('Trạng thái')
                    ->options([
                        'pending' => 'Chờ xử lý',
                        'processed' => 'Đã xử lý',
                        'spam' => 'Spam',
                    ]),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\Action::make('mark_processed')
                    ->label('Đánh dấu đã xử lý')
                    ->icon('heroicon-o-check') // Cập nhật tên icon
                    ->color('success')
                    ->action(function (ContactMessage $record) {
                        $record->update([
                            'status' => 'processed',
                            'processed_at' => now(),
                        ]);
                    })
                    ->visible(fn (ContactMessage $record) => $record->status === 'pending'),

                Tables\Actions\Action::make('mark_spam')
                    ->label('Đánh dấu Spam')
                    ->icon('heroicon-o-no-symbol')
                    ->color('danger')
                    ->action(function (ContactMessage $record) {
                        $record->update([
                            'status' => 'spam',
                        ]);
                    })
                    ->visible(fn (ContactMessage $record) => $record->status !== 'spam'),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\BulkAction::make('mark_processed')
                        ->label('Đánh dấu đã xử lý')
                        ->icon('heroicon-o-check') // Cập nhật tên icon
                        ->action(function (Collection $records) {
                            $records->each(function ($record) {
                                $record->update([
                                    'status' => 'processed',
                                    'processed_at' => now(),
                                ]);
                            });
                        }),

                    Tables\Actions\BulkAction::make('mark_spam')
                        ->label('Đánh dấu Spam')
                        ->icon('heroicon-o-no-symbol') // Thay đổi icon
                        ->color('danger')
                        ->action(function (Collection $records) {
                            $records->each(function ($record) {
                                $record->update([
                                    'status' => 'spam',
                                ]);
                            });
                        }),

                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
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
            'index' => Pages\ListContactMessages::route('/'),
            'create' => Pages\CreateContactMessage::route('/create'),
            'edit' => Pages\EditContactMessage::route('/{record}/edit'),
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->latest();
    }
}
