<?php

return [
    'name' => 'Blog',

    'posts' => [
        'per_page' => 12,
        'excerpt_length' => 200,
    ],

    'comments' => [
        'enabled' => true,
        'moderation' => true,
    ],

    'media' => [
        'disk' => 'public',
        'directory' => 'blog',
    ],

    'cache' => [
        'enabled' => true,
        'duration' => 3600, // 1 hour
    ],
];
