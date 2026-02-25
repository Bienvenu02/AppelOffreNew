<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Fournisseur extends Model
{
    protected $fillable = [
        'name',
        'address',
        'email',
        'contact',
    ];

    public function domaines(): BelongsToMany{
        return $this->belongsToMany(Domaine::class);
    } 
}
