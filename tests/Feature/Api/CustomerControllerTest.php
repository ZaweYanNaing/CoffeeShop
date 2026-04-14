<?php

use App\Models\User;

test('admin can view all customers', function () {
    $admin = User::factory()->create(['is_admin' => true, 'api_token' => 'admin-token']);
    $customers = User::factory()->count(5)->create(['is_admin' => false]);

    $response = $this->withToken('admin-token')->getJson('/api/customers');

    $response->assertOk()
        ->assertJsonCount(5, 'data');
});

test('admin can search customers by name', function () {
    $admin = User::factory()->create(['is_admin' => true, 'api_token' => 'admin-token']);
    User::factory()->create(['name' => 'John Doe', 'is_admin' => false]);
    User::factory()->create(['name' => 'Jane Smith', 'is_admin' => false]);

    $response = $this->withToken('admin-token')->getJson('/api/customers?search=John');

    $response->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.name', 'John Doe');
});

test('admin can view customer stats', function () {
    $admin = User::factory()->create(['is_admin' => true, 'api_token' => 'admin-token']);
    User::factory()->count(3)->create(['is_admin' => false]);
    User::factory()->create(['is_admin' => false, 'api_token' => 'active-token-1']);
    User::factory()->create(['is_admin' => false, 'api_token' => 'active-token-2']);

    $response = $this->withToken('admin-token')->getJson('/api/customers/stats');

    $response->assertOk()
        ->assertJson([
            'total_customers' => 5,
            'active_customers' => 2,
        ]);
});

test('admin can ban a customer', function () {
    $admin = User::factory()->create(['is_admin' => true, 'api_token' => 'admin-token']);
    $customer = User::factory()->create(['is_admin' => false]);

    $response = $this->withToken('admin-token')->postJson("/api/customers/{$customer->id}/ban");

    $response->assertOk();
    $customer->refresh();
    expect($customer->isBanned())->toBeTrue();
});

test('admin can unban a customer', function () {
    $admin = User::factory()->create(['is_admin' => true, 'api_token' => 'admin-token']);
    $customer = User::factory()->create(['is_admin' => false, 'banned_at' => now()]);

    $response = $this->withToken('admin-token')->postJson("/api/customers/{$customer->id}/unban");

    $response->assertOk();
    $customer->refresh();
    expect($customer->isBanned())->toBeFalse();
});

test('admin cannot ban another admin', function () {
    $admin = User::factory()->create(['is_admin' => true, 'api_token' => 'admin-token']);
    $anotherAdmin = User::factory()->create(['is_admin' => true]);

    $response = $this->withToken('admin-token')->postJson("/api/customers/{$anotherAdmin->id}/ban");

    $response->assertForbidden();
    $anotherAdmin->refresh();
    expect($anotherAdmin->isBanned())->toBeFalse();
});

test('cannot ban already banned customer', function () {
    $admin = User::factory()->create(['is_admin' => true, 'api_token' => 'admin-token']);
    $customer = User::factory()->create(['is_admin' => false, 'banned_at' => now()]);

    $response = $this->withToken('admin-token')->postJson("/api/customers/{$customer->id}/ban");

    $response->assertStatus(400);
});

test('cannot unban customer who is not banned', function () {
    $admin = User::factory()->create(['is_admin' => true, 'api_token' => 'admin-token']);
    $customer = User::factory()->create(['is_admin' => false]);

    $response = $this->withToken('admin-token')->postJson("/api/customers/{$customer->id}/unban");

    $response->assertStatus(400);
});

test('banned user cannot access protected routes', function () {
    $user = User::factory()->create(['is_admin' => false, 'api_token' => 'user-token', 'banned_at' => now()]);

    $response = $this->withToken('user-token')->getJson('/api/orders');

    $response->assertForbidden()
        ->assertJson(['message' => 'Your account has been banned.']);
});

test('non-admin cannot access customer endpoints', function () {
    $user = User::factory()->create(['is_admin' => false, 'api_token' => 'user-token']);

    $response = $this->withToken('user-token')->getJson('/api/customers');

    $response->assertForbidden();
});

test('guest cannot access customer endpoints', function () {
    $response = $this->getJson('/api/customers');

    $response->assertUnauthorized();
});
