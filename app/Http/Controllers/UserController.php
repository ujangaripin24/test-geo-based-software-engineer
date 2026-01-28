<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    public function assignRegion(Request $request, User $user) {
    $user->regions()->sync($request->region_ids);
    return back();
}
}
