<?php

namespace Modules\Peran\Models;

use Spatie\Permission\Models\Role;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Peran extends Role
{
    protected $fillable = ['name', 'nama', 'guard_name'];

    protected $table = 'roles';

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
                ->orWhere('nama', 'like', "%{$search}%");
        });
    }

    /**
     * Accessor untuk nama - prioritas menggunakan kolom nama
     */
    public function getNamaAttribute()
    {
        // Prioritas ambil dari kolom nama, fallback ke name jika kosong
        return $this->attributes['nama'] ?? $this->attributes['name'];
    }

    /**
     * Mutator untuk nama - sync dengan name field
     */
    public function setNamaAttribute($value)
    {
        $this->attributes['nama'] = $value;

        // Jika name kosong, sync dari nama
        if (empty($this->attributes['name'])) {
            $this->attributes['name'] = $value;
        }
    }

    /**
     * Override mutator name - sync dengan nama field  
     */
    public function setNameAttribute($value)
    {
        $this->attributes['name'] = $value;

        // Jika nama kosong, sync dari name
        if (empty($this->attributes['nama'])) {
            $this->attributes['nama'] = $value;
        }
    }

    /**
     * Boot method untuk ensure data consistency
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            // Pastikan name dan nama sinkron saat create
            if (empty($model->name) && !empty($model->nama)) {
                $model->name = $model->nama;
            }
            if (empty($model->nama) && !empty($model->name)) {
                $model->nama = $model->name;
            }
        });

        static::updating(function ($model) {
            // Pastikan name dan nama sinkron saat update
            if ($model->isDirty('nama') && !$model->isDirty('name')) {
                $model->name = $model->nama;
            }
            if ($model->isDirty('name') && !$model->isDirty('nama')) {
                $model->nama = $model->name;
            }
        });
    }

    /**
     * Relationship dengan users melalui model_has_roles pivot table
     */
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
