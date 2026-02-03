<?php

namespace App\Http\Controllers;

use App\Models\Region;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserRegionController extends Controller
{
  public function index(User $user)
  {
    if (Auth::user()->role != 'super_admin' && $user->organization_id !== Auth::user()->organization_id) {
      abort(403);
    }

    $availableRegions = Region::where('organization_id', $user->organization_id)->get(['id', 'name', 'type']);

    return Inertia::render('Dashboard/UserPage/UserRegionAssign', [
      'user' => $user->load('regions:id,name'),
      'availableRegions' => $availableRegions,
    ]);
  }
  public function store(Request $request, User $user)
  {
    if (Auth::user()->role !== 'super_admin' && $user->organization_id !== Auth::user()->organization_id) {
      abort(403);
    }

    $validated = $request->validate([
      'region_ids' => 'array',
      'region_ids.*' => 'exists:regions,id'
    ]);

    $validRegionIds = Region::whereIn('id', $validated['region_ids'])
      ->where('organization_id', $user->organization_id)
      ->pluck('id');

    $user->regions()->sync($validRegionIds);

    return redirect()->back()->with('success', 'Akses wilayah user berhasil diperbarui.');
  }
}
