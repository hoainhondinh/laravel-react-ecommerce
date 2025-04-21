<?php


namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Product;

class SynchronizeMeiliSearch extends Command
{
    protected $signature = 'meilisearch:sync';
    protected $description = 'Synchronize all searchable models with MeiliSearch';

    public function handle()
    {
        $this->info('Synchronizing data with MeiliSearch...');

        // Đồng bộ sản phẩm
        $this->syncModel(Product::class);

        // Thêm các models khác nếu cần

        $this->info('Synchronization completed!');
        return 0;
    }

    protected function syncModel($model)
    {
        $name = class_basename($model);
        $this->info("Syncing {$name}...");

        try {
            $model::makeAllSearchable();
            $this->info("{$name} synchronized successfully!");
        } catch (\Exception $e) {
            $this->error("Error synchronizing {$name}: " . $e->getMessage());
        }
    }
}
