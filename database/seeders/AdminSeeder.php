<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Peran\Models\Peran;
use Spatie\Permission\Models\Permission;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // Create permissions first
        $this->call(\Modules\Peran\Database\Seeders\PermissionsSeeder::class);

        // Create Admin Role
        $adminRole = Peran::firstOrCreate([
            'name' => 'admin',
            'guard_name' => 'web'
        ], [
            'name' => 'admin',
            'deskripsi' => 'Administrator dengan akses penuh ke seluruh sistem',
            'guard_name' => 'web'
        ]);

        // Give all permissions to admin
        $adminRole->syncPermissions(Permission::all());

        // Create Admin User
        $adminUser = User::firstOrCreate([
            'email' => 'admin@example.com'
        ], [
            'name' => 'Administrator',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
        ]);

        // Assign role to admin user
        if (!$adminUser->hasRole('admin')) {
            $adminUser->assignRole('admin');
        }
    }
}
