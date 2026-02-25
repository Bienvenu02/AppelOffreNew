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
        Schema::create('offres', function (Blueprint $table) {
            $table->id();

            $table->string('reference')->unique();

            $table->unsignedBigInteger('client_id');
            $table->foreign('client_id')->references('id')->on('clients')->onDelete('SET NULL');
            
            $table->string('intitule');

            $table->unsignedBigInteger('domaine_id');
            $table->foreign('domaine_id')->references('id')->on('domaines')->onDelete('SET NULL');
            
            $table->dateTime('date_limite_soumission');
            $table->dateTime('date_ouverture_offre')->nullable();
            $table->integer('delai_livraison');
            
            $table->text('description')->nullable();

            $table->enum('status', ['en_cours', 'gagnee', 'perdue', 'abandonnee'])->default('en_cours');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offres');
    }
};
