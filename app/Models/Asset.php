<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class Asset extends Model
{
    use HasUuids, SoftDeletes;

    protected $fillable = [
        'organization_id',
        'region_id',
        'name',
        'category',
        'status',
        'meta'
    ];

    protected $cast = [
        'meta' => 'json'
    ];

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function region()
    {
        return $this->belongsTo(Region::class);
    }

    public function scopeWithGeoJson($query)
    {
        return $query->addSelect([
            '*',
            DB::raw('ST_AsGeoJSON(geom) as geojson')
        ]);
    }

    public function scopeForOrganization($query, $organizationId)
    {
        return $query->where('organization_id', $organizationId);
    }

    public function scopeForRegion($query, $regionId)
    {
        return $query->where('region_id', $regionId);
    }
}
