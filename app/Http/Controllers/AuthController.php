<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Services\AuthService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function showLoginForm()
    {
        $this->authService->redirectToDashboardIfAlreadyAuthenticated();

        return Inertia::render('LoginForm');
    }

    public function login(LoginRequest $request)
    {        
        $this->authService->redirectToDashboardIfAlreadyAuthenticated();

        if ($this->authService->login( $request)) {
            return redirect()->intended('/dashboard');
        }

        return back()->withErrors([
            'email' => 'The provided credentials are incorrect.',
        ])->onlyInput('email');
    }

    public function logout(Request $request)
    {
        $this->authService->logout($request);

        return redirect('/login');
    }
}
