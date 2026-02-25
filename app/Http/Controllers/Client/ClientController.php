<?php

namespace App\Http\Controllers\Client;

use App\Models\Client;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;


class ClientController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => Client::all()
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:clients,name',
            'sigle' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'ifu' => 'required|string|max:255',
            'contact' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
        ], [
            'name.required' => "Le nom du client est requis",
            'name.unique' => "Ce client existe déjà",
            'sigle.required' => "Le champ sigle est requis",
            'address.required' => "Le champ adresse est requis",
            'ifu.required' => "Le champ IFU est requis",
            'email.email' => "L'email doit être valide"
        ]);

        $client = Client::create($data);

        return response()->json([
            'message' => 'Client créé avec succès',
            'data' => $client
        ], 201);
    }

    // 🔥 Récupérer un client
    public function show($id)
    {
        $client = Client::findOrFail($id);

        return response()->json([
            'data' => $client
        ], 200);
    }

    // 🔥 Mise à jour d'un client
    public function update(Request $request, $id)
    {
        $client = Client::findOrFail($id);

        $data = $request->validate([
            'name' => 'required|string|max:255|unique:clients,name,' . $client->id,
            'sigle' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'ifu' => 'required|string|max:255',
            'contact' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
        ], [
            'name.unique' => "Ce client existe déjà",
            'name.required' => "Le champ nom est requis",
            'sigle.required' => "Le champ sigle est requis",
            'address.required' => "Le champ adresse est requis",
            'ifu.required' => "Le champ IFU est requis",
            'email.email' => "L'email doit être valide"
        ]);

        $client->update($data);

        return response()->json([
            'message' => 'Client mis à jour avec succès',
            'data' => $client
        ], 200);
    }

    // 🔥 Suppression d'un client
    public function destroy($id)
    {
        $client = Client::find($id);

        if (!$client) {
            return response()->json(['message' => 'Client introuvable'], 404);
        }

        $client->delete();

        return response()->json(['message' => 'Client supprimé'], 200);
    }
}
