<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\Offre\OffreController;
use App\Http\Controllers\Client\ClientController;
use App\Http\Controllers\Domaine\DomaineController;
use App\Http\Controllers\Categorie\CategorieController;
use App\Http\Controllers\Equipement\EquipementController;
use App\Http\Controllers\Fournisseur\FournisseurController;

Route::middleware('guest')->post('login', [AuthController::class, 'doLogin']);

Route::post('/logout', [AuthController::class, 'logout']);

Route::get('/me', [AuthController::class, 'verif_auth']);

Route::get('/auth/show', [UserController::class, 'show'])->name('auth.show');
Route::post('/auth/update', [UserController::class, 'update'])->name('auth.update');

Route::resource('domaine', DomaineController::class)->except(['create', 'edit']);
Route::resource('categorie', CategorieController::class)->except(['create', 'edit']);
Route::resource('client', ClientController::class)->except(['create', 'edit']);
Route::resource('fournisseur', FournisseurController::class)->except(['create', 'edit']);
Route::resource('equipement', EquipementController::class)->except(['create', 'edit']);
Route::resource('offre', OffreController::class)->except(['create', 'edit']);
