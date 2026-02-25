<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DomaineFournisseur extends Model
{
    protected $table = 'domaine_fournisseur';

    protected $primaryKey = ['fournisseur_id', 'domaine_id'];
    public $incrementing = false;

    protected $fillable = [
        'fournisseur_id',
        'domaine_id',
    ];

    public function fournisseur()
    {
        return $this->belongsTo(Fournisseur::class);
    }

    public function domaine()
    {
        return $this->belongsTo(Domaine::class);
    }
}
