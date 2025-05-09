<?php

namespace App\Observers;

use App\Models\Department;

class DepartmentObserver
{
    /**
     * Handle the Department "created" event.
     */
    public function created(Department $department): void
    {
        //
    }

    /**
     * Handle the Department "updated" event.
     */
    public function updated(Department $department): void
    {
        //
    }

    /**
     * Handle the Department "deleted" event.
     */
    public function deleting(Department $department)
    {
        // Kiểm tra xem department có category không
        $categoriesCount = $department->categories()->count();

        if ($categoriesCount > 0) {
            // Ghi log
            Log::warning("Không thể xóa department '{$department->name}' (ID: {$department->id}) vì có {$categoriesCount} danh mục liên kết.");

            // Hủy thao tác xóa
            return false;
        }

        return true;
    }

    /**
     * Handle the Department "restored" event.
     */
    public function restored(Department $department): void
    {
        //
    }

    /**
     * Handle the Department "force deleted" event.
     */
    public function forceDeleted(Department $department): void
    {
        //
    }
}
