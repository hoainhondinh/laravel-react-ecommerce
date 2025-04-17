<?php

namespace App\Exports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\Exportable;

class UsersExport implements FromQuery, WithHeadings, WithMapping
{
    use Exportable;

    protected $selectedColumns;
    protected $roleFilter;

    public function __construct(array $selectedColumns = [], $roleFilter = null)
    {
        $this->selectedColumns = $selectedColumns;
        $this->roleFilter = $roleFilter;
    }

    public function query()
    {
        $query = User::query()->with('roles');

        if ($this->roleFilter) {
            $query->whereHas('roles', function ($q) {
                $q->whereIn('id', $this->roleFilter);
            });
        }

        return $query;
    }

    public function headings(): array
    {
        $allColumns = [
            'id' => 'ID',
            'name' => 'Tên',
            'email' => 'Email',
            'roles' => 'Vai trò',
            'created_at' => 'Ngày tạo'
        ];

        return array_intersect_key($allColumns, array_flip($this->selectedColumns));
    }

    public function map($user): array
    {
        $data = [];
        $mappedColumns = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'roles' => $user->roles->pluck('name')->implode(', '),
            'created_at' => $user->created_at->format('d/m/Y H:i:s')
        ];

        foreach ($this->selectedColumns as $column) {
            $data[] = $mappedColumns[$column] ?? '';
        }

        return $data;
    }
}
