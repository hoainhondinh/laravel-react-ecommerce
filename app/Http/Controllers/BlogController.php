<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use App\Models\BlogCategory;
use App\Models\BlogTag;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlogController extends Controller
{
    /**
     * Display the blog index page.
     */
    public function index()
    {
        $posts = BlogPost::with(['category', 'author', 'media'])
            ->whereNotNull('published_at')
            ->orderBy('published_at', 'desc')
            ->paginate(9);

        return Inertia::render('Blog/Index', [
            'posts' => [
                'data' => $posts->items(),
                'meta' => [
                    'current_page' => $posts->currentPage(),
                    'last_page' => $posts->lastPage(),
                    'per_page' => $posts->perPage(),
                    'total' => $posts->total(),
                    'links' => $posts->linkCollection()->toArray(),
                ],
            ],
        ]);
    }

    /**
     * Display a specific blog post.
     */
    public function show($slug)
    {
        $post = BlogPost::with(['category', 'author', 'tags', 'media'])
            ->whereNotNull('published_at')
            ->where('slug', $slug)
            ->firstOrFail();

        // Increment view count
        $post->increment('views');

        // Get related posts
        $relatedPosts = BlogPost::with(['category', 'author', 'media'])
            ->whereNotNull('published_at')
            ->where('id', '!=', $post->id)
            ->where(function ($query) use ($post) {
                $query->where('category_id', $post->category_id)
                    ->orWhereHas('tags', function ($q) use ($post) {
                        $q->whereIn('blog_tags.id', $post->tags->pluck('id'));
                    });
            })
            ->limit(3)
            ->get();

        return Inertia::render('Blog/Show', [
            'post' => $post,
            'relatedPosts' => $relatedPosts,
        ]);
    }

    /**
     * Display posts by category.
     */
    public function category($slug)
    {
        $category = BlogCategory::where('slug', $slug)->firstOrFail();

        $posts = BlogPost::with(['category', 'author', 'media'])
            ->whereNotNull('published_at')
            ->where('category_id', $category->id)
            ->orderBy('published_at', 'desc')
            ->paginate(9);

        return Inertia::render('Blog/Category', [
            'category' => $category,
            'posts' => [
                'data' => $posts->items(),
                'meta' => [
                    'current_page' => $posts->currentPage(),
                    'last_page' => $posts->lastPage(),
                    'per_page' => $posts->perPage(),
                    'total' => $posts->total(),
                    'links' => $posts->linkCollection()->toArray(),
                ],
            ],
        ]);
    }

    /**
     * Display posts by tag.
     */
    public function tag($slug)
    {
        $tag = BlogTag::where('slug', $slug)->firstOrFail();

        $posts = BlogPost::with(['category', 'author', 'media'])
            ->whereNotNull('published_at')
            ->whereHas('tags', function ($query) use ($tag) {
                $query->where('blog_tags.id', $tag->id);
            })
            ->orderBy('published_at', 'desc')
            ->paginate(9);

        return Inertia::render('Blog/Tag', [
            'tag' => $tag,
            'posts' => [
                'data' => $posts->items(),
                'meta' => [
                    'current_page' => $posts->currentPage(),
                    'last_page' => $posts->lastPage(),
                    'per_page' => $posts->perPage(),
                    'total' => $posts->total(),
                    'links' => $posts->linkCollection()->toArray(),
                ],
            ],
        ]);
    }
}
