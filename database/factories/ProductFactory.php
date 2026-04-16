<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->words(3, true);

        return [
            'name' => $name,
            'slug' => Str::slug($name).'-'.fake()->unique()->numberBetween(1, 9999),
            'description' => fake()->sentence(),
            'price' => fake()->randomFloat(2, 2, 10),
            'category_id' => Category::factory(),
            'is_available' => true,
            'points_reward' => fake()->numberBetween(5, 20),
            'points_cost' => 0,
        ];
    }
}
