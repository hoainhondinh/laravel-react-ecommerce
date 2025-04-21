<?php


namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Tạo sitemap mỗi ngày vào lúc 01:00
        $schedule->command('sitemap:generate')->dailyAt('01:00');
        // Kiểm tra tồn kho thấp mỗi ngày vào lúc 8 giờ sáng
        $schedule->command('inventory:check-low-stock')->dailyAt('08:00');
        // Đồng bộ với MeiliSearch mỗi giờ
        $schedule->command('meilisearch:sync')->hourly();
    }
    protected $commands = [
        Commands\CheckLowStock::class,
        Commands\ConfigureMeiliSearchCommand::class,
        Commands\MeiliSearchHealthCheckCommand::class,
    ];
    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {

        $this->load(__DIR__ . '/Commands');
        $this->commands([
            \App\Console\Commands\ConfigureMeiliSearchCommand::class,
            \App\Console\Commands\MeiliSearchHealthCheckCommand::class,

        ]);

        require base_path('routes/console.php');
    }
}
