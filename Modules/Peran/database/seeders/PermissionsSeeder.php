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
            // Dashboard Access
            [
                'name' => 'dashboard.view',
                'label' => 'Akses Dashboard',
                'description' => 'Dapat mengakses halaman dashboard utama',
            ],

            // Role Management (Dashboard Global)
            [
                'name' => 'dashboard.role.view',
                'label' => 'Lihat Daftar Peran',
                'description' => 'Dapat melihat daftar peran di dashboard',
            ],
            [
                'name' => 'dashboard.role.manage',
                'label' => 'Kelola Peran',
                'description' => 'Dapat menambah, mengubah, dan menghapus peran di dashboard',
            ],

            // Worker Management (Dashboard Global)
            [
                'name' => 'dashboard.worker.view',
                'label' => 'Lihat Daftar Pekerja',
                'description' => 'Dapat melihat daftar pekerja di dashboard',
            ],
            [
                'name' => 'dashboard.worker.manage',
                'label' => 'Kelola Pekerja',
                'description' => 'Dapat menambah, mengubah, dan menghapus pekerja di dashboard',
            ],

            // Project Management (Dashboard Global)
            [
                'name' => 'dashboard.project.view',
                'label' => 'Lihat Daftar Proyek',
                'description' => 'Dapat melihat daftar proyek di dashboard',
            ],
            [
                'name' => 'dashboard.project.fullview',
                'label' => 'Lihat Detail Lengkap Proyek',
                'description' => 'Dapat melihat semua detail dan informasi proyek',
            ],
            [
                'name' => 'dashboard.project.manage',
                'label' => 'Kelola Proyek',
                'description' => 'Dapat menambah, mengubah, dan menghapus proyek di dashboard',
            ],
            [
                'name' => 'dashboard.project.can.be.added',
                'label' => 'Dapat Ditambahkan ke Proyek',
                'description' => 'Pengguna dapat ditambahkan sebagai anggota proyek',
            ],

            // Project Local - Project Management
            [
                'name' => 'project.project.view',
                'label' => 'Lihat Detail Proyek (Lokal)',
                'description' => 'Dapat melihat detail proyek yang ditugaskan',
            ],
            [
                'name' => 'project.project.manage',
                'label' => 'Kelola Proyek (Lokal)',
                'description' => 'Dapat mengelola proyek yang ditugaskan',
            ],

            // Project Local - Worker Management
            [
                'name' => 'project.worker.view',
                'label' => 'Lihat Anggota Proyek',
                'description' => 'Dapat melihat daftar anggota dalam proyek',
            ],
            [
                'name' => 'project.worker.manage',
                'label' => 'Kelola Anggota Proyek',
                'description' => 'Dapat menambah dan menghapus anggota proyek',
            ],

            // Project Local - Role Management
            [
                'name' => 'project.role.view',
                'label' => 'Lihat Peran Proyek',
                'description' => 'Dapat melihat daftar peran dalam proyek',
            ],
            [
                'name' => 'project.role.manage',
                'label' => 'Kelola Peran Proyek',
                'description' => 'Dapat menambah, mengubah, dan menghapus peran dalam proyek',
            ],
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                ['name' => $permission['name'], 'guard_name' => 'web'],
                [
                    'name' => $permission['name'],
                    'guard_name' => 'web',
                ]
            );
        }
    }
}
