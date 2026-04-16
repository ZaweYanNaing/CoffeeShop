<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\GeminiService;
use Illuminate\Http\Request;

class CoffeeConciergeController extends Controller
{
    public function __construct(
        protected GeminiService $geminiService
    ) {}

    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:500',
        ]);

        // Get all available products with their categories
        $products = Product::with('category')
            ->where('is_available', true)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'description' => $product->description,
                    'price' => $product->price,
                    'category' => $product->category ? [
                        'name' => $product->category->name,
                    ] : null,
                    'points_reward' => $product->points_reward ?? 0,
                    'points_cost' => $product->points_cost ?? 0,
                ];
            })
            ->toArray();

        $response = $this->geminiService->getCoffeeRecommendation(
            $request->message,
            $products
        );

        return response()->json([
            'message' => $response,
            'timestamp' => now()->toIso8601String(),
        ]);
    }
}
