<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index(Request $request): \Illuminate\Http\Resources\Json\AnonymousResourceCollection
    {
        $query = User::query()->where('is_admin', false)->withCount(['orders', 'reservations']);

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $customers = $query->latest()->paginate(15);

        return UserResource::collection($customers);
    }

    public function show(User $customer): UserResource
    {
        $customer->loadCount(['orders', 'reservations', 'reviews']);
        $customer->load(['orders' => fn ($q) => $q->latest()->limit(5)]);

        return new UserResource($customer);
    }

    public function ban(User $customer): \Illuminate\Http\JsonResponse
    {
        if ($customer->is_admin) {
            return response()->json(['message' => 'Cannot ban admin users'], 403);
        }

        if ($customer->isBanned()) {
            return response()->json(['message' => 'Customer is already banned'], 400);
        }

        $customer->update(['banned_at' => now()]);

        return response()->json(['message' => 'Customer banned successfully']);
    }

    public function unban(User $customer): \Illuminate\Http\JsonResponse
    {
        if ($customer->is_admin) {
            return response()->json(['message' => 'Cannot unban admin users'], 403);
        }

        if (! $customer->isBanned()) {
            return response()->json(['message' => 'Customer is not banned'], 400);
        }

        $customer->update(['banned_at' => null]);

        return response()->json(['message' => 'Customer unbanned successfully']);
    }

    public function stats(): \Illuminate\Http\JsonResponse
    {
        $totalCustomers = User::where('is_admin', false)->count();
        $activeCustomers = User::where('is_admin', false)
            ->whereNotNull('api_token')
            ->count();

        return response()->json([
            'total_customers' => $totalCustomers,
            'active_customers' => $activeCustomers,
        ]);
    }
}
