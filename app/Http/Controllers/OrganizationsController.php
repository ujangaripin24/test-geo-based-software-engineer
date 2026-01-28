<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Organization;

class OrganizationsController extends Controller
{
    public function index(Request $request)
    {
        $query = Organization::query();
        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('code', 'like', '%' . $request->search . '%');
        }
        return Inertia::render('Dashboard/OrganizationsPage/OrganizationsPage', [
            'organizations' => $query->latest()->paginate(10)->withQueryString(),
            'filters' => $request->only(['search'])
        ]);
    }

    public function store(Request $request)
    {
        $validate = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|unique:organizations,code|max:50',
        ]);

        Organization::create($validate);
        return redirect()->back()->with('success', 'Organization created.');
    }

    public function update(Request $request, Organization $organization)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|unique:organizations,code,' . $organization->id,
        ]);

        $organization->update($validated);
        return redirect()->back()->with('success', 'Organization updated.');
    }

    public function destroy(Organization $organization)
    {
        $organization->delete();
        return redirect()->back()->with('success', 'Organization deleted.');
    }
}
