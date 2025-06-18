<?php

namespace Database\Factories;

use App\Models\Driver;
use Illuminate\Database\Eloquent\Factories\Factory;

class DriverFactory extends Factory
{
    protected $model = Driver::class;

    public function definition(): array
    {
        $vehicleTypes = ['Car', 'Motorcycle', 'Bicycle', 'Scooter', 'Van'];
        $colors = ['Red', 'Blue', 'Black', 'White', 'Silver', 'Green', 'Yellow'];
        return [
            'user_id' => \App\Models\User::where('role', 'driver')->inRandomOrder()->first()?->id ?? 1,
            'driver_license_number' => $this->faker->bothify('DL########'),
            'vehicle_type' => $this->faker->randomElement($vehicleTypes),
            'vehicle_make' => $this->faker->company(),
            'vehicle_model' => $this->faker->word(),
            'vehicle_year' => $this->faker->year(),
            'vehicle_color' => $this->faker->randomElement($colors),
            'license_plate' => strtoupper($this->faker->bothify('??####')),
            'is_approved' => $this->faker->boolean(80),
            'is_available' => $this->faker->boolean(90),
            'current_lat' => $this->faker->latitude,
            'current_lng' => $this->faker->longitude,
        ];
    }
} 