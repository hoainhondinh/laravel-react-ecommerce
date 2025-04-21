<?php

require 'vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Product;
use MeiliSearch\Client;

// Lấy dữ liệu sản phẩm
$products = Product::all()->toArray();
echo "Found " . count($products) . " products\n";

// Kết nối MeiliSearch
$client = new Client('http://localhost:7700', 'masterKey');

// Kiểm tra index
try {
    $index = $client->index('products_index');
} catch (\Exception $e) {
    echo "Creating index...\n";
    $index = $client->createIndex('products_index', ['primaryKey' => 'id']);
}

// Thêm documents
try {
    $response = $index->addDocuments($products);
    echo "Added documents. Response: " . json_encode($response) . "\n";
} catch (\Exception $e) {
    echo "Error adding documents: " . $e->getMessage() . "\n";
}
