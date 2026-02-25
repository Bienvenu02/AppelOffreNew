<?php

namespace App\Http\Controllers\Equipement;

use App\Models\Equipement;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class EquipementController extends Controller
{
    public function index()
    {
        $equipements = Equipement::with('categorie')->get();

        return response()->json([
            'data' => $equipements
        ], 200);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'         => 'required|string|max:255|unique:equipements,name',
            'categorie_id' => 'nullable|exists:categories,id',
            'description'  => 'nullable|string|max:500',
        ], [
            'name.required' => "Le nom de l'équipement est requis",
            'name.unique'   => "Ce nom d'équipement existe déjà",
            'categorie_id.exists' => "La catégorie sélectionnée est invalide",
        ]);

        $equipement = Equipement::create($data);

        return response()->json([
            'message' => 'Équipement créé avec succès',
            'data'    => $equipement->load('categorie'),
        ], 201);
    }

    public function show($id)
    {
        $equipement = Equipement::with('categorie')->findOrFail($id);

        return response()->json([
            'data' => $equipement
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $equipement = Equipement::findOrFail($id);

        $request->validate([
            'name'         => 'required|string|max:255|unique:equipements,name,' . $equipement->id,
            'categorie_id' => 'nullable|exists:categories,id',
            'description'  => 'nullable|string|max:500',
        ], [
            'name.required' => "Le nom de l'équipement est requis",
            'name.unique'   => "Ce nom d'équipement existe déjà en base",
            'categorie_id.exists' => "La catégorie sélectionnée est invalide",
        ]);

        $equipement->update([
            'name'         => $request->name,
            'categorie_id' => $request->categorie_id,
            'description'  => $request->description,
        ]);

        return response()->json([
            'message' => 'Équipement mis à jour avec succès',
            'data'    => $equipement->load('categorie')
        ], 200);
    }

    public function destroy($id)
    {
        $equipement = Equipement::find($id);

        if (!$equipement) {
            return response()->json(['message' => 'Équipement introuvable'], 404);
        }

        $equipement->delete();

        return response()->json(['message' => 'Équipement supprimé'], 200);
    }
}
