<?php

namespace Modules\Project\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Modules\Project\Database\Factories\ProjectFactory;

class Project extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'nama',
        'deskripsi',
        'client',
        'status',
        'tanggal_mulai',
        'tanggal_selesai',
        'radius',
        'lokasi'
    ];

    // protected static function newFactory(): ProjectFactory
    // {
    //     // return ProjectFactory::new();
    // }
}
