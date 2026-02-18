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
      $allowedRegionIds = $user->regions()->pluck('regions.id')->toArray();

      if (empty($allowedRegionIds)) {
        $query->whereRaw('1 = 0');
      } else {
        $query->whereIn('region_id', $allowedRegionIds);
      }
    }
    if ($request->search) {
      $query->where('name', 'ilike', '%' . $request->search . '%');
    }
    if ($request->category) {
      $query->where('category', $request->category);
    }

    return Inertia::render('Dashboard/AssetPage/AssetPage', [
      'assets' => $query->latest()->paginate(10)->withQueryString(),
      'regions' => $user->role === 'super_admin'
        ? Region::all(['id', 'name'])
        : $user->regions()->get(['regions.id', 'regions.name']),
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

  public function getMapData(Request $request)
  {
    $user = Auth::user();
    $query = Asset::query();

    if ($user->role !== 'super_admin') {
      $query->where('organization_id', $user->organization_id);

      $allowedRegionIds = $user->regions()->pluck('regions.id')->toArray();

      if (empty($allowedRegionIds)) {
        return response()->json([
          'type' => 'FeatureCollection',
          'features' => []
        ]);
      }

      $query->whereIn('region_id', $allowedRegionIds);
    }
    $assets = $query->select('*', DB::raw('ST_AsGeoJSON(geom) as geojson'))->get();
    $features = $assets->map(function ($asset) {
      return [
        'type' => 'Feature',
        'geometry' => json_decode($asset->geojson),
        'properties' => [
          'id' => $asset->id,
          'name' => $asset->name,
          'category' => $asset->category,
          'status' => $asset->status,
          'region_id' => $asset->region_id,
        ],
      ];
    });

    return response()->json([
      'type' => 'FeatureCollection',
      'features' => $features,
    ]);
  }

  public function getSpatialAssets(Request $request)
  {
    $user = Auth::user();

    $validated = $request->validate([
      'south' => 'required|numeric',
      'west'  => 'required|numeric',
      'north' => 'required|numeric',
      'east'  => 'required|numeric',
      'category' => 'nullable|string',
    ]);
    if ($validated['south'] >= $validated['north'] || $validated['west'] >= $validated['east']) {
      return response()->json(['error' => 'Invalid Bounding Box coordinates'], 422);
    }

    $query = Asset::query();

    if ($user->role !== 'super_admin') {
      $query->where('organization_id', $user->organization_id);
      $allowedRegionIds = $user->regions()->pluck('regions.id')->toArray();

      if (empty($allowedRegionIds)) {
        return response()->json(['type' => 'FeatureCollection', 'features' => []]);
      }
      $query->whereIn('region_id', $allowedRegionIds);
    }

    $query->whereRaw("
      ST_Intersects(
        geom, 
        ST_MakeEnvelope(?, ?, ?, ?, 4326)
      )
    ", [
      $validated['west'],
      $validated['south'],
      $validated['east'],
      $validated['north']
    ]);

    if ($request->category) {
      $query->where('category', $request->category);
    }
    $assets = $query->select('*', DB::raw('ST_AsGeoJSON(geom) as geojson'))->get();

    $features = $assets->map(function ($asset) {
      return [
        'type' => 'Feature',
        'geometry' => json_decode($asset->geojson),
        'properties' => [
          'id' => $asset->id,
          'name' => $asset->name,
          'category' => $asset->category,
          'status' => $asset->status,
        ],
      ];
    });

    return response()->json([
      'type' => 'FeatureCollection',
      'features' => $features,
    ]);
  }

  public function getNearbyAssets(Request $request)
  {
    $user = Auth::user();

    $validated = $request->validate([
      'lat'    => 'required|numeric',
      'lng'    => 'required|numeric',
      'radius' => 'required|numeric|min:1|max:50000',
    ]);

    $query = Asset::query();

    if ($user->role !== 'super_admin') {
      $query->where('organization_id', $user->organization_id);
      $allowedRegionIds = $user->regions()->pluck('region.id')->toArray();

      if (empty($allowedRegionIds)) {
        return response()->json(['type' => 'FeatureCollection', 'features' => []]);
      }
      $query->whereIn('region_id', $allowedRegionIds);
    }

    $query->whereRaw("
            ST_DWithin(
                geom::geography, 
                ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography, 
                ?
            )
        ", [
      $validated['lng'],
      $validated['lat'],
      $validated['radius']
    ]);

    $assets = $query->select('*', DB::raw('ST_AsGeoJSON(geom) as geojson'))->get();
    $features = $assets->map(function ($asset) {
      return [
        'type' => 'Feature',
        'geometry' => json_decode($asset->geojson),
        'properties' => [
          'id' => $asset->id,
          'name' => $asset->name,
          'category' => $asset->category,
        ],
      ];
    });

    return response()->json([
      'type' => 'FeatureCollection',
      'features' => $features,
      'metadata' => [
        'center' => [$validated['lat'], $validated['lng']],
        'radius_meters' => $validated['radius']
      ]
    ]);
  }

  public function getNearestAssets(Request $request)
  {
    $user = Auth::user();

    $validated = $request->validate([
      'lat'   => 'required|numeric',
      'lng'   => 'required|numeric',
      'limit' => 'nullable|integer|min:1|max:50',
    ]);

    $limit = $validated['limit'] ?? 5;

    $query = Asset::query();

    if ($user->role !== 'super_admin') {
      $query->where('organization_id', $user->organization_id);
      $allowedRegionIds = $user->regions()->pluck('regions.id')->toArray();

      if (empty($allowedRegionIds)) {
        return response()->json(['type' => 'FeatureCollection', 'features' => []]);
      }
      $query->whereIn('region_id', $allowedRegionIds);
    }

    $longitude = $validated['lng'];
    $latitude = $validated['lat'];

    $query->select('*')
      ->selectRaw("
      ST_Distance(
        geom::geography, 
        ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography
      ) AS distance_meter
    ", [$longitude, $latitude])
      ->orderByRaw("geom <-> ST_SetSRID(ST_MakePoint(?, ?), 4326)", [$longitude, $latitude])
      ->limit($limit);

    $assets = $query->get();

    $features = $assets->map(function ($asset) {
      return [
        'type' => 'Feature',
        'geometry' => json_decode(DB::selectOne("SELECT ST_AsGeoJSON(?) as geojson", [$asset->geom])->geojson),
        'properties' => [
          'id' => $asset->id,
          'name' => $asset->name,
          'category' => $asset->category,
          'distance_meter' => round($asset->distance_meter, 2),
        ],
      ];
    });

    return response()->json([
      'type' => 'FeatureCollection',
      'features' => $features,
    ]);
  }

  public function getPaginationAssets(Request $request)
  {
    $user = Auth::user();

    $validated = $request->validate([
      'south'    => 'required|numeric',
      'west'     => 'required|numeric',
      'north'    => 'required|numeric',
      'east'     => 'required|numeric',
      'per_page' => 'nullable|integer|min:1|max:100',
      'page'     => 'nullable|integer|min:1',
    ]);

    $perPage = $validated['per_page'] ?? 10;

    $query = Asset::query();

    if ($user->role !== 'super_admin') {
      $query->where('organization_id', $user->organization_id);
      $allowedRegionIds = $user->regions()->pluck('regions.id')->toArray();

      if (empty($allowedRegionIds)) {
        return response()->json([
          'data' => [],
          'meta' => ['total' => 0]
        ]);
      }
      $query->whereIn('region_id', $allowedRegionIds);
    }

    $query->whereRaw("
            geom && ST_MakeEnvelope(?, ?, ?, ?, 4326)
        ", [
      $validated['west'],
      $validated['south'],
      $validated['east'],
      $validated['north']
    ]);

    $assets = $query->paginate($perPage);
    return response()->json([
      'data' => $assets->items(),
      'meta' => [
        'total'        => $assets->total(),
        'page'         => $assets->currentPage(),
        'per_page'     => $assets->perPage(),
        'last_page'    => $assets->lastPage(),
        'from_viewport' => true
      ]
    ]);
  }
}
