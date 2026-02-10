<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\Region;
use App\Services\AssetSpatialService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AssetController extends Controller
{
    protected $spatialService;

    public function __construct(AssetSpatialService $spatialService)
    {
        $this->spatialService = $spatialService;
    }

    public function index(Request $request)
    {
        $user = Auth::user();
        $query = Asset::with(['region', 'organization'])->withGeoJson();

        if ($user->role !== 'super_admin') {
            $query->where('organization_id', $user->organization_id);
            $assignedRegionIds = $user->regions()->pluck('regions.id');
            $query->whereIn('region_id', $assignedRegionIds);
        }

        if ($request->search) {
            $query->where('name', 'ilike', '%' . $request->search . '%');
        }

        if ($request->category) {
            $query->where('category', $request->category);
        }

        return Inertia::render('Dashboard/AssetPage/AssetPage', [
            'assets' => $query->latest()->paginate(10)->withQueryString(),
            'regions' => Region::where('organization_id', $user->organization_id)->get(['id', 'name']),
            'filters' => $request->only(['search', 'category']),
            'categories' => ['road', 'bridge', 'building', 'other']
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'region_id' => 'required|exists:regions,id',
            'category' => 'required|string',
            'status' => 'required|in:active,inactive,maintenance',
            'geojson' => 'required|json',
            'meta' => 'nullable|array',
        ]);

        $this->spatialService->validateContainment($validated['geojson'], $validated['region_id']);

        $asset = new Asset();
        $asset->name = $validated['name'];
        $asset->category = $validated['category'];
        $asset->status = $validated['status'];
        $asset->region_id = $validated['region_id'];
        $asset->organization_id = $user->organization_id;

        $asset->meta = $validated['meta'] ?? [];

        $asset->geom = DB::raw("ST_SetSRID(ST_GeomFromGeoJSON('" . $validated['geojson'] . "'), 4326)");

        $asset->save();

        return redirect()->back()->with('success', 'Asset berhasil ditambahkan.');
    }

    public function update(Request $request, Asset $asset)
    {
        $user = Auth::user();

        if ($user->role !== 'super_admin' && $asset->organization_id !== $user->organization_id) {
            abort(403, 'Anda tidak memiliki akses untuk mengubah aset ini.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'region_id' => 'required|exists:regions,id',
            'category' => 'required|string',
            'status' => 'required|in:active,inactive,maintenance',
            'geojson' => 'required|json',
            'meta' => 'nullable|array',
        ]);

        $this->spatialService->validateContainment($validated['geojson'], $validated['region_id']);

        $asset->name = $validated['name'];
        $asset->category = $validated['category'];
        $asset->status = $validated['status'];
        $asset->region_id = $validated['region_id'];
        $asset->meta = $validated['meta'] ?? [];

        $asset->geom = DB::raw("ST_SetSRID(ST_GeomFromGeoJSON('" . $validated['geojson'] . "'), 4326)");

        $asset->save();

        return redirect()->back()->with('success', 'Asset berhasil diperbarui.');
    }

    public function destroy(Asset $asset)
    {
        if (Auth::user()->role !== 'super_admin' && $asset->organization_id !== Auth::user()->organization_id) {
            abort(403);
        }

        $asset->delete();
        return redirect()->back()->with('success', 'Asset berhasil dihapus.');
    }
}
