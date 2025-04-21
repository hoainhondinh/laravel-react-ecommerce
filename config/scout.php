<?php

return [
    'driver' => env('SCOUT_DRIVER', 'meilisearch'),
    'prefix' => env('SCOUT_PREFIX', ''),
    'queue' => env('SCOUT_QUEUE', false),  // Đặt thành true nếu bạn muốn sử dụng queue
    'after_commit' => true,  // Đảm bảo thay đổi DB được đồng bộ ngay lập tức
    'chunk' => [
        'searchable' => 500,
        'unsearchable' => 500,
    ],
    'soft_delete' => false,
    'identify' => env('SCOUT_IDENTIFY', false),
    'meilisearch' => [
        'host' => env('MEILISEARCH_HOST', 'http://localhost:7700'),
        'key' => env('MEILISEARCH_KEY', null),
        'index-settings' => [
            'products_index' => [
                'displayedAttributes' => ['*'],
                'searchableAttributes' => [
                    'title',
                    'searchable_title',
                    'slug',
                    'searchable_slug',
                    'description',
                    'department_name',
                    'category_name'
                ],
                'filterableAttributes' => ['price', 'department_id', 'category_id', 'status'],
                'sortableAttributes' => ['price', 'created_at'],
                'synonyms' => [
                    'yen' => ['yến', 'tổ yến'],
                    'to yen' => ['tổ yến'],
                    'rut long' => ['rút lông'],
                ],
                'typoTolerance' => [
                    'enabled' => true,
                    'minWordSizeForTypos' => [
                        'oneTypo' => 3,
                        'twoTypos' => 6,
                    ],
                ],
            ],
        ],
    ],
];
