<?php

namespace Modules\Peran\Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            'dashboard.view',

            'dashboard.role.view',
            'dashboard.role.manage',

            'dashboard.worker.view',
            'dashboard.worker.manage',

            'dashboard.project.view',
            'dashboard.project.fullview',
            'dashboard.project.manage',

            'project.attend',
            'project.view',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ]);
        }
    }
}
