<?php
//namespace App\Models;
//
//use Illuminate\Database\Eloquent\Factories\HasFactory;
//use Illuminate\Database\Eloquent\Model;
//use Illuminate\Database\Eloquent\Relations\BelongsTo;
//use Illuminate\Database\Eloquent\Relations\BelongsToMany;
//use Spatie\MediaLibrary\HasMedia;
//use Spatie\MediaLibrary\InteractsWithMedia;
//use Spatie\MediaLibrary\MediaCollections\Models\Media;
//use Spatie\Sluggable\HasSlug;
//use Spatie\Sluggable\SlugOptions;
//
//class BlogPost extends Model implements HasMedia
//{
//    use HasFactory, HasSlug, InteractsWithMedia;
//
//    protected $fillable = [
//        'title',
//        'slug',
//        'content',
//        'excerpt',
//        'featured_image',
//        'category_id',
//        'user_id',
//        'published_at',
//        'status',
//        // SEO Fields
//        'meta_title',
//        'meta_description',
//        'meta_keywords',
//        'canonical_url',
//        'og_image',
//        'structured_data',
//        'views',
//    ];
//
//    protected $casts = [
//        'published_at' => 'datetime',
//        'structured_data' => 'json',
//    ];
//
//    /**
//     * Get the options for generating the slug.
//     */
//    public function getSlugOptions() : SlugOptions
//    {
//        return SlugOptions::create()
//            ->generateSlugsFrom('title')
//            ->saveSlugsTo('slug')
//            ->doNotGenerateSlugsOnUpdate();
//    }
//
//    /**
//     * Get the route key for the model.
//     */
//    public function getRouteKeyName(): string
//    {
//        return 'slug';
//    }
//
//    /**
//     * Get the category that owns the blog post.
//     */
//    public function category(): BelongsTo
//    {
//        return $this->belongsTo(BlogCategory::class, 'category_id');
//    }
//
//    /**
//     * Get the tags for the blog post.
//     */
//    public function tags(): BelongsToMany
//    {
//        return $this->belongsToMany(BlogTag::class, 'blog_post_tag');
//    }
//
//    /**
//     * Get the author of the blog post.
//     */
//    public function author(): BelongsTo
//    {
//        return $this->belongsTo(User::class, 'user_id');
//    }
//
//    /**
//     * Scope a query to only include published posts.
//     */
////    public function scopePublished($query)
////    {
////        return $query->where('status', 'published')
////            ->where('published_at', '<=', now());
////    }
//    public function scopePublished($query)
//    {
//        return $query->where('status', 'published')
//            ->whereNotNull('published_at');
//    }
//    /**
//     * Scope a query to only include posts with the given tag.
//     */
//    public function scopeWithTag($query, $tag)
//    {
//        return $query->whereHas('tags', function ($query) use ($tag) {
//            $query->where('blog_tags.id', $tag instanceof BlogTag ? $tag->id : $tag);
//        });
//    }
//
//    /**
//     * Get the SEO title.
//     */
//    public function getSeoTitleAttribute(): string
//    {
//        return $this->meta_title ?? $this->title;
//    }
//
//    /**
//     * Get the SEO description.
//     */
//    public function getSeoDescriptionAttribute(): string
//    {
//        return $this->meta_description ?? $this->excerpt ?? substr(strip_tags($this->content), 0, 160);
//    }
//    // Đăng ký media conversions
//    public function registerMediaConversions(?Media $media = null): void
//    {
//        $this->addMediaConversion('thumb')
//            ->width(368)
//            ->height(232)
//            ->sharpen(10);
//
//        $this->addMediaConversion('featured')
//            ->width(800)
//            ->height(500)
//            ->sharpen(10);
//    }
//
//    // Accessor để lấy URL hình ảnh
//    public function getFeaturedImageAttribute()
//    {
//        $media = $this->getFirstMedia('featured_image');
//        return $media ? $media->getUrl('featured') : null;
//    }
//}


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class BlogPost extends Model implements HasMedia
{
    use HasFactory, HasSlug, InteractsWithMedia;

    protected $fillable = [
        'title',
        'slug',
        'content',
        'excerpt',
        'category_id',
        'user_id',
        'published_at',
        'status',
        // SEO Fields
        'meta_title',
        'meta_description',
        'meta_keywords',
        'canonical_url',
        'structured_data',
        'views',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'structured_data' => 'json',
    ];

    // Định nghĩa các collections media
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('featured_image')
            ->singleFile(); // Chỉ cho phép một hình ảnh

        $this->addMediaCollection('og_image')
            ->singleFile();
    }

    // Thêm accessor để tương thích với code cũ
    public function getFeaturedImageAttribute()
    {
        return $this->getFirstMediaUrl('featured_image');
    }

    public function getOgImageAttribute()
    {
        return $this->getFirstMediaUrl('og_image');
    }

    // Tạo phương thức accessor cho các biến thể
    public function getFeaturedImageThumbAttribute()
    {
        return $this->getFirstMediaUrl('featured_image', 'thumb');
    }

    // Định nghĩa các biến thể media (conversions)
    public function registerMediaConversions(Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(400)
            ->height(300)
            ->sharpen(10);

        $this->addMediaConversion('medium')
            ->width(800)
            ->height(600);
    }

    /**
     * Get the options for generating the slug.
     */
    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('title')
            ->saveSlugsTo('slug')
            ->doNotGenerateSlugsOnUpdate();
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * Get the category that owns the blog post.
     */
    public function category()
    {
        return $this->belongsTo(BlogCategory::class, 'category_id');
    }

    /**
     * Get the tags for the blog post.
     */
    public function tags()
    {
        return $this->belongsToMany(BlogTag::class, 'blog_post_tag');
    }

    /**
     * Get the author of the blog post.
     */
    public function author()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Scope a query to only include published posts.
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'published')
            ->where(function ($query) {
                $query->whereNull('published_at')
                    ->orWhere('published_at', '<=', now());
            });
    }
}
