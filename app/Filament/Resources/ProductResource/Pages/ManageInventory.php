<?php

namespace App\Filament\Resources\ProductResource\Pages;

use App\Filament\Resources\ProductResource;
use App\Services\StockManagementService;
use Filament\Actions;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Form;
use Filament\Forms\Set;
use Filament\Resources\Pages\Page;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ManageInventory extends Page
{
    protected static string $resource = ProductResource::class;

    protected static ?string $title = 'Quản lý tồn kho';

    protected static ?string $navigationIcon = 'heroicon-o-cube';

    protected static string $view = 'filament.resources.product-resource.pages.manage-inventory';

    public ?array $data = [];

    public function mount(): void
    {
        $this->form->fill([
            'quantity' => $this->getRecord()->quantity,
        ]);
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Grid::make()
                    ->schema([
                        Section::make('Tồn kho sản phẩm chính')
                            ->schema([
                                TextInput::make('quantity')
                                    ->label('Số lượng tồn kho')
                                    ->numeric()
                                    ->minValue(0)
                                    ->required(),

                                Placeholder::make('sold_count')
                                    ->label('Đã bán')
                                    ->content(fn () => $this->getRecord()->sold_count),

                                Textarea::make('update_reason')
                                    ->label('Lý do cập nhật')
                                    ->rows(2)
                                    ->columnSpanFull(),
                            ])
                            ->columns(2),

                        $this->hasVariations() ?
                            Section::make('Tồn kho biến thể')
                                ->schema([
                                    Repeater::make('variations')
                                        ->label(false)
                                        ->schema($this->getVariationFields())
                                        ->columns(3)
                                        ->defaultItems(0)
                                        ->itemLabel(function (array $state): ?string {
                                            $optionLabels = [];

                                            // Lấy tên biến thể từ variation_labels
                                            foreach ($state['variation_labels'] ?? [] as $typeLabel => $optionLabel) {
                                                $optionLabels[] = "$typeLabel: $optionLabel";
                                            }

                                            return implode(', ', $optionLabels);
                                        })
                                        ->disableItemCreation()
                                        ->disableItemDeletion()
                                        ->collapsed(false),
                                ])
                                ->collapsible(true)
                                ->collapsed(false) : null,

                        Section::make('Điều chỉnh tồn kho')
                            ->schema([
                                Select::make('adjustment_type')
                                    ->label('Loại điều chỉnh')
                                    ->options([
                                        'increase' => 'Tăng tồn kho',
                                        'decrease' => 'Giảm tồn kho',
                                        'set' => 'Đặt giá trị tồn kho',
                                    ])
                                    ->required()
                                    ->default('increase'),

                                $this->hasVariations() ?
                                    Select::make('variation_id')
                                        ->label('Áp dụng cho')
                                        ->options($this->getVariationOptions())
                                        ->required()
                                        ->default('main_product') : null,

                                TextInput::make('adjustment_quantity')
                                    ->label('Số lượng')
                                    ->numeric()
                                    ->required()
                                    ->minValue(0),

                                Textarea::make('adjustment_reason')
                                    ->label('Lý do')
                                    ->required()
                                    ->columnSpanFull(),

                                Placeholder::make('adjustment_instructions')
                                    ->label('Hướng dẫn')
                                    ->content('Lưu ý: Điều chỉnh tồn kho sẽ được ghi lại trong lịch sử tồn kho.')
                                    ->columnSpanFull(),
                            ])
                            ->collapsible()
                            ->columns(2),
                    ])
                    ->columnSpanFull()
            ]);
    }

    protected function hasVariations(): bool
    {
        return $this->getRecord()->variations()->count() > 0;
    }

    protected function getVariationFields(): array
    {
        return [
            TextInput::make('id')
                ->hidden(),

            Placeholder::make('variation_name')
                ->label('Biến thể')
                ->content(function (array $state): string {
                    $optionLabels = [];

                    foreach ($state['variation_labels'] ?? [] as $typeLabel => $optionLabel) {
                        $optionLabels[] = "$typeLabel: $optionLabel";
                    }

                    return implode('<br>', $optionLabels);
                })
                ->html(),

            TextInput::make('quantity')
                ->label('Tồn kho')
                ->numeric()
                ->minValue(0)
                ->required(),

            Placeholder::make('sold_count')
                ->label('Đã bán')
                ->content(fn (array $state) => $state['sold_count'] ?? 0),
        ];
    }

    protected function getVariationOptions(): array
    {
        $product = $this->getRecord();
        $options = ['main_product' => 'Sản phẩm chính'];

        foreach ($product->variations as $variation) {
            $variationName = [];

            // Lấy thông tin biến thể
            foreach ($product->variationTypes as $type) {
                if (!is_array($variation->variation_type_option_ids)) {
                    $optionIds = json_decode($variation->variation_type_option_ids, true);
                } else {
                    $optionIds = $variation->variation_type_option_ids;
                }

                foreach ($optionIds as $optionId) {
                    $option = $type->options->firstWhere('id', $optionId);
                    if ($option) {
                        $variationName[] = "{$type->name}: {$option->name}";
                        break;
                    }
                }
            }

            $variantLabel = count($variationName) > 0
                ? implode(', ', $variationName)
                : "Biến thể #{$variation->id}";

            $options[$variation->id] = $variantLabel;
        }

        return $options;
    }

    public function getRecord(): Model
    {
        $record = static::$resource::resolveRecordRouteBinding(
            $this->getRouteKey()
        );

        // Load necessary relationships
        $record->load(['variations', 'variationTypes.options']);

        return $record;
    }

    public function updateProductStock(): void
    {
        $data = $this->form->getState();
        $product = $this->getRecord();
        $stockService = app(StockManagementService::class);

        // Cập nhật số lượng sản phẩm chính
        if (isset($data['quantity']) && $data['quantity'] !== $product->quantity) {
            $adjustment = $data['quantity'] - $product->quantity;
            $reason = $data['update_reason'] ?? 'Cập nhật tồn kho thủ công';

            $stockService->adjustStock($product, $adjustment, $reason);

            $this->notify('success', 'Cập nhật tồn kho thành công');
        }

        $this->redirect(static::getResource()::getUrl('inventory', ['record' => $product]));
    }

    public function updateVariationsStock(): void
    {
        $data = $this->form->getState();
        $product = $this->getRecord();
        $stockService = app(StockManagementService::class);

        if (!isset($data['variations']) || empty($data['variations'])) {
            return;
        }

        foreach ($data['variations'] as $variationData) {
            $variation = $product->variations()->find($variationData['id']);

            if ($variation && $variation->quantity != $variationData['quantity']) {
                $adjustment = $variationData['quantity'] - $variation->quantity;
                $reason = 'Cập nhật tồn kho biến thể thủ công';

                $stockService->adjustStock($product, $adjustment, $reason, $variation->id);
            }
        }

        $this->notify('success', 'Cập nhật tồn kho biến thể thành công');

        $this->redirect(static::getResource()::getUrl('inventory', ['record' => $product]));
    }

    public function adjustStock(): void
    {
        $data = $this->form->getState();
        $product = $this->getRecord();
        $stockService = app(StockManagementService::class);

        if (!isset($data['adjustment_type']) || !isset($data['adjustment_quantity']) || !isset($data['adjustment_reason'])) {
            return;
        }

        $variationId = $data['variation_id'] ?? null;
        if ($variationId === 'main_product') {
            $variationId = null;
        }

        // Lấy số lượng ban đầu
        if ($variationId) {
            $variation = $product->variations()->find($variationId);
            $originalQuantity = $variation ? $variation->quantity : 0;
        } else {
            $originalQuantity = $product->quantity;
        }

        $quantity = (int)$data['adjustment_quantity'];

        // Tính toán giá trị điều chỉnh
        switch ($data['adjustment_type']) {
            case 'increase':
                $adjustment = $quantity;
                break;
            case 'decrease':
                $adjustment = -$quantity;
                break;
            case 'set':
                $adjustment = $quantity - $originalQuantity;
                break;
            default:
                $adjustment = 0;
        }

        // Thực hiện điều chỉnh tồn kho
        $stockService->adjustStock($product, $adjustment, $data['adjustment_reason'], $variationId);

        // Hiển thị thông báo
        $actionLabel = match($data['adjustment_type']) {
            'increase' => 'Đã tăng tồn kho thêm',
            'decrease' => 'Đã giảm tồn kho',
            'set' => 'Đã đặt tồn kho thành',
            default => 'Đã điều chỉnh tồn kho',
        };

        $this->notify('success', "{$actionLabel} {$quantity}");

        $this->redirect(static::getResource()::getUrl('inventory', ['record' => $product]));
    }

    public function getBreadcrumbs(): array
    {
        return [];
    }

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('updateStock')
                ->label('Cập nhật tồn kho')
                ->action('updateProductStock')
                ->color('success'),

            Actions\Action::make('updateVariationsStock')
                ->label('Cập nhật biến thể')
                ->action('updateVariationsStock')
                ->color('primary')
                ->visible(fn () => $this->hasVariations()),

            Actions\Action::make('adjustStock')
                ->label('Điều chỉnh tồn kho')
                ->action('adjustStock')
                ->color('warning'),
        ];
    }
}
