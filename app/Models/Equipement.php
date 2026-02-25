<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Equipement extends Model
{
    protected $fillable = [
        'name',
        'categorie_id',
        'description'
    ];

    public function categorie(): BelongsTo{
        return $this->belongsTo(Categorie::class);
    }
}
