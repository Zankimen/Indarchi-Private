<?php

namespace App\Helpers;

class PermissionDisplayHelper
{
    /**
     * Get human-readable display name for permission
     *
     * @param  string  $permissionName
     * @return string
     */
    public static function getDisplayName(string $permissionName): string
    {
        $displayNames = [
            // Dashboard Access
            'dashboard.view' => 'Akses Dashboard',

            // Role Management (Dashboard Global)
            'dashboard.role.view' => 'Lihat Daftar Peran',
            'dashboard.role.manage' => 'Kelola Peran',

            // Worker Management (Dashboard Global)
            'dashboard.worker.view' => 'Lihat Daftar Pekerja',
            'dashboard.worker.manage' => 'Kelola Pekerja',

            // Project Management (Dashboard Global)
            'dashboard.project.view' => 'Lihat Daftar Proyek',
            'dashboard.project.fullview' => 'Lihat Detail Lengkap Proyek',
            'dashboard.project.manage' => 'Kelola Proyek',
            'dashboard.project.can.be.added' => 'Dapat Ditambahkan ke Proyek',

            // Project Local - Project Management
            'project.project.view' => 'Lihat Detail Proyek (Lokal)',
            'project.project.manage' => 'Kelola Proyek (Lokal)',

            // Project Local - Worker Management
            'project.worker.view' => 'Lihat Anggota Proyek',
            'project.worker.manage' => 'Kelola Anggota Proyek',

            // Project Local - Role Management
            'project.role.view' => 'Lihat Peran Proyek',
            'project.role.manage' => 'Kelola Peran Proyek',
        ];

        return $displayNames[$permissionName] ?? $permissionName;
    }

    /**
     * Get all permissions with display names
     *
     * @param  \Illuminate\Support\Collection  $permissions
     * @return \Illuminate\Support\Collection
     */
    public static function withDisplayNames($permissions)
    {
        return $permissions->map(function ($permission) {
            return [
                'id' => $permission->id,
                'name' => $permission->name,
                'display_name' => self::getDisplayName($permission->name),
                'guard_name' => $permission->guard_name,
            ];
        });
    }

    /**
     * Get permission category from permission name
     *
     * @param  string  $permissionName
     * @return string
     */
    public static function getCategory(string $permissionName): string
    {
        $parts = explode('.', $permissionName);

        return $parts[0] ?? 'other';
    }

    /**
     * Group permissions by category
     *
     * @param  \Illuminate\Support\Collection  $permissions
     * @return array
     */
    public static function groupByCategory($permissions): array
    {
        $grouped = [];

        foreach ($permissions as $permission) {
            $category = self::getCategory($permission['name']);
            $grouped[$category][] = $permission;
        }

        return $grouped;
    }
}
