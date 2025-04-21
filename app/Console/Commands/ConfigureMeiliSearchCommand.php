<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\MeilisearchService;
use Illuminate\Support\Facades\Log;
use MeiliSearch\Exceptions\ApiException;

class ConfigureMeiliSearchCommand extends Command
{
    protected $signature = 'meilisearch:configure {--reset : Reset the indexes before configuration} {--index= : Configure specific index only}';
    protected $description = 'Configure MeiliSearch indexes with proper settings from config';

    protected $meilisearchService;

    public function __construct(MeilisearchService $meilisearchService)
    {
        parent::__construct();
        $this->meilisearchService = $meilisearchService;
    }

    public function handle()
    {
        $this->info('Starting MeiliSearch configuration...');

        // Check if MeiliSearch is accessible
        if (!$this->meilisearchService->isAvailable()) {
            if (!$this->meilisearchService->resetHealthCheck()) {
                $this->error('Could not connect to MeiliSearch. Please make sure MeiliSearch is running at: ' . config('scout.meilisearch.host'));

                if (app()->environment('local')) {
                    $this->info('If you are in a local environment, ensure MeiliSearch is installed and running.');
                    $this->info('You can start MeiliSearch using Docker:');
                    $this->info('docker-compose -f docker-compose.meilisearch.yml up -d');
                }

                return 1;
            }
        }

        // Get the index configuration from config file
        $indexConfigs = config('meilisearch.indexes', []);

        if (empty($indexConfigs)) {
            $this->error('No index configurations found in config/meilisearch.php');
            return 1;
        }

        // Reset indexes if --reset flag is used
        if ($this->option('reset')) {
            if ($this->confirm('This will delete and recreate all indexes. Continue?', false)) {
                $this->resetIndexes($indexConfigs);
            }
        }

        // Configure specific index or all indexes
        $indexOption = $this->option('index');
        if ($indexOption) {
            if (!isset($indexConfigs[$indexOption])) {
                $this->error("Index '{$indexOption}' not found in config/meilisearch.php");
                return 1;
            }

            $result = $this->configureIndex($indexOption, $indexConfigs[$indexOption]);
            $this->outputResult($indexOption, $result);
        } else {
            // Configure all indexes
            $results = [];
            foreach ($indexConfigs as $indexName => $config) {
                $result = $this->configureIndex($indexName, $config);
                $results[$indexName] = $result;
                $this->outputResult($indexName, $result);
            }
        }

        $this->info('MeiliSearch configuration completed.');
        return 0;
    }

    protected function resetIndexes(array $indexConfigs)
    {
        $this->info('Resetting indexes...');
        $client = $this->meilisearchService->getClient();

        foreach (array_keys($indexConfigs) as $indexName) {
            try {
                $client->deleteIndex($indexName);
                $this->info("Index '{$indexName}' deleted.");
            } catch (ApiException $e) {
                $this->warn("Index '{$indexName}' could not be deleted: " . $e->getMessage());
            }

            try {
                $client->createIndex($indexName, ['primaryKey' => 'id']);
                $this->info("Index '{$indexName}' recreated.");
            } catch (ApiException $e) {
                $this->error("Index '{$indexName}' could not be created: " . $e->getMessage());
            }
        }

        // Get the models that need to be re-indexed
        $models = $this->getModelsForIndexes(array_keys($indexConfigs));

        if (!empty($models)) {
            $this->info('Repopulating indexes with data...');
            foreach ($models as $model) {
                $this->call('scout:import', ['model' => $model]);
            }
        }
    }

    protected function getModelsForIndexes(array $indexNames)
    {
        // Map between index names and Laravel model classes
        // You may need to customize this based on your application
        $indexToModelMap = [
            'products_index' => 'App\\Models\\Product',
            // Add more mappings as needed
        ];

        $models = [];
        foreach ($indexNames as $indexName) {
            if (isset($indexToModelMap[$indexName])) {
                $models[] = $indexToModelMap[$indexName];
            }
        }

        return $models;
    }

    protected function configureIndex(string $indexName, array $config)
    {
        $this->info("Configuring index '{$indexName}'...");

        try {
            $client = $this->meilisearchService->getClient();
            $index = $client->index($indexName);

            // Configure searchable attributes
            if (isset($config['searchable_attributes'])) {
                $index->updateSearchableAttributes($config['searchable_attributes']);
                $this->line("  ✓ Updated searchable attributes");
            }

            // Configure displayed attributes
            if (isset($config['displayed_attributes'])) {
                $index->updateDisplayedAttributes($config['displayed_attributes']);
                $this->line("  ✓ Updated displayed attributes");
            }

            // Configure filterable attributes
            if (isset($config['filterable_attributes'])) {
                $index->updateFilterableAttributes($config['filterable_attributes']);
                $this->line("  ✓ Updated filterable attributes");
            }

            // Configure ranking rules
            if (isset($config['ranking_rules'])) {
                $index->updateRankingRules($config['ranking_rules']);
                $this->line("  ✓ Updated ranking rules");
            }

            // Configure synonyms
            if (isset($config['synonyms'])) {
                $index->updateSynonyms($config['synonyms']);
                $this->line("  ✓ Updated synonyms");
            }

            return [
                'status' => 'success',
                'message' => "Index '{$indexName}' configured successfully"
            ];
        } catch (ApiException $e) {
            Log::error("Error configuring MeiliSearch index '{$indexName}': " . $e->getMessage());
            return [
                'status' => 'error',
                'message' => $e->getMessage()
            ];
        }
    }

    protected function outputResult(string $indexName, array $result)
    {
        if ($result['status'] === 'success') {
            $this->info($result['message']);
        } else {
            $this->error("Failed to configure index '{$indexName}': " . $result['message']);
        }
    }
}
