<?php

use App\Models\Domaine;
use App\Models\Fournisseur;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('domaine_fournisseur', function (Blueprint $table) {
            $table->foreignIdFor(Fournisseur::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Domaine::class)->constrained()->cascadeOnDelete();
            $table->primary(['fournisseur_id', 'domaine_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('domaine_fournisseur');
    }
};
