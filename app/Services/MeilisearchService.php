<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use MeiliSearch\Client;
use MeiliSearch\Exceptions\ApiException;

class MeilisearchService
{
    protected $client;
    protected $isAvailable = false;

    const CACHE_KEY_HEALTH = 'meilisearch_health_status';
    const CACHE_DURATION = 300; // 5 minutes

    public function __construct()
    {
        $host = config('scout.meilisearch.host');
        $key = config('scout.meilisearch.key');
        $this->client = new Client($host, $key);

        // Check availability when the service is instantiated
        $this->checkAvailability();
    }

    /**
     * Check if MeiliSearch is available and cache the result
     *
     * @return bool
     */
    public function checkAvailability()
    {
        // Check if we have a cached result
        if (Cache::has(self::CACHE_KEY_HEALTH)) {
            $this->isAvailable = Cache::get(self::CACHE_KEY_HEALTH);
            return $this->isAvailable;
        }

        try {
            $health = $this->client->health();
            $this->isAvailable = $health['status'] === 'available';

            // Cache the result
            Cache::put(self::CACHE_KEY_HEALTH, $this->isAvailable, self::CACHE_DURATION);

            return $this->isAvailable;
        } catch (\Exception $e) {
            Log::error('MeiliSearch health check failed: ' . $e->getMessage());

            $this->isAvailable = false;
            Cache::put(self::CACHE_KEY_HEALTH, false, 60); // Cache for shorter time on failure

            return false;
        }
    }

    /**
     * Reset health cache and check availability again
     *
     * @return bool
     */
    public function resetHealthCheck()
    {
        Cache::forget(self::CACHE_KEY_HEALTH);
        return $this->checkAvailability();
    }

    /**
     * Get the MeiliSearch client instance
     *
     * @return Client
     */
    public function getClient()
    {
        return $this->client;
    }

    /**
     * Check if MeiliSearch is available
     *
     * @return bool
     */
    public function isAvailable()
    {
        return $this->isAvailable;
    }

    /**
     * Configure the products index
     *
     * @return string
     */
    public function configureProductsIndex()
    {
        if (!$this->isAvailable) {
            $available = $this->resetHealthCheck();
            if (!$available) {
                Log::error('Cannot configure MeiliSearch index: service unavailable');
                return "Không thể cấu hình: MeiliSearch không khả dụng";
            }
        }

        try {
            $index = $this->client->index('products_index');
            $config = config('meilisearch.indexes.products_index');

            // Cấu hình các trường có thể tìm kiếm
            $index->updateSearchableAttributes($config['searchable_attributes']);

            // Cấu hình trường hiển thị
            $index->updateDisplayedAttributes($config['displayed_attributes']);

            // Cấu hình các trường có thể lọc
            $index->updateFilterableAttributes($config['filterable_attributes']);

            // Cấu hình thứ tự kết quả
            $index->updateRankingRules($config['ranking_rules']);

            // Thiết lập đồng nghĩa
            $index->updateSynonyms($config['synonyms']);

            return "Đã cấu hình xong index products_index";
        } catch (ApiException $e) {
            Log::error('MeiliSearch configuration failed: ' . $e->getMessage());
            return "Lỗi cấu hình MeiliSearch: " . $e->getMessage();
        }
    }

    /**
     * Configure all indexes defined in the configuration
     *
     * @return array
     */
    public function configureAllIndexes()
    {
        if (!$this->isAvailable) {
            $available = $this->resetHealthCheck();
            if (!$available) {
                Log::error('Cannot configure MeiliSearch indexes: service unavailable');
                return ["status" => "error", "message" => "MeiliSearch không khả dụng"];
            }
        }

        $results = [];

        foreach (config('meilisearch.indexes') as $indexName => $config) {
            try {
                $index = $this->client->index($indexName);

                // Configure search attributes
                $index->updateSearchableAttributes($config['searchable_attributes']);

                // Configure display attributes
                $index->updateDisplayedAttributes($config['displayed_attributes']);

                // Configure filterable attributes
                $index->updateFilterableAttributes($config['filterable_attributes']);

                // Configure ranking rules
                $index->updateRankingRules($config['ranking_rules']);

                // Configure synonyms
                $index->updateSynonyms($config['synonyms']);

                $results[$indexName] = ["status" => "success"];
            } catch (ApiException $e) {
                Log::error("Error configuring {$indexName}: " . $e->getMessage());
                $results[$indexName] = [
                    "status" => "error",
                    "message" => $e->getMessage()
                ];
            }
        }

        return $results;
    }

    /**
     * Get configuration status of the products index
     *
     * @return array
     */
    public function getProductsIndexConfiguration()
    {
        if (!$this->isAvailable) {
            return [
                'available' => false,
                'error' => 'MeiliSearch không khả dụng'
            ];
        }

        try {
            $index = $this->client->index('products_index');

            return [
                'available' => true,
                'config' => [
                    'searchableAttributes' => $index->getSearchableAttributes(),
                    'displayedAttributes' => $index->getDisplayedAttributes(),
                    'filterableAttributes' => $index->getFilterableAttributes(),
                    'rankingRules' => $index->getRankingRules(),
                    'synonyms' => $index->getSynonyms(),
                ]
            ];
        } catch (ApiException $e) {
            Log::error('Cannot get MeiliSearch configuration: ' . $e->getMessage());

            return [
                'available' => false,
                'error' => $e->getMessage()
            ];
        }
    }
}
