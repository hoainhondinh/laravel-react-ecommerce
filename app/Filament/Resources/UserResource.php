<?php

namespace App\Filament\Resources;

use App\Exports\UsersExport;
use App\Filament\Resources\UserResource\Pages;
use App\Imports\UsersImport;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Actions\ActionGroup;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Actions\ForceDeleteAction;
use Filament\Tables\Actions\RestoreAction;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Facades\Excel;

class UserResource extends Resource
{
    protected static ?string $model = User::class;
    protected static ?string $navigationIcon = 'heroicon-o-users';
    protected static ?string $navigationGroup = 'Quản lý Người dùng';
    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make('Thông tin cơ bản')
                ->schema([
                    Forms\Components\TextInput::make('name')
                        ->label('Họ và tên')
                        ->required()
                        ->maxLength(255),

                    Forms\Components\TextInput::make('email')
                        ->label('Email')
                        ->email()
                        ->required()
                        ->unique(ignoreRecord: true),

                    Forms\Components\TextInput::make('password')
                        ->label('Mật khẩu')
                        ->password()
                        ->revealable()
                        ->required(fn($context) => $context === 'create')
                        ->dehydrateStateUsing(fn($state) =>
                        !empty($state) ? Hash::make($state) : null
                        )
                        ->dehydrated(fn($state) => !empty($state)),
                ]),

            Forms\Components\Section::make('Phân quyền')
                ->schema([
                    Forms\Components\Select::make('roles')
                        ->relationship('roles', 'name')
                        ->multiple()
                        ->preload()
                        ->label('Vai trò'),

                    Forms\Components\Select::make('permissions')
                        ->relationship('permissions', 'name')
                        ->multiple()
                        ->preload()
                        ->label('Quyền riêng')
                ])
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Họ và tên')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('email')
                    ->label('Email')
                    ->searchable(),

                Tables\Columns\TextColumn::make('roles.name')
                    ->label('Vai trò')
                    ->badge()
                    ->color('primary')
                    ->separator(', '),

