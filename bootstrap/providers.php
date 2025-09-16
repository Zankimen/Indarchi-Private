<?php

return [
    App\Providers\AppServiceProvider::class,
    App\Providers\MenuServiceProvider::class,

    // Ensure module providers are explicitly registered so bindings are available
    Modules\MySQL\Providers\MySQLServiceProvider::class,
];
