<?php

namespace App\Http\Controllers;

use App\Models\Region;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RegionController extends Controller
{

    public function index(Request $request)
    {
        $query = Region::withGeoJson();

        if (Auth::user()->role !== 'super_admin') {
            $query->where('organization_id', Auth::user()->organization_id);
        }

        if ($request->search) {
            $query->where('name', 'ilike', '%' . $request->search . '%');
        }

        return Inertia::render('Dashboard/RegionPage/RegionPage', [
            'regions' => $query->latest()->paginate(10)->withQueryString(),
            'filters' => $request->only(['search']),
            'types' => ['province', 'city', 'district', 'custom']
        ]);
    }

    public function update(Request $request, Region $region)
    {
        if (Auth::user()->role !== 'super_admin' && $region->organization_id !== Auth::user()->organization_id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:province,city,district,custom',
            'geojson' => 'required|json',
        ]);

        $region->name = $validated['name'];
        $region->type = $validated['type'];
        $region->geom = DB::raw("ST_GeomFromGeoJSON('" . $validated['geojson'] . "')");
        $region->save();

        return redirect()->back()->with('success', 'Region updated.');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:province,city,district,custom',
            'geojson' => 'required|json',
        ]);

        $region = new Region();
        $region->name = $validated['name'];
        $region->type = $validated['type'];

        $region->geom = DB::raw("ST_SetSRID(ST_GeomFromGeoJSON('" . $validated['geojson'] . "'), 4326)");

        $region->save();

        return redirect()->back()->with('success', 'Region berhasil disimpan.');
    }

    public function destroy(Region $region)
    {
        $region->delete();
        return redirect()->back()->with('success', 'Region dihapus.');
    }
}
