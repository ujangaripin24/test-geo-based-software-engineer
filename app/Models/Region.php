<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use App\Traits\BelongsToOrganization;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Region extends Model
{
    use HasUuids, BelongsToOrganization;
    protected $fillable = [
        'name',
        'type',
        'organization_id',
    ];
    public function users()
    {
        return $this->belongsToMany(User::class, 'user_regions');
    }

    public function scopeWithGeometry($query)
    {
        return $query->select('*', \DB::raw('ST_AsGeoJSON(geom) as geom'));
    }
}
