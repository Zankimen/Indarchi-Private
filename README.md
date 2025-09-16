# Sister - Installation and Setup Guide

## 1) Clone and Install

```bash
cp .env.example .env

mkdir -p storage/framework/{cache,cache/data,sessions,testing,views}
mkdir -p bootstrap/cache

composer install

npm install

composer dump-autoload -o
```

## 2) Configure Environment
```bash
php artisan key:generate
```

```bash
docker-compose up
```

## 3) Run Migrations (Per Module)
```bash
php artisan migrate:fresh

```

## 4) Start the Application

Start Laravel dev server:
```bash
composer run dev
```