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

        Schema::create('offre_services', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->integer('nombre');

            $table->longText('description')->nullable();
            $table->enum('type_service', ['fourniture', 'prestation']);

            $table->unsignedBigInteger('offre_id')->nullable();
            $table->foreign('offre_id')->references('id')->on('offres')->onDelete('CASCADE');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offre_services');
    }
};
