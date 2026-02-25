<?php

namespace App\Http\Controllers\User;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function show()
    {
        return response()->json([
            'status' => true,
            'data' => Auth::user(),
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'message' => 'Compte déconnecté'
            ], 401);
        }

        $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
        ],[
            'name.required' => "le champ nom est requis",
            'email.required' => "le champ email est requis",
            'email.unique' => "ce mail exite deja en base de données",
        ]);

        $user->update([
            'name'  => $request->name,
            'email' => $request->email,
        ]);

        return response()->json([
            'status'  => true,
            'message' => "Profil mis à jour",
            'data'    => $user,
        ], 200);
    }
}
