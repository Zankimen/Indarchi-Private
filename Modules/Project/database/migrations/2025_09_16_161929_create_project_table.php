<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id(); 
            $table->string('nama'); 
            $table->string('deskripsi'); // ubah dari text -> string
            $table->string('client'); 
            $table->string('lokasi'); // geometry point dengan SRID 4326
            $table->date('tanggal_mulai'); 
            $table->date('tanggal_selesai'); 
            $table->float('radius'); 
            $table->string('status'); // tambahan kolom status
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
