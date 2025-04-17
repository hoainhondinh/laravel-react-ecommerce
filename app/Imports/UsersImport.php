<?php


namespace App\Imports;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Spatie\Permission\Models\Role;

class UsersImport implements ToModel, WithHeadingRow, WithValidation
{
    public function model(array $row)
    {
        $user = User::create([
            'name' => $row['name'] ?? '',
            'email' => $row['email'] ?? '',
            'password' => Hash::make($row['password'] ?? 'password123'),
        ]);

        // Gán vai trò nếu được chỉ định
        if (!empty($row['role'])) {
            $role = Role::firstOrCreate(['name' => $row['role']]);
            $user->assignRole($role);
        }

        return $user;
    }

    public function rules(): array
    {
        return [
            'email' => [
                'required',
                'email',
                'unique:users,email'
            ],
            'name' => 'required|string|max:255',
        ];
    }

    public function customValidationMessages()
    {
        return [
            'email.unique' => 'Email đã tồn tại trong hệ thống',
            'name.required' => 'Tên người dùng không được để trống',
        ];
    }
}
