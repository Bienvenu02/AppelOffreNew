<?php

namespace App\Http\Controllers\Offre;

use App\Models\Offre;
use App\Models\OffreService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class OffreController extends Controller
{
    public function index()
    {
        $offres = Offre::with(['client', 'domaine', 'services'])->get();

        return response()->json([
            'data' => $offres
        ], 200);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'reference' => 'required|string|max:255|unique:offres,reference',

            'client_id' => 'required|exists:clients,id',
            'intitule' => 'required|string|max:255',

            'domaine_id' => 'required|exists:domaines,id',

            'date_limite_soumission' => 'required|date',
            'date_ouverture_offre' => 'nullable|date',

            'delai_livraison' => 'required|integer|min:1',

            'description' => 'nullable|string',

            'services' => 'required|array|min:1',
            'services.*.name' => 'required|string|max:255',
            'services.*.nombre' => 'required|integer|min:1',
            'services.*.description' => 'nullable|string',
            'services.*.type_service' => 'required|in:fourniture,prestation',

        ], [
            'reference.required' => 'La référence est obligatoire',
            'reference.unique' => "Cette référence existe déjà",

            'client_id.required' => "Le client est requis",
            'client_id.exists' => "Client invalide",

            'domaine_id.required' => "Le domaine est requis",
            'domaine_id.exists' => "Domaine invalide",

            'services.required' => "Vous devez ajouter au moins un service ou équipement",
            'services.*.name.required' => "Le nom du service/équipement est requis",
            'services.*.type_service.in' => "Le type doit être fourniture ou prestation",
        ]);

        // Création de l'offre
        $offre = Offre::create($data);

        // Ajout des services associées
        foreach ($request->services as $service) {
            OffreService::create([
                'name' => $service['name'],
                'nombre' => $service['nombre'],
                'description' => $service['description'] ?? null,
                'type_service' => $service['type_service'],
                'offre_id' => $offre->id
            ]);
        }

        return response()->json([
            'message' => 'Offre créée avec succès',
            'data' => $offre->load(['client', 'domaine', 'services'])
        ], 201);
    }

    public function show($id)
    {
        $offre = Offre::with(['client', 'domaine', 'services'])->findOrFail($id);

        return response()->json([
            'data' => $offre
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $offre = Offre::findOrFail($id);

        $data = $request->validate([
            'reference' => 'required|string|max:255|unique:offres,reference,' . $offre->id,
            'client_id' => 'required|exists:clients,id',
            'intitule' => 'required|string|max:255',
            'domaine_id' => 'required|exists:domaines,id',
            'date_limite_soumission' => 'required|date',
            'date_ouverture_offre' => 'nullable|date',
            'delai_livraison' => 'required|integer|min:1',
            'description' => 'nullable|string',

        ], [
            'reference.required' => 'La référence est obligatoire',
            'reference.unique' => "Cette référence existe déjà",
        ]);

        $offre->update($data);

        return response()->json([
            'message' => 'Offre mise à jour avec succès',
            'data' => $offre->load(['client', 'domaine', 'services'])
        ], 200);
    }

    public function destroy($id)
    {
        $offre = Offre::find($id);

        if (!$offre) {
            return response()->json(['message' => 'Offre introuvable'], 404);
        }

        $offre->delete();

        return response()->json(['message' => 'Offre supprimée'], 200);
    }
}
