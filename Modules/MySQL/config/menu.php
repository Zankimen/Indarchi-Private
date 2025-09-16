<?php

return [
    [
        'title' => 'MySQL',
        'icon' => 'PackageIcon',
        'route' => '/mysql',
        'children' => [
            [
                'title' => 'Mahasiswa',
                'icon' => 'UsersIcon',
                'route' => '/mysql/mahasiswa',
            ],
            [
                'title' => 'Dosen',
                'icon' => 'UserStarIcon',
                'route' => '/mysql/dosen',
            ],
            [
                'title' => 'Mata Kuliah',
                'icon' => 'BookUserIcon',
                'route' => '/mysql/matakuliah',
            ],
            [
                'title' => 'Kuliah',
                'icon' => 'AlbumIcon',
                'route' => '/mysql/kuliah',
            ],
        ],
    ],
];
