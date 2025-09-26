<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Menambahkan kolom nama jika belum ada, atau bisa skip jika sudah menggunakan name
        // Opsi 1: Tambah kolom nama (jika ingin tetap menggunakan 'nama')
        Schema::table('roles', function (Blueprint $table) {
            if (!Schema::hasColumn('roles', 'nama')) {
                $table->string('nama')->after('name')->nullable();
            }
        });

        // Copy data dari name ke nama
        \Illuminate\Support\Facades\DB::statement('UPDATE roles SET nama = name WHERE nama IS NULL');

        // Buat kolom nama required
        Schema::table('roles', function (Blueprint $table) {
            $table->string('nama')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('roles', function (Blueprint $table) {
            $table->dropColumn('nama');
        });
    }
};
