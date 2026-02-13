<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin User
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@coffee.com',
            'password' => Hash::make('password'),
            'is_admin' => true,
        ]);

        // Customer User
        User::create([
            'name' => 'Customer User',
            'email' => 'customer@coffee.com',
            'password' => Hash::make('password'),
            'is_admin' => false,
        ]);

        // Categories
        $coffee = Category::create([
            'name' => 'Coffee',
            'slug' => 'coffee',
            'description' => 'Freshly brewed coffee from premium beans.'
        ]);

        $pastries = Category::create([
            'name' => 'Pastries',
            'slug' => 'pastries',
            'description' => 'Delicious baked goods to accompany your coffee.'
        ]);

        // Products
        Product::create([
            'category_id' => $coffee->id,
            'name' => 'Espresso',
            'slug' => 'espresso',
            'description' => 'Strong and concentrated coffee shot.',
            'price' => 3.50,
            'is_available' => true,
        ]);

        Product::create([
            'category_id' => $coffee->id,
            'name' => 'Cappuccino',
            'slug' => 'cappuccino',
            'description' => 'Espresso with steamed milk and thick foam.',
            'price' => 4.50,
            'is_available' => true,
        ]);

        Product::create([
            'category_id' => $pastries->id,
            'name' => 'Croissant',
            'slug' => 'croissant',
            'description' => 'Buttery and flaky french pastry.',
            'price' => 3.00,
            'is_available' => true,
        ]);

        Product::create([
            'category_id' => $pastries->id,
            'name' => 'Blueberry Muffin',
            'slug' => 'blueberry-muffin',
            'description' => 'Soft muffin filled with fresh blueberries.',
            'price' => 3.25,
            'is_available' => true,
        ]);
    }
}
