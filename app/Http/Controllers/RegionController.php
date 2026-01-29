<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Models\Region;
use Inertia\Inertia;

class RegionController extends Controller
{

    public function index()
    {
        return Inertia::render('Dashboard/RegionPage/RegionPage');
    }
}
