<?php

namespace App\Models;

use App\Http\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Region extends Model
{
    use HasUuids, BelongsToOrganization;

    protected $fillable = ['name', 'type', 'organization_id'];

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_regions');
    }

    public function scopeWithGeoJson($query)
    {
        return $query->select('*', DB::raw('ST_AsGeoJSON(geom) as geojson'));
    }
}
