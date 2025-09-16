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
        Schema::connection('mysql')->create('kuliah', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('mahasiswa_id');
            $table->foreign('mahasiswa_id')
                  ->references('id')
                  ->on('mahasiswa')
                  ->onDelete('cascade');

            $table->unsignedBigInteger('dosen_id');
            $table->foreign('dosen_id')
                  ->references('id')
                  ->on('dosen')
                  ->onDelete('cascade');

            $table->unsignedBigInteger('mata_kuliah_id');
            $table->foreign('mata_kuliah_id')
                  ->references('id')
                  ->on('mata_kuliah')
                  ->onDelete('cascade');

            $table->integer("nilai");

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::connection('mysql')->table('kuliah', function (Blueprint $table) {
            $table->dropForeign(['mahasiswa_id']);
            $table->dropForeign(['dosen_id']);
            $table->dropForeign(['mata_kuliah_id']);

            $table->dropColumn(['mahasiswa_id', 'dosen_id', 'mata_kuliah_id']);
        });

        Schema::connection('mysql')->dropIfExists('kuliah');
    }
};
