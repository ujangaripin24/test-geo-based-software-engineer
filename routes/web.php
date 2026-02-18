<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AboutController;
use App\Http\Controllers\AssetController;
use App\Http\Controllers\MapController;
use App\Http\Controllers\OrganizationsController;
use App\Http\Controllers\RegionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserRegionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->prefix('dashboard')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/about', [AboutController::class, 'index'])->name('dashboard.about');

    Route::get('/regions', [RegionController::class, 'index'])->name('regions.index');
    Route::put('/regions/{region}', [RegionController::class, 'update'])->name('regions.update');
    Route::post('/regions', [RegionController::class, 'store'])->name('regions.store');
    Route::delete('/regions/{region}', [RegionController::class, 'destroy'])->name('regions.destroy');

    Route::get('/organizations', [OrganizationsController::class, 'index'])->name('organizations.index');
    Route::post('/organizations', [OrganizationsController::class, 'store'])->name('organizations.store');
    Route::put('/organizations/{organization}', [OrganizationsController::class, 'update'])->name('organizations.update');
    Route::delete('/organizations/{organization}', [OrganizationsController::class, 'destroy'])->name('organizations.destroy');

    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    Route::get('/users/{user}/regions', [UserRegionController::class, 'index'])->name('user-regions.index');
    Route::post('/users/{user}/regions', [UserRegionController::class, 'store'])->name('user-regions.store');

    Route::get('/api/assets/spatial', [AssetController::class, 'getSpatialAssets'])->name('assets.spatial');
    Route::get('/api/assets-geojson', [AssetController::class, 'getMapData'])->name('assets.geojson');
    Route::get('/api/assets/nearby', [AssetController::class, 'getNearbyAssets'])->name('assets.nearby');
   Route::get('/api/assets/nearest', [AssetController::class, 'getNearestAssets'])->name('assets.nearest');
   Route::get('/api/assets/pagination', [AssetController::class, 'getPaginationAssets'])->name('assets.pagination');
    Route::get('/map', [MapController::class, 'index'])->name('map.index');
    Route::get('/map-assets', [MapController::class, 'assets'])->name('map.assets');
    Route::get('/map-nearby', [MapController::class, 'nearby'])->name('map.nearby');
    Route::get('/map-nearest', [MapController::class, 'nearest'])->name('map.nearest');
    Route::get('/map-pagination', [MapController::class, 'pagination'])->name('map.pagination');
    

    Route::get('/assets', [AssetController::class, 'index'])->name('assets.index');
    Route::post('/assets', [AssetController::class, 'store'])->name('assets.store');
    Route::put('/assets/{asset}', [AssetController::class, 'update'])->name('assets.update');
    Route::delete('/assets/{asset}', [AssetController::class, 'destroy'])->name('assets.destroy');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
