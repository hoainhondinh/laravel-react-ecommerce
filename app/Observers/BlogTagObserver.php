<?php

namespace App\Observers;

use App\Models\BlogTag;

class BlogTagObserver
{
    /**
     * Handle the BlogTag "created" event.
     */
    public function created(BlogTag $blogTag): void
    {
        //
    }

    /**
     * Handle the BlogTag "updated" event.
     */
    public function updated(BlogTag $blogTag): void
    {
        //
    }

    /**
     * Handle the BlogTag "deleted" event.
     */
    public function deleting(BlogTag $tag)
    {
        // Kiểm tra xem tag có liên kết với bài viết không
        $postsCount = $tag->posts()->count();

        if ($postsCount > 0) {
            throw ValidationException::withMessages([
                'tag' => "Không thể xóa tag này vì có {$postsCount} bài viết liên kết."
            ]);
        }
    }

    /**
     * Handle the BlogTag "restored" event.
     */
    public function restored(BlogTag $blogTag): void
    {
        //
    }

    /**
     * Handle the BlogTag "force deleted" event.
     */
    public function forceDeleted(BlogTag $blogTag): void
    {
        //
    }
}
