<?php

namespace App\Filament\Resources\ProductResource\Pages;

use App\Enums\ProductVariationTypeEnum;
use App\Filament\Resources\ProductResource;
use Filament\Actions;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Database\Eloquent\Model;

class ProductVariations extends EditRecord
{
    protected static string $resource = ProductResource::class;

    protected static ?string $title = 'Variations';
    protected static ?string $navigationIcon = 'heroicon-o-clipboard-document-list';

    public function form(Form $form): Form
    {
        $types = $this->record->variationTypes;
        $fields = [];
        foreach ($types as $type) {
            $fields[] = TextInput::make('variation_type_' . ($type->id) . '.id')
                ->hidden();
            $fields[] = TextInput::make('variation_type_' . ($type->id) . '.name')
                ->label($type->name);
        }
        return $form
            ->schema([
                Repeater::make('variations')
                    ->label(false)
                    ->collapsible()
                    ->addable(false)
                    ->defaultItems(1)
                    ->schema([
                        Section::make()
                            ->schema($fields)
                            ->columns(3),
                        TextInput::make('original_price')
                            ->label('Giá gốc')
                            ->numeric()
                            ->afterStateUpdated(function (callable $set, $state, callable $get) {
                                // Tự động tính giá khuyến mãi nếu có % giảm
                                $discountPercent = $get('discount_percent');
                                if ($discountPercent && $state) {
                                    $discountedPrice = $state * (1 - $discountPercent / 100);
                                    $set('price', round($discountedPrice, -3));
                                }
                            }),
                        TextInput::make('price')
                            ->label('Giá bán')
                            ->numeric()
                            ->required(),
                        TextInput::make('discount_percent')
                            ->label('% Giảm giá')
                            ->numeric()
                            ->dehydrated(false) // Không lưu vào DB, chỉ tính toán
                            ->reactive()
                            ->afterStateUpdated(function (callable $set, $state, callable $get) {
                                $originalPrice = $get('original_price');
                                if ($originalPrice && $state) {
                                    $discountedPrice = $originalPrice * (1 - $state / 100);
                                    $set('price', round($discountedPrice, -3));
                                }
                            }),
                        TextInput::make('quantity')
                            ->label('Số lượng')
                            ->numeric(),
                        TextInput::make('sold_count')
                            ->label('Đã bán')
                            ->numeric()
                            ->default(0),
                    ])
                    ->columns(2)
                    ->columnSpan(2)
            ]);
    }

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        $variations = $this->record->variations->toArray();
        $data['variations'] = $this->mergeCartesianWithExisting($this->record->variationTypes, $variations);
        return $data;
    }

    private function mergeCartesianWithExisting($variationTypes, $existingData): array
    {
        $defaultQuantity = $this->record->quantity;
        $defaultPrice = $this->record->price;
        $defaultOriginalPrice = $this->record->original_price ?? $defaultPrice;
        $cartesianProduct = $this->cartesianProduct($variationTypes, $defaultQuantity, $defaultPrice, $defaultOriginalPrice);
        $mergeResult = [];

        foreach ($cartesianProduct as $product) {
            //Extract option IDs from the current product combination as an array
            $optionIds = collect($product)
                ->filter(fn($value, $key) => str_starts_with($key, 'variation_type_'))
                ->map(fn($option) => $option['id'])
                ->values()
                ->toArray();

            //Find matching entry in existing data
            $match = array_filter($existingData, function ($existingOption) use ($optionIds) {
                return $existingOption['variation_type_option_ids'] === $optionIds;
            });

            //If match is found, override quantity and price
            if (!empty($match)) {
                $existingEntry = reset($match);
                $product['id'] = $existingEntry['id'];
                $product['quantity'] = $existingEntry['quantity'];
                $product['price'] = $existingEntry['price'];
                $product['original_price'] = $existingEntry['original_price'] ?? $existingEntry['price'];
                $product['sold_count'] = $existingEntry['sold_count'] ?? 0;
            } else{
                //Set default quantity and price if no match
                $product['quantity'] = $defaultQuantity;
                $product['price'] = $defaultPrice;
                $product['original_price'] = $defaultOriginalPrice;
                $product['sold_count'] = 0;
            }
            $mergeResult[] = $product;
        }
        return $mergeResult;
    }

    private function cartesianProduct($variationTypes, $defaultQuantity = null, $defaultPrice = null, $defaultOriginalPrice = null): array
    {
        $result = [[]];
        foreach ($variationTypes as $index => $variationType) {
            $temp = [];

            foreach ($variationType->options as $option) {
                // Add the current option to all existing
                foreach ($result as $combination) {
                    $newCombination = $combination + [
                            'variation_type_' . ($variationType->id) => [
                                'id' => $option->id,
                                'name' => $option->name,
                                'label' => $variationType->name,
                            ],
                        ];

                    $temp[] = $newCombination;
                }
            }
            $result = $temp;// Update result with the combinations
        }

        //Add quantity and price to completed combinations
        foreach ($result as &$combination) {
            if (count($combination) === count($variationTypes)) {
                $combination['quantity'] = $defaultQuantity;
                $combination['price'] = $defaultPrice;
                $combination['original_price'] = $defaultOriginalPrice;
                $combination['sold_count'] = 0;
            }
        }
        return $result;
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        // Initialize an array to hold the formatted data
        $formattedData = [];

        //Loop through each variation to restructure it
        foreach ($data['variations'] as $option) {
            $variationTypeOptionIds = [];
            foreach ($this->record->variationTypes as $i => $variationType) {
                $variationTypeOptionIds[] = $option['variation_type_' . ($variationType->id)]['id'];
            }

            $quantity = $option['quantity'];
            $price = $option['price'];
            $original_price = $option['original_price'] ?? $price;
            $sold_count = $option['sold_count'] ?? 0;

            // Đảm bảo id được lưu trữ nếu có
            $id = $option['id'] ?? null;

            //Prepare the data structure for the data
            $formattedData[] = [
                'id' => $id,
                'variation_type_option_ids' => $variationTypeOptionIds,
                'quantity' => $quantity,
                'price' => $price,
                'original_price' => $original_price,
                'sold_count' => $sold_count,
            ];
        }
        $data['variations'] = $formattedData;
        return $data;
    }

    protected function handleRecordUpdate(Model $record, array $data): Model
    {
        $variations = $data['variations'];
        unset($data['variations']);

        $variations = collect($variations)
            ->map(function ($variation) {
                return [
                    'id' => $variation['id'] ?? null,
                    'variation_type_option_ids' => json_encode($variation['variation_type_option_ids']),
                    'quantity' => $variation['quantity'],
                    'price' => $variation['price'],
                    'original_price' => $variation['original_price'] ?? $variation['price'],
                    'sold_count' => $variation['sold_count'] ?? 0,
                ];
            })
            ->toArray();

        $record->variations()->delete();
        $record->variations()->upsert($variations, ['id'],[
            'variation_type_option_ids', 'quantity', 'price', 'original_price', 'sold_count'
        ]);

        // Cập nhật giá sản phẩm chính dựa trên giá thấp nhất của biến thể
        $record->updatePriceFromVariations();

        return $record;
    }
}
