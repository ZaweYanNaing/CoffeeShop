<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class RewardsController extends Controller
{
    public function index(Request $request): \Illuminate\Http\JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'reward_points' => $user->reward_points,
            'transactions' => $user->rewardTransactions()
                ->latest()
                ->limit(50)
                ->get()
                ->map(fn ($transaction) => [
                    'id' => $transaction->id,
                    'points' => $transaction->points,
                    'type' => $transaction->type,
                    'description' => $transaction->description,
                    'created_at' => $transaction->created_at->toDateTimeString(),
                ]),
        ]);
    }

    public function redeemableProducts(): \Illuminate\Http\JsonResponse
    {
        $products = \App\Models\Product::whereNotNull('points_cost')
            ->where('is_available', true)
            ->with('category')
            ->get();

        return response()->json([
            'data' => $products,
        ]);
    }
}
