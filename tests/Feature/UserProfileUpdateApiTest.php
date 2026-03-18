<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

test('user can update name and email via api', function () {
    $user = User::factory()->create([
        'api_token' => 'token-a',
        'is_admin' => false,
    ]);

    $response = $this
        ->withHeader('Authorization', 'Bearer '.$user->api_token)
        ->putJson('/api/profile', [
            'name' => 'New Name',
            'email' => 'new-email@example.com',
        ]);

    $response->assertSuccessful();

    $user->refresh();

    expect($user->name)->toBe('New Name');
    expect($user->email)->toBe('new-email@example.com');
});

test('user can update password via api with current password', function () {
    $user = User::factory()->create([
        'api_token' => 'token-a',
        'is_admin' => false,
        'password' => Hash::make('old-password'),
    ]);

    $response = $this
        ->withHeader('Authorization', 'Bearer '.$user->api_token)
        ->putJson('/api/password', [
            'current_password' => 'old-password',
            'password' => 'new-password-123',
            'password_confirmation' => 'new-password-123',
        ]);

    $response->assertSuccessful();

    $user->refresh();
    expect(Hash::check('new-password-123', $user->password))->toBeTrue();
});

test('user cannot update password with incorrect current password', function () {
    $user = User::factory()->create([
        'api_token' => 'token-a',
        'is_admin' => false,
        'password' => Hash::make('old-password'),
    ]);

    $response = $this
        ->withHeader('Authorization', 'Bearer '.$user->api_token)
        ->putJson('/api/password', [
            'current_password' => 'wrong-password',
            'password' => 'new-password-123',
            'password_confirmation' => 'new-password-123',
        ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['current_password']);
});
