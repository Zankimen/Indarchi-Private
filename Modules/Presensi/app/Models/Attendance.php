<?php

namespace Modules\Presensi\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'date',
        'start_time',
        'end_time',
        'type',
    ];

    public function workers()
    {
        return $this->belongsToMany(
            \App\Models\User::class,
            'project_presensi_worker',
            'attendance_id',
            'user_id'
        )->withPivot(['project_id', 'status'])
            ->withTimestamps();
    }
}
