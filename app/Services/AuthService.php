<?php

namespace App\Services;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthService
{
    public function __construct(
        protected UserService $userService,
    ) {}

    public function redirectToDashboardIfAlreadyAuthenticated()
    {
        if (Auth::check()) {
            return redirect()->intended('/dashboard')->send();
        }
    }

    public function login(LoginRequest $request): bool
    {
        $credentials = $request->validated();

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();

            return true;
        }

        return false;
    }

    public function loginWithUser(User $user)
    {
        Auth::login($user);
    }

    public function register(RegisterRequest $request): User
    {
        $credentials = $request->validated();

        // $tenant = $this->tenantService->createTenant($credentials);

        // $position = $this->positionService->createPosition('owner', $tenant->id);

        $user = $this->userService->createUser($credentials);

        // $role = $this->roleService->createRole('user', $tenant->id);

        // $user->positions()->attach($position);

        // $user->assignRole($tenant->id, $role);

        // $user->tenants()->attach($tenant->id);

        // $this->moduleService->giveRoleAllPermissionToActiveModule($role, $tenant);

        return $user;
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();
    }
}
