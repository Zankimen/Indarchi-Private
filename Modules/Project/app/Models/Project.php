<?php

namespace Modules\Project\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama',
        'deskripsi',
        'klien',
        'tanggal_mulai',
        'tanggal_selesai',
        'lokasi',
        'radius',
        'gambar',
    ];
}
