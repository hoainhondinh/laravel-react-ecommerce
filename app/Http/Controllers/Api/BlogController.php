<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Models\BlogCategory;
use App\Models\BlogTag;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    public function index(Request $request)    {
        $posts = BlogPost::with(['category', 'author', 'tags'])
            ->where('status', 'published')
            ->where('published_at', '<=', now())
            ->orderBy('published_at', 'desc')
            ->paginate(9);

        return response()->json([
            'data' => $posts->items(),
            'meta' => [
                'current_page' => $posts->currentPage(),
                'last_page' => $posts->lastPage(),
                'per_page' => $posts->perPage(),
                'total' => $posts->total(),
            ],
        ]);
    }

    public function show($slug)
    {
        $post = BlogPost::with(['category', 'author', 'tags'])
            ->where('slug', $slug)
            ->where('status', 'published')
            ->where('published_at', '<=', now())
            ->firstOrFail();

        // Get related posts
        $relatedPosts = BlogPost::with(['category', 'author'])
            ->where('status', 'published')
            ->where('published_at', '<=', now())
            ->where('id', '!=', $post->id)
            ->where(function ($query) use ($post) {
                $query->where('category_id', $post->category_id)
                    ->orWhereHas('tags', function ($q) use ($post) {
                        $q->whereIn('blog_tags.id', $post->tags->pluck('id'));
                    });
            })
            ->limit(3)
            ->get();

        // Increment view count
        $post->increment('views');

        return response()->json([
            'post' => $post,
            'relatedPosts' => $relatedPosts,
        ]);
    }

    public function byCategory($slug)
    {
        $category = BlogCategory::where('slug', $slug)->firstOrFail();

        $posts = BlogPost::with(['category', 'author', 'tags'])
            ->where('status', 'published')
            ->where('published_at', '<=', now())
            ->where('category_id', $category->id)
            ->orderBy('published_at', 'desc')
            ->paginate(9);

        return response()->json([
            'category' => $category,
            'data' => $posts->items(),
            'meta' => [
                'current_page' => $posts->currentPage(),
                'last_page' => $posts->lastPage(),
                'per_page' => $posts->perPage(),
                'total' => $posts->total(),
            ],
        ]);
    }

    public function byTag($slug)
    {
        $tag = BlogTag::where('slug', $slug)->firstOrFail();

        $posts = BlogPost::with(['category', 'author', 'tags'])
            ->where('status', 'published')
            ->where('published_at', '<=', now())
            ->whereHas('tags', function ($query) use ($tag) {
                $query->where('blog_tags.id', $tag->id);
            })
            ->orderBy('published_at', 'desc')
            ->paginate(9);

        return response()->json([
            'tag' => $tag,
            'data' => $posts->items(),
            'meta' => [
                'current_page' => $posts->currentPage(),
                'last_page' => $posts->lastPage(),
                'per_page' => $posts->perPage(),
                'total' => $posts->total(),
            ],
        ]);
    }
}
