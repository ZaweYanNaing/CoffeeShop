<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Product::with('category');

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        return ProductResource::collection($query->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:products',
            'category_id' => 'required|exists:categories,id',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable|string',
            'is_available' => 'boolean',
        ]);

        $product = Product::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'category_id' => $validated['category_id'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'image' => $validated['image'] ?? null,
            'is_available' => $validated['is_available'] ?? true,
        ]);

        return new ProductResource($product);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        return new ProductResource($product->load(['category', 'reviews']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255|unique:products,name,' . $product->id,
            'category_id' => 'sometimes|required|exists:categories,id',
            'description' => 'sometimes|required|string',
            'price' => 'sometimes|required|numeric|min:0',
            'image' => 'nullable|string',
            'is_available' => 'boolean',
        ]);

        if (isset($validated['name'])) {
            $product->slug = Str::slug($validated['name']);
        }

        $product->update($validated);

        return new ProductResource($product);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }
}
