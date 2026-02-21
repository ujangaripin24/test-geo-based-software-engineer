<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class MapController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard/MapPage/MapPage');
    }
    public function assets()
    {
        return Inertia::render('Dashboard/MapPage/AssetsMap');
    }
    public function nearby()
    {
        return Inertia::render('Dashboard/MapPage/NearbyMap');
    }
    public function nearest()
    {
        return Inertia::render('Dashboard/MapPage/NearestMap');
    }
    public function pagination()
    {
        return Inertia::render('Dashboard/MapPage/PaginationMap');
    }
    public function cluster()
    {
        return Inertia::render('Dashboard/MapPage/MarkerClusterMap');
    }
    public function routeMap()
    {
        return Inertia::render('Dashboard/MapPage/LeafletRouteMap');
    }
}
