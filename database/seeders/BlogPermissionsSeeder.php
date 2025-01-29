<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class BlogPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create permissions
        $permissions = [
            'view posts',
            'create posts',
            'edit posts',
            'delete posts',
            'publish posts',
            'manage categories',
            'manage tags',
            'moderate comments',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create roles and assign permissions
        $blogAdmin = Role::create(['name' => 'blog_admin']);
        $blogAdmin->givePermissionTo($permissions);

        $editor = Role::create(['name' => 'blog_editor']);
        $editor->givePermissionTo([
            'view posts',
            'create posts',
            'edit posts',
            'publish posts',
        ]);

        $moderator = Role::create(['name' => 'blog_moderator']);
        $moderator->givePermissionTo([
            'view posts',
            'moderate comments',
        ]);
    }
}
