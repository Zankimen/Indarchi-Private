<?php

namespace Modules\MySQL\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MataKuliah extends Model
{
    use HasFactory;

    protected $table = 'mata_kuliah';

    protected $fillable = [
        'kode',
        'nama',
        'sks',
        'semester',
    ];

    public function kuliah()
    {
        return $this->hasMany(Kuliah::class, 'mata_kuliah_id');
    }
}
