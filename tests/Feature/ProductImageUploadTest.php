<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('admin can create product with uploaded image', function () {
    Storage::fake('public');

    $admin = User::factory()->create([
        'is_admin' => true,
        'api_token' => 'test-token',
    ]);

    $category = Category::query()->create([
        'name' => 'Coffee',
        'slug' => 'coffee',
        'description' => null,
        'image' => null,
    ]);

    $response = $this
        ->withHeader('Authorization', 'Bearer ' . $admin->api_token)
        ->post('/api/products', [
            'name' => 'Test Product',
            'category_id' => $category->id,
            'description' => 'Tasty',
            'price' => 9.99,
            'is_available' => true,
            'image' => UploadedFile::fake()->image('product.jpg'),
        ]);

    $response->assertSuccessful();

    $product = Product::query()->where('name', 'Test Product')->firstOrFail();

    expect($product->image)->not->toBeNull();
    Storage::disk('public')->assertExists($product->image);

    $response->assertJsonPath('data.image', Storage::url($product->image));
});

test('admin can update product image and old image is deleted', function () {
    Storage::fake('public');

    $admin = User::factory()->create([
        'is_admin' => true,
        'api_token' => 'test-token',
    ]);

    $category = Category::query()->create([
        'name' => 'Coffee',
        'slug' => 'coffee',
        'description' => null,
        'image' => null,
    ]);

    $product = Product::query()->create([
        'name' => 'Test Product',
        'slug' => 'test-product',
        'category_id' => $category->id,
        'description' => 'Tasty',
        'price' => 9.99,
        'is_available' => true,
        'image' => 'products/old.jpg',
    ]);

    Storage::disk('public')->put('products/old.jpg', 'old-image');
    Storage::disk('public')->assertExists($product->image);
    $oldImage = $product->image;

    $response = $this
        ->withHeader('Authorization', 'Bearer ' . $admin->api_token)
        ->post('/api/products/' . $product->id, [
            '_method' => 'PUT',
            'image' => UploadedFile::fake()->image('new.jpg'),
        ]);

    $response->assertSuccessful();

    $product->refresh();

    expect($product->image)->not->toBeNull()
        ->and($product->image)->not->toBe($oldImage);

    Storage::disk('public')->assertMissing($oldImage);
    Storage::disk('public')->assertExists($product->image);
});
