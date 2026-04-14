<?php

use App\Models\Order;
use App\Models\User;

test('admin can fetch daily income data', function () {
    $admin = User::factory()->create(['is_admin' => true, 'api_token' => 'test-token']);
    $user = User::factory()->create();

    Order::factory()->create([
        'user_id' => $user->id,
        'total_price' => 100.00,
        'payment_status' => 'paid',
        'created_at' => now()->subDays(2),
    ]);

    Order::factory()->create([
        'user_id' => $user->id,
        'total_price' => 150.00,
        'payment_status' => 'paid',
        'created_at' => now()->subDays(2),
    ]);

    Order::factory()->create([
        'user_id' => $user->id,
        'total_price' => 75.00,
        'payment_status' => 'paid',
        'created_at' => now()->subDays(1),
    ]);

    Order::factory()->create([
        'user_id' => $user->id,
        'total_price' => 200.00,
        'payment_status' => 'pending',
        'created_at' => now(),
    ]);

    $response = $this->withToken('test-token')->getJson('/api/analytics/daily-income?days=7');

    $response->assertOk()
        ->assertJsonStructure([
            'data' => [
                '*' => ['date', 'total'],
            ],
        ]);

    $data = $response->json('data');
    expect($data)->toHaveCount(2);
});

test('non-admin cannot access daily income data', function () {
    $user = User::factory()->create(['is_admin' => false, 'api_token' => 'user-token']);

    $response = $this->withToken('user-token')->getJson('/api/analytics/daily-income');

    $response->assertForbidden();
});

test('guest cannot access daily income data', function () {
    $response = $this->getJson('/api/analytics/daily-income');

    $response->assertUnauthorized();
});

test('daily income only includes paid orders', function () {
    $admin = User::factory()->create(['is_admin' => true, 'api_token' => 'admin-token']);
    $user = User::factory()->create();

    Order::factory()->create([
        'user_id' => $user->id,
        'total_price' => 100.00,
        'payment_status' => 'paid',
        'created_at' => now(),
    ]);

    Order::factory()->create([
        'user_id' => $user->id,
        'total_price' => 200.00,
        'payment_status' => 'pending',
        'created_at' => now(),
    ]);

    Order::factory()->create([
        'user_id' => $user->id,
        'total_price' => 300.00,
        'payment_status' => 'failed',
        'created_at' => now(),
    ]);

    $response = $this->withToken('admin-token')->getJson('/api/analytics/daily-income?days=1');

    $response->assertOk();

    $data = $response->json('data');
    expect($data)->toHaveCount(1);
    expect((float) $data[0]['total'])->toBe(100.00);
});
