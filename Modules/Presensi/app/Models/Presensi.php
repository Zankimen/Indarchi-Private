<?php

namespace Modules\Presensi\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Modules\Project\Models\Project;

class Presensi extends Model
{
    use HasFactory;

    protected $table = 'presensi';

    protected $fillable = [
        'user_id',
        'project_id',
        'tanggal',
        'jam_masuk',
        'jam_keluar',
        'lokasi_masuk',
        'lokasi_keluar',
        'latitude_masuk',
        'longitude_masuk',
        'latitude_keluar',
        'longitude_keluar',
        'status',
        'keterangan',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'jam_masuk' => 'datetime:H:i:s',
        'jam_keluar' => 'datetime:H:i:s',
    ];

    /**
     * Get the user that owns the attendance
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the project that the attendance belongs to
     */
    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}

