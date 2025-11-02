<?php

namespace Modules\Peran\Models;

use Spatie\Permission\Models\Permission as SpatiePermission;

class Permission extends SpatiePermission
{
    protected $fillable = [
        'name',
        'guard_name',
    ];

    /**
     * Scope untuk pencarian
     */
    public function scopeSearch($query, $search)
    {
        return $query->where('name', 'like', '%'.$search.'%');
    }

    /**
     * Accessor untuk nama (compatibility dengan field nama)
     */
    public function getNamaAttribute()
    {
        return $this->name;
    }
}
