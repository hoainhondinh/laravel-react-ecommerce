<?php
namespace Database\Seeders;

use App\Enums\PermissionsEnum;
use App\Enums\RolesEnum;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class OrderPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Tạo các quyền mới nếu chưa tồn tại
        $permissions = [
            PermissionsEnum::ViewOrders->value,
            PermissionsEnum::ManageOrders->value,
            PermissionsEnum::DeleteOrders->value,
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Gán các quyền cho vai trò Admin
        $adminRole = Role::firstOrCreate(['name' => RolesEnum::Admin->value]);
        $adminRole->givePermissionTo($permissions);
    }
}
