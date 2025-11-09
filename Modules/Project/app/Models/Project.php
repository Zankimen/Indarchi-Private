<?php

namespace Modules\Project\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

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
