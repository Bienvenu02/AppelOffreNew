<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Offre extends Model
{
    protected $fillable = [
        'reference',
        'client_id',
        'intitule',
        'domaine_id',
        'date_limite_soumission',
        'date_ouverture_offre',
        'delai_livraison',
        'description',
        'status',
    ];

    protected $casts = [
        'date_limite_soumission' => 'datetime',
        'date_ouverture_offre' => 'datetime',
        'delai_livraison' => 'integer',
    ];

    public function services()
    {
        return $this->hasMany(OffreService::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function domaine()
    {
        return $this->belongsTo(Domaine::class);
    }
}
