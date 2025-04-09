<?php


namespace App\Console\Commands;

use App\Models\Product;
use App\Models\ProductVariation;
use App\Models\User;
use App\Notifications\LowStockNotification;
use App\Services\StockManagementService;
use Illuminate\Console\Command;

class CheckLowStock extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'inventory:check-low-stock {--threshold=5 : Ngưỡng số lượng tồn kho thấp}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Kiểm tra và gửi thông báo cho các sản phẩm có tồn kho thấp';

    /**
     * Execute the console command.
     */
    public function handle(StockManagementService $stockService)
    {
        $threshold = $this->option('threshold');
        $this->info("Kiểm tra sản phẩm có tồn kho thấp hơn {$threshold}...");

        $lowStockCount = $stockService->checkAllLowStock($threshold);

        if ($lowStockCount > 0) {
            $this->info("Đã tìm thấy {$lowStockCount} sản phẩm/biến thể có tồn kho thấp.");
        } else {
            $this->info("Không tìm thấy sản phẩm/biến thể nào có tồn kho thấp.");
        }

        return self::SUCCESS;
    }
}
