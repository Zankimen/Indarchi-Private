<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
        ]);

        $middleware->alias([
            'require.permission' => \App\Http\Middleware\RequirePermission::class,
            'share.menu' => \App\Http\Middleware\ShareModuleMenus::class,
            'set.project.team' => \App\Http\Middleware\SetProjectTeamContext::class,
            'reset.project.team' => \App\Http\Middleware\ResetProjectTeamContext::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {

        $exceptions->render(function (NotFoundHttpException $e, $request) {
            return inertia('Error404', [
                'message' => 'Halaman tidak ditemukan.',
            ])->toResponse($request)->setStatusCode(404);
        });

    })->create();
