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
}
