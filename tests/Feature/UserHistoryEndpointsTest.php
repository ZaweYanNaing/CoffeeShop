<?php

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Reservation;
use App\Models\User;

test('orders history endpoint returns only authenticated user orders', function () {
    $userA = User::factory()->create([
        'api_token' => 'token-a',
        'is_admin' => false,
    ]);

    $userB = User::factory()->create([
        'api_token' => 'token-b',
        'is_admin' => false,
    ]);

    $category = Category::query()->create([
        'name' => 'Coffee',
        'slug' => 'coffee',
        'description' => null,
        'image' => null,
    ]);

    $product = Product::query()->create([
        'category_id' => $category->id,
        'name' => 'Espresso',
        'slug' => 'espresso',
        'description' => 'Strong',
        'price' => 3.50,
        'image' => null,
        'is_available' => true,
    ]);

    $orderA = Order::query()->create([
        'user_id' => $userA->id,
        'total_price' => 7.00,
        'status' => 'pending',
        'payment_status' => 'pending',
        'payment_method' => 'cash',
    ]);

    OrderItem::query()->create([
        'order_id' => $orderA->id,
        'product_id' => $product->id,
        'quantity' => 2,
        'unit_price' => 3.50,
        'subtotal' => 7.00,
    ]);

    $orderB = Order::query()->create([
        'user_id' => $userB->id,
        'total_price' => 3.50,
        'status' => 'completed',
        'payment_status' => 'paid',
        'payment_method' => 'card',
    ]);

    $response = $this
        ->withHeader('Authorization', 'Bearer '.$userA->api_token)
        ->getJson('/api/orders');

    $response->assertSuccessful();

    $ids = collect($response->json('data'))->pluck('id')->all();
    expect($ids)->toContain($orderA->id);
    expect($ids)->not->toContain($orderB->id);
});

test('reservations history endpoint returns only authenticated user reservations', function () {
    $userA = User::factory()->create([
        'api_token' => 'token-a',
        'is_admin' => false,
    ]);

    $userB = User::factory()->create([
        'api_token' => 'token-b',
        'is_admin' => false,
    ]);

    $reservationA = Reservation::query()->create([
        'user_id' => $userA->id,
        'name' => $userA->name,
        'email' => $userA->email,
        'phone' => null,
        'reservation_date' => now()->addDays(2)->toDateString(),
        'reservation_time' => '18:00:00',
        'party_size' => 2,
        'status' => 'pending',
        'special_request' => null,
    ]);

    $reservationB = Reservation::query()->create([
        'user_id' => $userB->id,
        'name' => $userB->name,
        'email' => $userB->email,
        'phone' => null,
        'reservation_date' => now()->addDays(3)->toDateString(),
        'reservation_time' => '19:00:00',
        'party_size' => 4,
        'status' => 'confirmed',
        'special_request' => null,
    ]);

    $response = $this
        ->withHeader('Authorization', 'Bearer '.$userA->api_token)
        ->getJson('/api/reservations');

    $response->assertSuccessful();

    $ids = collect($response->json('data'))->pluck('id')->all();
    expect($ids)->toContain($reservationA->id);
    expect($ids)->not->toContain($reservationB->id);
});
