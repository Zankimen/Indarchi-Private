<?php

namespace Modules\Presensi\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PresensiController extends Controller
{
    public function index()
    {
        return Inertia::render('Presensi/PresensiIndex');
    }
}
