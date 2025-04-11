<?php

namespace App\Filament\Resources;

use App\Filament\Resources\OrderResource\Pages;
use App\Models\Order;
use App\Notifications\OrderStatusUpdatedNotification;
use App\Notifications\PaymentConfirmedNotification;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\HtmlString;
use App\Filament\Resources\OrderResource\RelationManagers;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;

    protected static ?string $navigationIcon = 'heroicon-o-shopping-bag';

    protected static ?string $navigationGroup = 'E-commerce';

    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                // Cột bên trái (2/3 chiều rộng)
                Forms\Components\Group::make()
                    ->schema([
                        // Thông tin cơ bản đơn hàng - Luôn hiển thị đầu tiên
                        Forms\Components\Section::make('Thông tin đơn hàng')
                            ->schema([
                                Forms\Components\Grid::make(2)
                                    ->schema([
                                        Forms\Components\TextInput::make('id')
                                            ->label('Mã đơn hàng')
                                            ->disabled(),

                                        Forms\Components\DateTimePicker::make('created_at')
                                            ->label('Ngày đặt hàng')
                                            ->disabled(),

                                        Forms\Components\Select::make('status')
                                            ->label('Trạng thái đơn hàng')
                                            ->options([
                                                'pending' => 'Chờ xử lý',
                                                'processing' => 'Đang xử lý',
                                                'completed' => 'Hoàn thành',
                                                'canceled' => 'Đã hủy',
                                            ])
                                            ->required(),

                                        Forms\Components\Select::make('payment_status')
                                            ->label('Trạng thái thanh toán')
                                            ->options([
                                                'pending' => 'Chờ thanh toán',
                                                'paid' => 'Đã thanh toán',
                                                'awaiting' => 'Chờ chuyển khoản',
                                                'failed' => 'Thất bại',
                                            ])
                                            ->required(),

                                        Forms\Components\Select::make('payment_method')
                                            ->label('Phương thức thanh toán')
                                            ->options([
                                                'cod' => 'Thanh toán khi nhận hàng (COD)',
                                                'bank_transfer' => 'Chuyển khoản ngân hàng',
                                            ])
                                            ->disabled(),

                                        Forms\Components\TextInput::make('total_price')
                                            ->label('Tổng giá trị')
                                            ->prefix('₫')
                                            ->disabled(),
                                    ])
                            ])
                            ->columns(1)
                            ->collapsible(false),

                        // Danh sách sản phẩm - Quan trọng, nên đưa lên trước
                        Forms\Components\Section::make('Chi tiết đơn hàng')
                            ->schema([
                                Forms\Components\Placeholder::make('items_count')
                                    ->label('Tổng số sản phẩm')
                                    ->content(fn (Order $record): int => $record->items->count()),

                                Forms\Components\Placeholder::make('items_list')
                                    ->label('Danh sách sản phẩm')
                                    ->content(function (Order $record) {
                                        $items = $record->items()->with('product')->get();
                                        $html = '<div class="space-y-3 mt-2">';

                                        foreach ($items as $item) {
                                            $html .= '<div class="flex items-center gap-3 border-b pb-3">';

                                            // Product image
                                            $html .= '<div class="flex-shrink-0 w-16 h-16 border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">';
                                            if ($item->product) {
                                                // Ưu tiên sử dụng getFirstMediaUrl nếu sản phẩm sử dụng Media Library
                                                if (method_exists($item->product, 'getFirstMediaUrl')) {
                                                    $imageSrc = $item->product->getFirstMediaUrl('images', 'small');
                                                } else {
                                                    $imageSrc = $item->product->image ?? null;
                                                }

                                                // Nếu có ảnh
                                                if ($imageSrc) {
                                                    // Xử lý URL hình ảnh để đảm bảo đúng định dạng
                                                    if (!filter_var($imageSrc, FILTER_VALIDATE_URL) && !str_starts_with($imageSrc, 'http')) {
                                                        // Đảm bảo đường dẫn bắt đầu với /
                                                        if (!str_starts_with($imageSrc, '/')) {
                                                            $imageSrc = '/' . $imageSrc;
                                                        }
                                                    }

                                                    $html .= '<div class="w-full h-full flex items-center justify-center">';
                                                    $html .= '<img src="' . $imageSrc . '" class="w-full h-full object-contain" onerror="this.onerror=null; this.src=\'/placeholder.jpg\';">';
                                                    $html .= '</div>';
                                                } else {
                                                    $html .= '<div class="w-full h-full flex items-center justify-center bg-gray-50">';
                                                    $html .= '<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">';
                                                    $html .= '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />';
                                                    $html .= '</svg>';
                                                    $html .= '</div>';
                                                }
                                            } else {
                                                $html .= '<div class="w-full h-full flex items-center justify-center bg-gray-50">';
                                                $html .= '<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">';
                                                $html .= '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />';
                                                $html .= '</svg>';
                                                $html .= '</div>';
                                            }
                                            $html .= '</div>';

                                            // Product details
                                            $html .= '<div class="flex-1">';
                                            $html .= '<div class="font-medium">' . $item->product->title . '</div>';

                                            // Options
                                            if (!empty($item->options)) {
                                                $html .= '<div class="text-sm text-gray-500">';

                                                // Xử lý dữ liệu options
                                                $optionsData = $item->options;

                                                // Parse JSON string nếu cần
                                                if (is_string($optionsData)) {
                                                    try {
                                                        $decoded = json_decode($optionsData, true);
                                                        if (json_last_error() === JSON_ERROR_NONE) {
                                                            $optionsData = $decoded;
                                                        }
                                                    } catch (\Exception $e) {
                                                        // Giữ nguyên giá trị nếu không parse được
                                                    }
                                                }

                                                // Xử lý các kiểu dữ liệu khác nhau
                                                if (is_array($optionsData)) {
                                                    if (array_is_list($optionsData)) {
                                                        // Là mảng tuần tự (array)
                                                        $formattedOptions = [];

                                                        foreach ($optionsData as $opt) {
                                                            if (is_array($opt) && isset($opt['name'])) {
                                                                if (isset($opt['type']) && isset($opt['type']['name'])) {
                                                                    $formattedOptions[] = "{$opt['name']} ({$opt['type']['name']})";
                                                                } else {
                                                                    $formattedOptions[] = $opt['name'];
                                                                }
                                                            } else if (is_array($opt)) {
                                                                $formattedOptions[] = json_encode($opt, JSON_UNESCAPED_UNICODE);
                                                            } else {
                                                                $formattedOptions[] = (string)$opt;
                                                            }
                                                        }

                                                        $html .= implode(', ', $formattedOptions);
                                                    } else {
                                                        // Là object (associative array)
                                                        $formattedOptions = [];

                                                        foreach ($optionsData as $key => $value) {
                                                            if ($value === null || $value === '') {
                                                                continue;
                                                            }

                                                            if (is_array($value)) {
                                                                if (isset($value['name'])) {
                                                                    $formattedOptions[] = "$key: {$value['name']}";
                                                                } else {
                                                                    $formattedOptions[] = "$key: " . json_encode($value, JSON_UNESCAPED_UNICODE);
                                                                }
                                                            } else {
                                                                $formattedOptions[] = "$key: $value";
                                                            }
                                                        }

                                                        $html .= implode(', ', $formattedOptions);
                                                    }
                                                } else {
                                                    // Giá trị chuỗi hoặc kiểu dữ liệu khác
                                                    $html .= (string)$optionsData;
                                                }

                                                $html .= '</div>';
                                            }

                                            $html .= '</div>';

                                            // Quantity and price
                                            $html .= '<div class="text-right">';
                                            $html .= '<div>' . number_format($item->price) . ' ₫ x ' . $item->quantity . '</div>';
                                            $html .= '<div class="font-medium">' . number_format($item->price * $item->quantity) . ' ₫</div>';
                                            $html .= '</div>';

                                            $html .= '</div>'; // End of item
                                        }

                                        // Total
                                        $html .= '<div class="flex justify-between pt-3 font-bold text-primary-600">';
                                        $html .= '<div>Tổng cộng:</div>';
                                        $html .= '<div>' . number_format($record->total_price) . ' ₫</div>';
                                        $html .= '</div>';

                                        $html .= '</div>'; // End of container

                                        return new \Illuminate\Support\HtmlString($html);
                                    }),
                            ])
                            ->collapsible(),

                        // Thông tin giao hàng - Đặt sau danh sách sản phẩm
                        Forms\Components\Section::make('Thông tin giao hàng')
                            ->schema([
                                Forms\Components\Grid::make(2)
                                    ->schema([
                                        Forms\Components\TextInput::make('name')
                                            ->label('Tên người nhận')
                                            ->required(),

                                        Forms\Components\TextInput::make('email')
                                            ->label('Email')
                                            ->email()
                                            ->required(),

                                        Forms\Components\TextInput::make('phone')
                                            ->label('Số điện thoại')
                                            ->tel()
                                            ->required(),
                                    ]),

                                Forms\Components\Textarea::make('address')
                                    ->label('Địa chỉ')
                                    ->required()
                                    ->columnSpanFull(),
                            ])
                            ->collapsible(),
                    ])
                    ->columnSpan(['lg' => 2]),

                // Cột bên phải (1/3 chiều rộng)
                Forms\Components\Group::make()
                    ->schema([
                        // Thông tin khách hàng
                        Forms\Components\Section::make('Thông tin khách hàng')
                            ->schema([
                                Forms\Components\Placeholder::make('customer_type')
                                    ->label('Loại khách hàng')
                                    ->content(fn (Order $record): string => $record->is_guest ? 'Khách không đăng nhập' : 'Khách đã đăng nhập'),

                                Forms\Components\Placeholder::make('user_name')
                                    ->label('Khách hàng')
                                    ->content(fn (Order $record): string => $record->is_guest ? $record->name : ($record->user ? $record->user->name : 'N/A')),

                                Forms\Components\Placeholder::make('user_email')
                                    ->label('Email')
                                    ->content(fn (Order $record): string => $record->is_guest ? $record->email : ($record->user ? $record->user->email : 'N/A')),

                                Forms\Components\Placeholder::make('user_created')
                                    ->label('Ngày tạo tài khoản')
                                    ->content(fn (Order $record): string => $record->user && $record->user->created_at
                                        ? $record->user->created_at->format('d/m/Y')
                                        : 'N/A')
                                    ->visible(fn (Order $record): bool => !$record->is_guest),
                            ])
                            ->collapsible(),

                        // Ghi chú
                        Forms\Components\Section::make('Ghi chú')
                            ->schema([
                                Forms\Components\Textarea::make('admin_note')
                                    ->label('Ghi chú của admin')
                                    ->placeholder('Nhập ghi chú cho đơn hàng này...')
                                    ->rows(3),

                                Forms\Components\Textarea::make('cancel_reason')
                                    ->label('Lý do hủy')
                                    ->disabled()
                                    ->visible(fn (Order $record) => $record->status === 'canceled')
                                    ->extraAttributes(['class' => 'bg-red-50']),
                            ])
                            ->collapsible(),

                        // Lịch sử đơn hàng (Thêm section mới)
                        Forms\Components\Section::make('Lịch sử đơn hàng')
                            ->schema([
                                Forms\Components\Placeholder::make('order_history')
                                    ->content(function (Order $record) {
                                        $histories = $record->histories()->orderBy('created_at', 'desc')->get();

                                        if ($histories->isEmpty()) {
                                            return 'Chưa có lịch sử đơn hàng.';
                                        }

                                        $html = '<div class="space-y-3">';

                                        foreach ($histories as $history) {
                                            $statusText = match($history->status) {
                                                'pending' => 'Chờ xử lý',
                                                'processing' => 'Đang xử lý',
                                                'completed' => 'Hoàn thành',
                                                'canceled' => 'Đã hủy',
                                                'payment_confirmed' => 'Đã xác nhận thanh toán',
                                                default => $history->status,
                                            };

                                            $statusColor = match($history->status) {
                                                'pending' => 'bg-yellow-100 text-yellow-800',
                                                'processing' => 'bg-blue-100 text-blue-800',
                                                'completed' => 'bg-green-100 text-green-800',
                                                'canceled' => 'bg-red-100 text-red-800',
                                                'payment_confirmed' => 'bg-green-100 text-green-800',
                                                default => 'bg-gray-100 text-gray-800',
                                            };

                                            $datetime = date('d/m/Y H:i', strtotime($history->created_at));

                                            $html .= '<div class="pb-2 border-b border-gray-100">';
                                            $html .= '<div class="flex justify-between items-center">';
                                            $html .= '<span class="px-2 py-1 rounded text-xs font-medium ' . $statusColor . '">' . $statusText . '</span>';
                                            $html .= '<span class="text-xs text-gray-500">' . $datetime . '</span>';
                                            $html .= '</div>';

                                            if ($history->note) {
                                                $html .= '<div class="mt-1 text-sm text-gray-600">' . $history->note . '</div>';
                                            }

                                            $html .= '</div>';
                                        }

                                        $html .= '</div>';

                                        return new \Illuminate\Support\HtmlString($html);
                                    }),
                            ])
                            ->collapsible(),
                    ])
                    ->columnSpan(['lg' => 1]),
            ])
            ->columns(3);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')
                    ->label('Mã')
                    ->searchable(),

                Tables\Columns\TextColumn::make('customer_name')
                    ->label('Khách hàng')
                    ->getStateUsing(function ($record) {
                        if ($record->is_guest) {
                            return $record->name . ' (Khách)';
                        }

                        return $record->user ? $record->user->name : 'N/A';
                    })
                    ->searchable(query: function (Builder $query, string $search): Builder {
                        return $query
                            ->where('name', 'like', "%{$search}%")
                            ->orWhereHas('user', function (Builder $query) use ($search) {
                                $query->where('name', 'like', "%{$search}%");
                            });
                    }),

                Tables\Columns\TextColumn::make('total_price')
                    ->label('Tổng tiền')
                    ->money('VND')
                    ->sortable(),

                Tables\Columns\TextColumn::make('status')
                    ->label('Trạng thái')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'warning',
                        'processing' => 'info',
                        'completed' => 'success',
                        'canceled' => 'danger',
                    })
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'pending' => 'Chờ xử lý',
                        'processing' => 'Đang xử lý',
                        'completed' => 'Hoàn thành',
                        'canceled' => 'Đã hủy',
                    }),

                Tables\Columns\TextColumn::make('payment_status')
                    ->label('Thanh toán')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'warning',
                        'paid' => 'success',
                        'awaiting' => 'info',
                        'failed' => 'danger',
                    })
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'pending' => 'Chờ thanh toán',
                        'paid' => 'Đã thanh toán',
                        'awaiting' => 'Chờ chuyển khoản',
                        'failed' => 'Thất bại',
                    }),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Ngày đặt')
                    ->dateTime()
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('Trạng thái')
                    ->options([
                        'pending' => 'Chờ xử lý',
                        'processing' => 'Đang xử lý',
                        'completed' => 'Hoàn thành',
                        'canceled' => 'Đã hủy',
                    ]),

                Tables\Filters\SelectFilter::make('payment_status')
                    ->label('Trạng thái thanh toán')
                    ->options([
                        'pending' => 'Chờ thanh toán',
                        'paid' => 'Đã thanh toán',
                        'awaiting' => 'Chờ chuyển khoản',
                        'failed' => 'Thất bại',
                    ]),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
