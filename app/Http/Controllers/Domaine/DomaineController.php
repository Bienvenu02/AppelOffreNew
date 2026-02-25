<?php

namespace App\Http\Controllers\Domaine;

use App\Models\Domaine;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class DomaineController extends Controller
{

    public function index()
    {
        return response()->json([
            'data' => Domaine::all()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:domaines,name',
        ],[
            'name.unique' => "Ce domaine existe déja en base de données",
            'name.required' => "Le champ nom de domaine est requis"
        ]);

        $domaine = Domaine::create([
            'name' => $request->name,
        ]);

        return response()->json([
            'message' => 'Domaine créé avec succès',
            'data' => $domaine
        ], 201);
    }

    public function show($id)
    {
        $domaine = Domaine::findOrFail($id);

        return response()->json([
            'data' => $domaine
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $domaine = Domaine::find($id);
        $request->validate([
            'name' => 'required|string|max:255|unique:domaines,name,' . $domaine->id,
        ],[
            'name.unique' => "Ce domaine existe déja"
        ]);

        $domaine = Domaine::findOrFail($id);
        $domaine->update([
            'name' => $request->name,
        ]);

        return response()->json([
            'message' => 'Domaine mis à jour avec succès',
            'data' => $domaine
        ], 200);
    }

    public function destroy($id)
    {
        $domaine = Domaine::find($id);

        if (!$domaine) {
            return response()->json(['message' => 'Domaine introuvable'], 404);
        }

        $domaine->delete();

        return response()->json(['message' => 'Domaine supprimé'], 200);
    }
}
