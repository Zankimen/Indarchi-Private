<?php

namespace Modules\Peran\Models;

use Spatie\Permission\Models\Role;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Peran extends Role
{
    protected $fillable = ['name', 'deskripsi', 'guard_name'];

    protected $table = 'roles';

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
                ->orWhere('deskripsi', 'like', "%{$search}%");
        });
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->guard_name)) {
                $model->guard_name = 'web';
            }
        });
    }

    public function users(): BelongsToMany
    {
        return $this->morphedByMany(
            getModelForGuard($this->attributes['guard_name'] ?? config('auth.defaults.guard')),
            'model',
            config('permission.table_names.model_has_roles'),
            config('permission.column_names.role_pivot_key'),
            config('permission.column_names.model_morph_key')
        );
    }
}
