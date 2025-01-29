<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\BlogController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Blog API Routes
Route::prefix('blog')->group(function () {
    Route::get('/', [BlogController::class, 'index']);
    Route::get('/category/{slug}', [BlogController::class, 'byCategory']);
    Route::get('/tag/{slug}', [BlogController::class, 'byTag']);
    Route::get('/{slug}', [BlogController::class, 'show']);
});
