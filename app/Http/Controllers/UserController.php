<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserController extends Controller
{
  public function index(Request $request)
  {
    $query = User::with('organization');

    if (Auth::user()->role !== 'super_admin') {
      $query->where('organization_id', Auth::user()->organization_id);
    }

    if ($request->search) {
      $query->where(function ($q) use ($request) {
        $q->where('name', 'ilike', '%' . $request->search . '%')
          ->orWhere('email', 'ilike', '%' . $request->search . '%');
      });
    }

    return Inertia::render('Dashboard/UserPage/UserPage', [
      'users' => $query->latest()->paginate(10)->withQueryString(),
      'organizations' => Organization::all(['id', 'name']),
      'filters' => $request->only(['search']),
      'roles' => ['super_admin', 'admin', 'operator', 'viewer']
    ]);
  }
  public function store(Request $request)
  {
    $validated = $request->validate([
      'name' => 'required|string|max:255',
      'email' => 'required|string|email|max:255|unique:users',
      'password' => 'required|string|min:8',
      'organization_id' => 'required|exists:organizations,id',
      'role' => 'required|in:super_admin,admin,operator,viewer',
    ]);

    if ($request->filled('password')) {
      $validated['password'] = Hash::make($request->password);
    }

    User::create($validated);
    return redirect()->back()->with('success', 'User created successfully.');
  }

  public function update(Request $request, User $user)
  {
    if (Auth::user()->role !== 'super_admin' && $user->organization_id !== Auth::user()->organization_id) {
      abort(403, 'Anda tidak memiliki akses ke user ini.');
    }
    $validated = $request->validate([
      'name' => 'required|string|max:255',
      'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
      'organization_id' => 'required|exists:organizations,id',
      'role' => 'required|in:super_admin,admin,operator,viewer',
    ]);

    if ($request->filled('password')) {
      $validated['password'] = Hash::make($request->password);
    }

    $user->update($validated);
    return redirect()->back()->with('success', 'User updated successfully.');
  }

  public function destroy(User $user)
  {
    if (Auth::user()->role !== 'super_admin' && $user->organization_id !== Auth::user()->organization_id) {
      abort(403, 'Anda tidak memiliki akses ke user ini.');
    }
    $user->delete();
    return redirect()->back()->with('success', 'User deleted.');
  }
}
