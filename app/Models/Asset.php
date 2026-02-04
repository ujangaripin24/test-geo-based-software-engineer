<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class Asset extends Model
{
    use HasUuids, SoftDeletes;

    protected $fillable = ['name', 'category', 'status', 'meta', 'region_id', 'organization_id'];

    protected $casts = [
        'meta' => 'array',
    ];
    protected static function boot()
    {
        return parent::boot();

        static::saving(function ($asset) {
            $region = Region::find($asset->region_id);

            if ($region && $region->organization_id !== $asset->organization_id) {
                throw ValidationException::withMessages([
                    'region_id' => ['Region ini tidak terdaftar dalam organisasi Anda.']
                ]);
            }
        });
    }

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
