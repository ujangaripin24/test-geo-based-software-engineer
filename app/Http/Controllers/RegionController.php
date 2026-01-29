<?php

namespace App\Http\Controllers;

use App\Models\Region;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RegionController extends Controller
{

    public function index(Request $request)
    {
        $query = Region::withGeoJson();

        if ($request->search) {
            $query->where('name', 'ilike', '%' . $request->search . '%');
        }

        return Inertia::render('Dashboard/RegionPage/RegionPage', [
            'regions' => $query->latest()->paginate(10)->withQueryString(),
            'filters' => $request->only(['search']),
            'types' => ['province', 'city', 'district', 'custom']
        ]);
    }
}
