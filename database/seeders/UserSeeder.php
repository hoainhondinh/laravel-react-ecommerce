<?php

namespace Database\Seeders;

use App\Enums\RolesEnum;
use App\Enums\VendorStatusEnum;
use App\Models\User;
use App\Models\Vendor;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'User',
            'email' => 'user@example.com',
            'password' => Hash::make('password123')
        ])->assignRole(RolesEnum::User->value);

        $user = User::factory()->create([
            'name' => 'Vendor',
            'email' => 'vendor@example.com',
            'password' => Hash::make('password123')
        ]);
        $user->assignRole(RolesEnum::Vendor->value);
        Vendor::factory()->create([
           'user_id' => $user->id,
            'status' => VendorStatusEnum::Approved,
            'store_name' => 'Vendor Store',
            'store_address' => fake()->address(),
        ]);

        $user2 = User::factory()->create([
            'name' => 'Vendor2',
            'email' => 'vendor2@example.com',
            'password' => Hash::make('password123')
        ]);
        $user2->assignRole(RolesEnum::Vendor->value);


        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password123')
        ])->assignRole(RolesEnum::Admin->value);
    }
}
