<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductListResource;
use App\Models\Product;
use App\Services\MeilisearchService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use MeiliSearch\Client;
use MeiliSearch\Exceptions\ApiException;

class SearchController extends Controller
{
    protected $client;
    protected $meilisearchService;

    public function __construct(MeilisearchService $meilisearchService)
    {
        $this->meilisearchService = $meilisearchService;
        $this->client = new Client(config('scout.meilisearch.host'), config('scout.meilisearch.key'));
    }

    public function index(Request $request)
    {
        $query = $request->input('q', '');

        if (empty($query)) {
            return redirect()->back();
        }

        try {
            // Check MeiliSearch health
            $this->client->health();

            // Khởi tạo builder tìm kiếm
            $searchBuilder = Product::search($query);

            // Lọc theo giá
            if ($request->has('min_price') && $request->has('max_price')) {
                $minPrice = (float) $request->input('min_price');
                $maxPrice = (float) $request->input('max_price');

                $searchBuilder->where('price', '>=', $minPrice)
                    ->where('price', '<=', $maxPrice);
            }

            // Lọc theo department
            if ($request->has('department')) {
                $searchBuilder->where('department_name', $request->input('department'));
            }

            // Lọc theo category
            if ($request->has('category')) {
                $searchBuilder->where('category_name', $request->input('category'));
            }

            // Sắp xếp
            if ($request->has('sort')) {
                $sort = $request->input('sort');

                switch ($sort) {
                    case 'price_asc':
                        $searchBuilder->orderBy('price', 'asc');
                        break;
                    case 'price_desc':
                        $searchBuilder->orderBy('price', 'desc');
                        break;
                    case 'newest':
                        $searchBuilder->orderBy('created_at', 'desc');
                        break;
                    // Thêm các tùy chọn sắp xếp khác nếu cần
                }
            }

            $products = $searchBuilder->paginate(12);

            // Lấy các facets từ Meilisearch
            $facets = [];
            if ($products->total() > 0) {
                $facetsResponse = $this->client->index('products_index')->search($query, [
                    'facets' => ['department_name', 'category_name'],
                    'limit' => 0
                ]);

                // Sửa lỗi: Truy cập thuộc tính đối tượng đúng cách
                $facets = $facetsResponse->getFacetDistribution() ?? [];
            }

            return Inertia::render('Product/Index', [
                'products' => ProductListResource::collection($products),
                'searchQuery' => $query,
                'isSearchResults' => true,
                'filters' => [
                    'min_price' => $request->input('min_price'),
                    'max_price' => $request->input('max_price'),
                    'department' => $request->input('department'),
                    'category' => $request->input('category'),
                    'sort' => $request->input('sort'),
                ],
                'facets' => $facets,
                'searchStatus' => 'success'
            ]);

        } catch (ApiException $e) {
            // Log MeiliSearch error
            Log::error('MeiliSearch API error: ' . $e->getMessage());

            // Fallback to database search
            $products = $this->fallbackDatabaseSearch($query, $request);

            return Inertia::render('Product/Index', [
                'products' => ProductListResource::collection($products),
                'searchQuery' => $query,
                'isSearchResults' => true,
                'filters' => [
                    'min_price' => $request->input('min_price'),
                    'max_price' => $request->input('max_price'),
                    'department' => $request->input('department'),
                    'category' => $request->input('category'),
                    'sort' => $request->input('sort'),
                ],
                'facets' => [],
                'searchStatus' => 'fallback'
            ]);
        }
    }

    protected function fallbackDatabaseSearch($query, Request $request)
    {
        // Basic database search fallback
        $queryBuilder = Product::query()
            ->where(function($q) use ($query) {
                $q->where('title', 'LIKE', "%{$query}%")
                    ->orWhere('description', 'LIKE', "%{$query}%");
            });

        // Apply sorting
        if ($request->has('sort')) {
            $sort = $request->input('sort');

            switch ($sort) {
                case 'price_asc':
                    $queryBuilder->orderBy('price', 'asc');
                    break;
                case 'price_desc':
                    $queryBuilder->orderBy('price', 'desc');
                    break;
                case 'newest':
                    $queryBuilder->orderBy('created_at', 'desc');
                    break;
                default:
                    $queryBuilder->orderBy('created_at', 'desc');
            }
        } else {
            $queryBuilder->orderBy('created_at', 'desc');
        }

        return $queryBuilder->paginate(12);
    }

    public function searchSuggestions(Request $request)
    {
        $query = $request->input('q', '');

        if (strlen($query) < 2) {
            return response()->json([
                'products' => [],
            ]);
        }

        try {
            // Check MeiliSearch health
            $this->client->health();

            // Tìm kiếm gợi ý với Meilisearch
            $products = Product::search($query)
                ->take(5)
                ->get()
                ->map(function($product) {
                    return [
                        'id' => $product->id,
                        'title' => $product->title,
                        'slug' => $product->slug,
                        'price' => $product->price,
                        'image' => $product->getFirstMediaUrl('images', 'thumb'),
                    ];
                });

            return response()->json([
                'products' => $products,
                'searchStatus' => 'success'
            ]);

        } catch (ApiException $e) {
            // Log error
            Log::error('MeiliSearch API error in suggestions: ' . $e->getMessage());

            // Fallback to database search for suggestions
            $products = $this->fallbackSuggestions($query);

            return response()->json([
                'products' => $products,
                'searchStatus' => 'fallback'
            ]);
        }
    }

    protected function fallbackSuggestions($query)
    {
        // Fallback to database search for suggestions
        return Product::query()
            ->where('title', 'LIKE', "%{$query}%")
            ->take(5)
            ->get()
            ->map(function($product) {
                return [
                    'id' => $product->id,
                    'title' => $product->title,
                    'slug' => $product->slug,
                    'price' => $product->price,
                    'image' => $product->getFirstMediaUrl('images', 'thumb'),
                ];
            });
    }
}
