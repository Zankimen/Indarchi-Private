<?php

namespace Modules\Project\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index() 
    {
        
        return Inertia::render('Project/ProjectIndex', [
            'users' => 'fatih'
        ]);
    }
}
