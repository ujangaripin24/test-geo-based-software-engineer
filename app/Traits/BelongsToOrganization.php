<?php

namespace App\Traits;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Str;

trait BelongsToOrganization
{
    protected static function bootBelongsToOrganization()
    {
        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = Str::uuid();
            }
            if (auth()->check()) {
                $model->organization_id = auth()->user()->organization_id;
            }
        });

        static::addGlobalScope('organization', function (Builder $builder) {
            if (auth()->check()) {
                $builder->where($builder->getQuery()->from.'.organization_id', auth()->user()->organization_id);
            }
        });
    }
}
