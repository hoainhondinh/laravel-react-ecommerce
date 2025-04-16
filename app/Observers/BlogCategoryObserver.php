<?php

namespace App\Observers;

use App\Models\BlogCategory;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class BlogCategoryObserver
{
    /**
     * Xử lý sự kiện deleting của model.
     */
    public function deleting(BlogCategory $category)
    {
        // Kiểm tra xem danh mục có bài viết không
        $postsCount = $category->posts()->count();

        if ($postsCount > 0) {
            // Hủy tiến trình xóa
            throw ValidationException::withMessages([
                'category' => "Không thể xóa danh mục này vì có {$postsCount} bài viết liên kết."
            ]);
        }
    }
}
