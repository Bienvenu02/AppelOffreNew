<?php

namespace App\Http\Controllers\Categorie;

use App\Models\Categorie;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CategorieController extends Controller
{
    public function index()
    {
        $categories = Categorie::with('domaine')->get();

        return response()->json([
            'data' => $categories
        ], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'domaine_id' => 'required|exists:domaines,id',
        ],[
            'name.required' => "Le nom de la categorie est requis",
            'domaine_id.required' => "Le nom de domaine est requis",
            'domaine_id.exists' => "Ce domaine n'existe pas",
            'name.unique' => "Ce nom de categorie existe déja"
        ]);

        $categorie = Categorie::create([
            'name' => $request->name,
            'domaine_id' => $request->domaine_id,
        ]);

        return response()->json([
            'message' => 'Catégorie créée avec succès',
            'data' => $categorie
        ], 201);
    }

    public function show($id)
    {
        $categorie = Categorie::with('domaine')->findOrFail($id);

        return response()->json([
            'data' => $categorie
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $categorie = Categorie::find($id);
        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,'.$categorie->id,
            'domaine_id' => 'required|exists:domaines,id',
        ],[
            'name.required' => "Le nom de la categorie est requis",
            'name.unique' => "Le nom de la categorie existe deja en base de données",
            'domaine_id.required' => "Le nom de domaine est requis",
            'domaine_id.exists' => "Le domaine n'existe pas"
        ]);

        $categorie = Categorie::findOrFail($id);
        
        $categorie->update([
            'name' => $request->name,
            'domaine_id' => $request->domaine_id,
        ]);

        return response()->json([
            'message' => 'Catégorie mise à jour avec succès',
            'data' => $categorie
        ], 200);
    }

    public function destroy($id)
    {
        $categorie = Categorie::find($id);

        if (!$categorie) {
            return response()->json(['message' => 'Catégorie introuvable'], 404);
        }

        $categorie->delete();

        return response()->json(['message' => 'Catégorie supprimée'], 200);
    }
}
