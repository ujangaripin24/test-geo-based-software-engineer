<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Models\Region;
use Inertia\Inertia;

class RegionController extends Controller
{

    public function index()
    {
        return Inertia::render('Dashboard/RegionPage/RegionPage');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'type' => 'required|in:province,city,district,custom',
            'geojson' => 'required'
        ]);

        Region::create([
            'name' => $request->input('name'),
            'type' => $request->input('type'),
            'geom' => \DB::raw("ST_GeomFromGeoJSON('" . $request->geojson . "')")
        ]);
        return back()->with('message', 'Region Succes Created');
    }
}
