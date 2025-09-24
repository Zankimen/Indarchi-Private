<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminRole = Role::firstOrCreate(
            [
                'name' => 'admin'],
                ['team_id' => null],
        );

        $adminUser = User::firstOrCreate(
            [
                'email' => 'admin@admin.admin',
                'name' => 'admin',
                'password' => bcrypt('admin')
            ]
        );

        if(!$adminUser->hasRole($adminRole)) {
            $adminUser->assignRole($adminRole);
        }
    }
}
