<?php

namespace App\Services;

use App\Models\Region;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AssetSpatialService
{
    public function validateContainment(string $geojson, string $regionId): bool
    {
        $region = Region::findOrFail($regionId);

        $result = DB::selectOne("
            SELECT ST_Contains(
                geom, 
                ST_SetSRID(ST_GeomFromGeoJSON(?), 4326)
            ) as is_inside 
            FROM regions 
            WHERE id = ?
        ", [$geojson, $regionId]);

        if (!$result || !$result->is_inside) {
            throw ValidationException::withMessages([
                'geojson' => ['Error Spasial: Koordinat aset berada di luar batas wilayah (Region) yang Anda pilih.'],
            ]);
        }
        return true;
    }
}
