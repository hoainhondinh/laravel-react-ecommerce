<?php

namespace App\Console\Commands;

use App\Services\MeilisearchService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class MeiliSearchHealthCheckCommand extends Command
{
    protected $signature = 'meilisearch:health {--reset : Reset cached health status}';
    protected $description = 'Check MeiliSearch health status';

    protected $meilisearchService;

    public function __construct(MeilisearchService $meilisearchService)
    {
        parent::__construct();
        $this->meilisearchService = $meilisearchService;
    }

    public function handle()
    {
        $this->info('Checking MeiliSearch health...');

        if ($this->option('reset')) {
            $this->info('Resetting cached health status...');
            $available = $this->meilisearchService->resetHealthCheck();
        } else {
            $available = $this->meilisearchService->checkAvailability();
        }

        if ($available) {
            $this->info('MeiliSearch is available at: ' . config('scout.meilisearch.host'));

            // Get configuration status
            $config = $this->meilisearchService->getProductsIndexConfiguration();

            if ($config['available']) {
                $this->info('Products index is configured.');

                if ($this->option('verbose')) {
                    $this->outputConfiguration($config['config']);
                }
            } else {
                $this->warn('Products index is not properly configured: ' . ($config['error'] ?? 'Unknown error'));

                if ($this->confirm('Would you like to configure the products index now?', true)) {
                    $result = $this->meilisearchService->configureProductsIndex();
                    $this->info($result);
                }
            }

            return Command::SUCCESS;
        } else {
            $this->error('MeiliSearch is not available. Please check your configuration and make sure the service is running.');

            if (app()->environment('local')) {
                $this->info('If you are in a local environment, ensure MeiliSearch is installed and running.');
                $this->info('Local MeiliSearch typically runs at: http://localhost:7700');
            }

            $this->line("Current configuration:");
            $this->line("Host: " . config('scout.meilisearch.host'));
            $this->line("Key: " . (config('scout.meilisearch.key') ? 'Set' : 'Not set'));

            if ($this->confirm('Would you like to attempt to reconnect?', true)) {
                $available = $this->meilisearchService->resetHealthCheck();

                if ($available) {
                    $this->info('Successfully reconnected to MeiliSearch!');
                    return Command::SUCCESS;
                } else {
                    $this->error('Failed to reconnect to MeiliSearch.');
                    return Command::FAILURE;
                }
            }

            return Command::FAILURE;
        }
    }

    protected function outputConfiguration(array $config)
    {
        $this->info('Current configuration:');

        $this->line('Searchable attributes:');
        foreach ($config['searchableAttributes'] as $attr) {
            $this->line("  - $attr");
        }

        $this->line('Displayed attributes:');
        foreach ($config['displayedAttributes'] as $attr) {
            $this->line("  - $attr");
        }

        $this->line('Filterable attributes:');
        foreach ($config['filterableAttributes'] as $attr) {
            $this->line("  - $attr");
        }

        $this->line('Ranking rules:');
        foreach ($config['rankingRules'] as $rule) {
            $this->line("  - $rule");
        }

        $this->line('Synonyms:');
        foreach ($config['synonyms'] as $term => $synonyms) {
            $this->line("  - $term: " . implode(', ', $synonyms));
        }
    }
}
