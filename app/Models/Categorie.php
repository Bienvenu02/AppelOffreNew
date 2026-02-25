<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Categorie extends Model
{
    protected $fillable = [
        'name',
        'domaine_id'
    ];

    public function domaine()
    {
        return $this->belongsTo(Domaine::class);
    }
}
