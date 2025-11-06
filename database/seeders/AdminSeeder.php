<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Modules\Peran\Models\Peran;
use Spatie\Permission\Models\Permission;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(\Modules\Peran\Database\Seeders\PermissionsSeeder::class);

        $adminRole = Peran::firstOrCreate([
            'name' => 'admin',
            'guard_name' => 'web',
        ], [
            'name' => 'admin',
            'deskripsi' => 'Administrator dengan akses penuh ke seluruh sistem',
            'guard_name' => 'web',
        ]);

        $adminRole->syncPermissions(Permission::all());

        $adminUser = User::firstOrCreate([
            'email' => 'admin@example.com',
        ], [
            'name' => 'Administrator',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
        ]);

        if (! $adminUser->hasRole('admin')) {
            $adminUser->assignRole('admin');
        }
    }
}
