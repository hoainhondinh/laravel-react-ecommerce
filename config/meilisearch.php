<?php


return [
    /*
    |--------------------------------------------------------------------------
    | MeiliSearch Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains configuration specific to MeiliSearch integration
    | beyond what is provided by Laravel Scout. These settings will be used
    | to ensure consistent configuration across environments.
    |
    */

    /*
    |--------------------------------------------------------------------------
    | Index Settings
    |--------------------------------------------------------------------------
    |
    | These settings define how each index should be configured.
    | The arrays defined here will be used by the MeiliSearch service
    | to configure each index consistently.
    |
    */

    'indexes' => [
        'products_index' => [
            'searchable_attributes' => [
                'title',
                'slug',
                'searchable_content', // Thêm trường mới này
                'description',
                'department_name',
                'category_name'
            ],
            'displayed_attributes' => [
                'id',
                'title',
                'slug',
                'description',
                'price',
                'original_price',
                'department_name',
                'category_name',
                'image_url',
                'quantity',
                'status'
            ],
            'filterable_attributes' => [
                'price',
                'department_name',
                'category_name',
                'status'
            ],
            'ranking_rules' => [
                'words',
                'typo',
                'proximity',
                'attribute',
                'sort',
                'exactness',
            ],
            'synonyms' => [
                'yen' => ['yến', 'tổ yến', 'yến sào'],
                'to yen' => ['tổ yến', 'yến sào'],
                'yen chung' => ['yến chưng'],
                'yen tinh' => ['yến tinh'],
                'rut long' => ['rút lông'],
            ],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Cache Settings
    |--------------------------------------------------------------------------
    |
    | These settings control caching for MeiliSearch health checks
    | and other operations.
    |
    */
    'cache' => [
        'health_ttl' => env('MEILISEARCH_HEALTH_CACHE_TTL', 300),
        'health_error_ttl' => env('MEILISEARCH_HEALTH_ERROR_CACHE_TTL', 60),
    ],

    /*
    |--------------------------------------------------------------------------
    | Fallback Settings
    |--------------------------------------------------------------------------
    |
    | These settings control fallback behavior when MeiliSearch is unavailable.
    |
    */
    'fallback' => [
        'enabled' => env('MEILISEARCH_FALLBACK_ENABLED', true),
        'max_results' => env('MEILISEARCH_FALLBACK_MAX_RESULTS', 24),
    ],
];