                Tables\Columns\IconColumn::make('status')
                    ->label('Trạng thái')
                    ->icon(fn ($record) => $record->deleted_at ? 'heroicon-o-x-circle' : 'heroicon-o-check-circle')
                    ->color(fn ($record) => $record->deleted_at ? 'danger' : 'success'),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Ngày đăng ký')
                    ->date('d/m/Y')
                    ->sortable()
            ])
            ->filters([
                Tables\Filters\TrashedFilter::make(),
                Tables\Filters\SelectFilter::make('roles')
                    ->relationship('roles', 'name')
                    ->multiple()
                    ->label('Lọc theo vai trò')
            ])
            ->headerActions([
                Tables\Actions\ImportAction::make('import_users')
                    ->label('Nhập Users')
                    ->icon('heroicon-o-arrow-down-tray')
                    ->color('primary')
                    ->modalHeading('Nhập danh sách người dùng')
                    ->modalDescription('Tải lên file Excel/CSV để nhập danh sách người dùng')
                    ->form([
                        Forms\Components\FileUpload::make('import_file')
                            ->label('Tệp tin')
                            ->acceptedFileTypes([
                                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                                'application/vnd.ms-excel',
                                'text/csv'
                            ])
                            ->required()
                            ->helperText('Chỉ chấp nhận file .xlsx, .xls, .csv'),

                        Forms\Components\Checkbox::make('overwrite')
                            ->label('Ghi đè dữ liệu hiện tại')
                            ->helperText('Nếu chọn, sẽ cập nhật thông tin người dùng đã tồn tại'),

                        Forms\Components\Select::make('default_role')
                            ->label('Vai trò mặc định')
                            ->relationship('roles', 'name')
                            ->helperText('Vai trò sẽ được gán nếu không có trong file')
                    ])
                    ->importer(UsersImport::class)
                    ->action(function (array $data, Tables\Actions\ImportAction $action) {
                        $importer = new UsersImport(
                            overwrite: $data['overwrite'] ?? false,
                            defaultRole: $data['default_role'] ?? null
                        );

                        $import = Excel::import($importer, $data['import_file']);

                        Notification::make()
                            ->title('Nhập dữ liệu thành công')
                            ->body("Đã nhập {$import->importedRows} người dùng")
                            ->success()
                            ->send();
                    }),

                Tables\Actions\ExportAction::make('export_users')
                    ->label('Xuất Users')
                    ->icon('heroicon-o-arrow-up-tray')
                    ->color('success')
                    ->modalHeading('Xuất danh sách người dùng')
                    ->modalDescription('Tùy chọn xuất dữ liệu người dùng')
                    ->form([
                        Forms\Components\Select::make('export_type')
                            ->label('Định dạng xuất')
                            ->options([
                                'xlsx' => 'Excel (.xlsx)',
                                'csv' => 'CSV (.csv)',
                                'pdf' => 'PDF (.pdf)'
                            ])
                            ->default('xlsx')
                            ->required(),

                        Forms\Components\Select::make('export_columns')
                            ->label('Cột dữ liệu')
                            ->multiple()
                            ->options([
                                'id' => 'ID',
                                'name' => 'Tên',
                                'email' => 'Email',
                                'roles' => 'Vai trò',
                                'created_at' => 'Ngày tạo'
                            ])
                            ->default(['id', 'name', 'email', 'roles'])
                            ->required(),

                        Forms\Components\Select::make('role_filter')
                            ->label('Lọc theo vai trò')
                            ->relationship('roles', 'name')
                            ->multiple()
                            ->helperText('Chỉ xuất các người dùng thuộc vai trò đã chọn')
                    ])
                    ->action(function (array $data) {
                        $exportType = $data['export_type'] ?? 'xlsx';
                        $selectedColumns = $data['export_columns'] ?? [];
                        $roleFilter = $data['role_filter'] ?? null;

                        $fileName = 'users_export_' . now()->format('YmdHis') . '.' . $exportType;

                        return Excel::download(
                            new UsersExport($selectedColumns, $roleFilter),
                            $fileName
                        );
                    })
            ])
            ->actions([
                ActionGroup::make([
                    // Chuyển đổi người dùng (Impersonate)
                    Tables\Actions\Action::make('impersonate')
                        ->label('Chuyển đổi')
                        ->icon('heroicon-o-arrow-right-on-rectangle')
                        ->color('primary')
                        ->action(function (User $record) {
                            // Kiểm tra quyền
                            if (!auth()->user()->hasRole('Admin')) {
                                Notification::make()
                                    ->title('Không có quyền')
                                    ->danger()
                                    ->send();
                                return;
                            }

                            // Đăng nhập với tư cách người dùng khác
                            auth()->login($record);

                            // Chuyển hướng
                            return redirect()->route('dashboard');
                        })
                        ->visible(fn(User $record) =>
                            auth()->user()->hasRole('Admin') &&
                            !$record->hasRole('Admin')
                        ),

                    // Chỉnh sửa
                    Tables\Actions\EditAction::make(),

                    // Xóa mềm
                    DeleteAction::make()
                        ->label('Vô hiệu hóa')
                        ->icon('heroicon-o-trash')
                        ->color('danger')
                        ->successNotification(
                            Notification::make()
                                ->success()
                                ->title('Đã vô hiệu hóa người dùng')
                        ),

                    // Khôi phục (nếu đã xóa mềm)
                    RestoreAction::make()
                        ->label('Kích hoạt lại')
                        ->icon('heroicon-o-arrow-path')
                        ->color('success')
                        ->successNotification(
                            Notification::make()
                                ->success()
                                ->title('Đã kích hoạt lại người dùng')
                        ),

                    // Xóa vĩnh viễn (chỉ admin)
                    ForceDeleteAction::make()
                        ->label('Xóa vĩnh viễn')
                        ->icon('heroicon-o-x-circle')
                        ->color('danger')
                        ->requiresConfirmation()
                        ->modalHeading('Xóa vĩnh viễn người dùng')
                        ->modalDescription('Hành động này không thể hoàn tác. Dữ liệu của người dùng sẽ bị xóa vĩnh viễn.')
                        ->visible(fn(User $record) =>
                            auth()->user()->hasRole('Admin') &&
                            $record->trashed()
                        )
                        ->action(function (User $record) {
                            try {
                                // Lấy thông tin user để log
                                $userId = $record->id;
                                $userName = $record->name;

                                // Tắt tạm thời ràng buộc khóa ngoại
                                $connection = config('database.default');
                                if ($connection === 'sqlite') {
                                    \DB::statement('PRAGMA foreign_keys = OFF');
                                }

                                // Ngắt kết nối các quan hệ trước khi xóa
                                if (method_exists($record, 'roles')) {
                                    $record->roles()->detach();
                                }

                                if (method_exists($record, 'permissions')) {
                                    $record->permissions()->detach();
                                }

                                // Cập nhật các bản ghi liên quan thay vì xóa
                                if (method_exists($record, 'blogPosts')) {
                                    $record->blogPosts()->update(['user_id' => null]);
                                }

                                if (method_exists($record, 'orders')) {
                                    $record->orders()->update(['user_id' => null]);
                                }

                                if (method_exists($record, 'vendor') && $record->vendor) {
                                    $record->vendor->delete();
                                }

                                // Bây giờ xóa user
                                $record->forceDelete();

                                // Bật lại ràng buộc khóa ngoại
                                if ($connection === 'sqlite') {
                                    \DB::statement('PRAGMA foreign_keys = ON');
                                }

                                Notification::make()
                                    ->success()
                                    ->title('Đã xóa vĩnh viễn người dùng')
                                    ->send();

                            } catch (\Exception $e) {
                                // Đảm bảo bật lại ràng buộc khóa ngoại nếu có lỗi
                                if ($connection === 'sqlite') {
                                    \DB::statement('PRAGMA foreign_keys = ON');
                                }

                                Notification::make()
                                    ->danger()
                                    ->title('Lỗi khi xóa')
                                    ->body('Chi tiết: ' . $e->getMessage())
                                    ->send();
                            }
                        })
                ])
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    // Xóa mềm hàng loạt
                    Tables\Actions\DeleteBulkAction::make()
                        ->label('Vô hiệu hóa')
                        ->successNotification(
                            Notification::make()
                                ->success()
                                ->title('Đã vô hiệu hóa các người dùng')
                        ),

                    // Khôi phục hàng loạt
                    Tables\Actions\RestoreBulkAction::make()
                        ->label('Kích hoạt lại')
                        ->successNotification(
                            Notification::make()
                                ->success()
                                ->title('Đã kích hoạt lại các người dùng')
                        )
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ManageUsers::route('/'),
        ];
    }

    public static function getNavigationBadge(): ?string
    {
        return (string) User::count();
    }
}
