<?php

namespace App\Models;

use App\Http\Traits\BelongsToOrganization;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Region extends Model
{
    use HasUuids, BelongsToOrganization;

    protected $fillable = ['name', 'type'];
}
