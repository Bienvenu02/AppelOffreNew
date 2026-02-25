<?php

namespace App\Http\Controllers\Fournisseur;

use App\Models\Fournisseur;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class FournisseurController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => Fournisseur::with('domaines')->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'      => 'required|string|max:255|unique:fournisseurs,name',
            'address'   => 'required|string|max:255',
            'email'     => 'nullable|email|max:255|unique:fournisseurs,email',
            'contact'   => 'nullable|string|max:50',

            'domaines'  => 'nullable|array',
            'domaines.*'=> 'exists:domaines,id',
        ],[
            'name.unique'   => "Ce fournisseur existe déjà",
            'name.required' => "Le nom du fournisseur est requis",
            'email.unique' => "Ce mail existe déjà",
            'address.required' => "L'adresse est requise",
            'domaines.*.exists' => "Domaine invalide"
        ]);

        $fournisseur = Fournisseur::create([
            'name'    => $request->name,
            'address' => $request->address,
            'email'   => $request->email,
            'contact' => $request->contact,
        ]);

        if ($request->has('domaines')) {
            $fournisseur->domaines()->attach($request->domaines);
        }

        return response()->json([
            'message' => 'Fournisseur créé avec succès',
            'data'    => $fournisseur->load('domaines')
        ], 201);
    }

    public function show($id)
    {
        $fournisseur = Fournisseur::with('domaines')->findOrFail($id);

        return response()->json([
            'data' => $fournisseur
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $fournisseur = Fournisseur::findOrFail($id);

        $request->validate([
            'name'      => 'required|string|max:255|unique:fournisseurs,name,' . $fournisseur->id,
            'address'   => 'required|string|max:255',
            'email'     => 'nullable|email|max:255|unique:fournisseurs,email,' . $fournisseur->id,
            'contact'   => 'nullable|string|max:50',

            'domaines'  => 'nullable|array',
            'domaines.*'=> 'exists:domaines,id',
        ],[
            'name.unique' => "Ce fournisseur existe déjà",
            'domaines.*.exists' => "Domaine invalide"
        ]);

        $fournisseur->update([
            'name'    => $request->name,
            'address' => $request->address,
            'email'   => $request->email,
            'contact' => $request->contact,
        ]);

        // 🔥 Synchroniser les domaines (remplace les anciens)
        if ($request->has('domaines')) {
            $fournisseur->domaines()->sync($request->domaines);
        }

        return response()->json([
            'message' => 'Fournisseur mis à jour avec succès',
            'data'    => $fournisseur->load('domaines')
        ], 200);
    }

    public function destroy($id)
    {
        $fournisseur = Fournisseur::find($id);

        if (!$fournisseur) {
            return response()->json(['message' => 'Fournisseur introuvable'], 404);
        }

        // Le detach est automatique grâce à cascadeOnDelete()
        $fournisseur->delete();

        return response()->json([
            'message' => 'Fournisseur supprimé'
        ], 200); 
    }
}
