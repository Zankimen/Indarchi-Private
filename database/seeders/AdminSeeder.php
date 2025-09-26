<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // Create permissions first
        $this->call(\Modules\Peran\Database\Seeders\PermissionsSeeder::class);

        // Create admin role with both name and nama fields
        $adminRole = Role::firstOrCreate([
            'name' => 'admin',
            'guard_name' => 'web'
        ], [
            'name' => 'admin',
            'nama' => 'Administrator', // This is required now
            'guard_name' => 'web'
        ]);

        // Give all permissions to admin
        $adminRole->syncPermissions(Permission::all());

        // Create admin user
        $admin = User::firstOrCreate([
            'email' => 'admin@example.com'
        ], [
            'name' => 'Administrator',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
        ]);

        // Assign role to admin user
        if (!$admin->hasRole('admin')) {
            $admin->assignRole('admin');
        }
    }
}
