<?php

use Spatie\Permission\PermissionRegistrar;

if (! function_exists('setTeamId')) {
    function setTeamId(?int $teamId = null): void
    {
        app(PermissionRegistrar::class)->setPermissionsTeamId($teamId);
    }
}

if (! function_exists('getTeamId')) {
    function getTeamId(): ?int
    {
        return app(PermissionRegistrar::class)->getPermissionsTeamId();
    }
}
