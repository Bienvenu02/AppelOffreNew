<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OffreService extends Model
{
    protected $fillable = [
        'name',
        'nombre',
        'description',
        'type_service',
        'offre_id',
    ];
}