//                Tables\Actions\Action::make('view_items')
//                    ->label('Xem sản phẩm')
//                    ->icon('heroicon-o-shopping-cart')
//                    ->color('success')
//                    ->modalHeading(fn ($record) => "Sản phẩm trong đơn hàng #{$record->id}")
//                    ->modalContent(function ($record) {
//                        $items = $record->items()->with('product')->get();
//                        $html = '<div class="space-y-4">';
//
//                        foreach ($items as $item) {
//                            $html .= '<div class="flex items-center space-x-3 border-b pb-3">';
//
//                            // Product image
//                            $html .= '<div class="flex-shrink-0 w-12 h-12">';
//                            if ($item->product && $item->product->image) {
//                                // Kiểm tra đường dẫn ảnh
//                                $imageSrc = $item->product->image;
//                                if (!str_starts_with($imageSrc, 'http') && !str_starts_with($imageSrc, '/')) {
//                                    $imageSrc = '/' . $imageSrc;
//                                }
//                                $html .= '<img src="' . $imageSrc . '" class="w-full h-full object-cover rounded" onerror="this.src=\'/placeholder.jpg\';this.onerror=null;">';
//                            } else {
//                                $html .= '<div class="w-full h-full bg-gray-200 rounded flex items-center justify-center"><span class="text-xs text-gray-500">No image</span></div>';
//                            }
//                            $html .= '</div>';
//
//                            // Product details
//                            $html .= '<div class="flex-1">';
//                            $html .= '<div class="font-medium">' . $item->product->title . '</div>';
//
//                            // Options
//                            if (!empty($item->options)) {
//                                $html .= '<div class="text-sm text-gray-500">';
//
//                                // Xử lý dữ liệu options
//                                $optionsData = $item->options;
//
//                                // Parse JSON string nếu cần
//                                if (is_string($optionsData)) {
//                                    try {
//                                        $decoded = json_decode($optionsData, true);
//                                        if (json_last_error() === JSON_ERROR_NONE) {
//                                            $optionsData = $decoded;
//                                        }
//                                    } catch (\Exception $e) {
//                                        // Giữ nguyên giá trị nếu không parse được
//                                    }
//                                }
//
//                                // Xử lý các kiểu dữ liệu khác nhau
//                                if (is_array($optionsData)) {
//                                    $formattedOptions = [];
//
//                                    // Kiểm tra xem mảng có phải danh sách tuần tự không
//                                    $isList = array_keys($optionsData) === range(0, count($optionsData) - 1);
//
//                                    if ($isList) {
//                                        // Là mảng tuần tự (array)
//                                        foreach ($optionsData as $opt) {
//                                            if (is_array($opt) && isset($opt['name'])) {
//                                                if (isset($opt['type']) && isset($opt['type']['name'])) {
//                                                    $formattedOptions[] = "{$opt['name']} ({$opt['type']['name']})";
//                                                } else {
//                                                    $formattedOptions[] = $opt['name'];
//                                                }
//                                            } else if (is_array($opt)) {
//                                                $formattedOptions[] = json_encode($opt, JSON_UNESCAPED_UNICODE);
//                                            } else {
//                                                $formattedOptions[] = (string)$opt;
//                                            }
//                                        }
//                                    } else {
//                                        // Là object (associative array)
//                                        foreach ($optionsData as $key => $value) {
//                                            if ($value === null || $value === '') {
//                                                continue;
//                                            }
//
//                                            if (is_array($value)) {
//                                                if (isset($value['name'])) {
//                                                    $formattedOptions[] = "$key: {$value['name']}";
//                                                } else {
//                                                    $formattedOptions[] = "$key: " . json_encode($value, JSON_UNESCAPED_UNICODE);
//                                                }
//                                            } else {
//                                                $formattedOptions[] = "$key: $value";
//                                            }
//                                        }
//                                    }
//
//                                    $html .= implode(', ', $formattedOptions);
//                                } else {
//                                    // Giá trị chuỗi hoặc kiểu dữ liệu khác
//                                    $html .= (string)$optionsData;
//                                }
//
//                                $html .= '</div>';
//                            }
//
//                            $html .= '</div>';
//
//                            // Quantity and price
//                            $html .= '<div class="text-right">';
//                            $html .= '<div>' . number_format($item->price) . ' ₫ x ' . $item->quantity . '</div>';
//                            $html .= '<div class="font-medium">' . number_format($item->price * $item->quantity) . ' ₫</div>';
//                            $html .= '</div>';
//
//                            $html .= '</div>'; // End of item
//                        }
//
//                        // Total
//                        $html .= '<div class="flex justify-between pt-3 font-bold">';
//                        $html .= '<div>Tổng cộng:</div>';
//                        $html .= '<div>' . number_format($record->total_price) . ' ₫</div>';
//                        $html .= '</div>';
//
//                        $html .= '</div>'; // End of container
//
//                        return new \Illuminate\Support\HtmlString($html);
//                    })
//                    ->modalWidth('md'),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            RelationManagers\OrderItemsRelationManager::class,
        ];
    }
    public static function afterSave(Form $form): void
    {
        $record = $form->getRecord();

        // Kiểm tra xem đơn hàng có phải là của khách không đăng nhập không
        if ($record->is_guest || !$record->user) {
            // Nếu là đơn hàng của khách không đăng nhập, chỉ lưu lịch sử mà không gửi thông báo
            if ($record->isDirty('status')) {
                $previousStatus = $record->getOriginal('status');

                // Lưu lịch sử cập nhật
                $record->histories()->create([
                    'status' => $record->status,
                    'note' => 'Trạng thái đơn hàng đã được cập nhật từ "' . $previousStatus . '" sang "' . $record->status . '".',
                ]);
            }

            if ($record->isDirty('payment_status') && $record->payment_status === 'paid') {
                // Lưu lịch sử thanh toán
                $record->histories()->create([
                    'status' => 'payment_confirmed',
                    'note' => 'Thanh toán đã được xác nhận.',
                ]);
            }
        } else {
            // Xử lý cho đơn hàng của người dùng đã đăng nhập
            if ($record->isDirty('status')) {
                $previousStatus = $record->getOriginal('status');
                $record->user->notify(new OrderStatusUpdatedNotification($record, $previousStatus));

                // Lưu lịch sử cập nhật
                $record->histories()->create([
                    'status' => $record->status,
                    'note' => 'Trạng thái đơn hàng đã được cập nhật từ "' . $previousStatus . '" sang "' . $record->status . '".',
                ]);
            }

            if ($record->isDirty('payment_status') && $record->payment_status === 'paid') {
                $record->user->notify(new PaymentConfirmedNotification($record));

                // Lưu lịch sử thanh toán
                $record->histories()->create([
                    'status' => 'payment_confirmed',
                    'note' => 'Thanh toán đã được xác nhận.',
                ]);
            }
        }
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListOrders::route('/'),
            'create' => Pages\CreateOrder::route('/create'),
            'edit' => Pages\EditOrder::route('/{record}/edit'),
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->latest();
    }
}
