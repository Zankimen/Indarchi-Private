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
            // User Management
            'user.view',
            'user.create',
            'user.edit',
            'user.delete',

            // Role Management
            'role.view',
            'role.create',
            'role.edit',
            'role.delete',

            // Worker Management
            'worker.view',
            'worker.create',
            'worker.edit',
            'worker.delete',

            // Project Management
            'project.view',
            'project.create',
            'project.edit',
            'project.delete',

            // Attendance Management
            'attendance.view',
            'attendance.create',
            'attendance.edit',
            'attendance.delete',

            // Reports
            'report.view',
            'report.export',

            // Settings
            'settings.view',
            'settings.edit',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web'
            ]);
        }
    }
}
