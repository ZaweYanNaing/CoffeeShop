<?php

use App\Models\Category;
use App\Models\Product;
use App\Services\GeminiService;

beforeEach(function () {
    // Create test products
    $category = Category::factory()->create(['name' => 'Coffee']);

    Product::factory()->create([
        'name' => 'Iced Vanilla Latte',
        'description' => 'Sweet and creamy iced latte with vanilla',
        'price' => 4.50,
        'category_id' => $category->id,
        'is_available' => true,
        'points_reward' => 10,
    ]);

    Product::factory()->create([
        'name' => 'Oat Milk Cappuccino',
        'description' => 'Dairy-free cappuccino with oat milk',
        'price' => 4.00,
        'category_id' => $category->id,
        'is_available' => true,
        'points_reward' => 10,
    ]);
});

test('can send message to coffee concierge', function () {
    // Mock the Gemini service
    $this->mock(GeminiService::class, function ($mock) {
        $mock->shouldReceive('getCoffeeRecommendation')
            ->once()
            ->andReturn('I recommend trying our Iced Vanilla Latte! It\'s sweet, refreshing, and perfect for a warm day.');
    });

    $response = $this->postJson('/api/concierge/chat', [
        'message' => 'I want something sweet and iced',
    ]);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'message',
            'timestamp',
        ]);
});

test('validates message is required', function () {
    $response = $this->postJson('/api/concierge/chat', [
        'message' => '',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['message']);
});

test('validates message max length', function () {
    $response = $this->postJson('/api/concierge/chat', [
        'message' => str_repeat('a', 501),
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['message']);
});

test('only includes available products in recommendations', function () {
    // Create an unavailable product
    $category = Category::first();
    Product::factory()->create([
        'name' => 'Unavailable Drink',
        'description' => 'This should not appear',
        'price' => 5.00,
        'category_id' => $category->id,
        'is_available' => false,
    ]);

    $this->mock(GeminiService::class, function ($mock) {
        $mock->shouldReceive('getCoffeeRecommendation')
            ->once()
            ->with(
                'Show me all drinks',
                \Mockery::on(function ($products) {
                    // Verify only available products are passed
                    return count($products) === 2 &&
                           collect($products)->every(fn ($p) => $p['name'] !== 'Unavailable Drink');
                })
            )
            ->andReturn('Here are our available drinks!');
    });

    $response = $this->postJson('/api/concierge/chat', [
        'message' => 'Show me all drinks',
    ]);

    $response->assertStatus(200);
});
