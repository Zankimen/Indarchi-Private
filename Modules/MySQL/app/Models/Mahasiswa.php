<?php

namespace Modules\MySQL\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Mahasiswa extends Model
{
    use HasFactory;

    protected $table = 'mahasiswa';

    protected $fillable = [
        'nim',
        'nama',
        'alamat',
    ];

    public function kuliah()
    {
        return $this->hasMany(Kuliah::class, 'mahasiswa_id');
    }
}
