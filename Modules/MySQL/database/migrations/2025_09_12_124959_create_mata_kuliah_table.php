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
        Schema::connection('mysql')->create('mata_kuliah', function (Blueprint $table) {
            $table->id();
            $table->string("kode", 10);
            $table->string("nama", 200);
            $table->integer("sks", false, true);
            $table->integer("semester", false, true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::connection('mysql')->dropIfExists('mata_kuliah');
    }
};
