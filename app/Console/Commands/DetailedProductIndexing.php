<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Product;
use Illuminate\Support\Facades\Log;
use MeiliSearch\Client;

class DetailedProductIndexing extends Command
{
    protected $signature = 'products:detailed-index';
    protected $description = 'Detailed product indexing with comprehensive logging';

    public function handle()
    {
        // Kết nối MeiliSearch
        $client = new Client(
            config('scout.meilisearch.host'),
            config('scout.meilisearch.key')
        );

        // Lấy tất cả sản phẩm
        $products = Product::all();

        $this->info("Total Products: " . $products->count());

        foreach ($products as $product) {
            $this->line("\n--- Indexing Product: {$product->id} - {$product->title} ---");

            try {
                // Kiểm tra điều kiện index
                $canBeSearchable = $product->shouldBeSearchable();
                $this->info("Can Be Searchable: " . ($canBeSearchable ? 'Yes' : 'No'));

                if (!$canBeSearchable) {
                    $this->warn("Skipping product due to searchable conditions");
                    continue;
                }

                // Lấy mảng searchable
                $searchableArray = $product->toSearchableArray();

                $this->info("Searchable Array:");
                print_r($searchableArray);

                // Thực hiện index
                $result = $product->searchable();

                $this->info("Indexing Result: " . ($result ? 'Success' : 'Failed'));

                // Kiểm tra trực tiếp với MeiliSearch
                $index = $client->index('products_index');
                $indexedDocument = $index->getDocument($product->id);

                $this->info("Document in MeiliSearch:");
                print_r($indexedDocument);

            } catch (\Exception $e) {
                $this->error("Indexing Error: " . $e->getMessage());
                $this->error($e->getTraceAsString());
            }
        }

        return Command::SUCCESS;
    }
}
