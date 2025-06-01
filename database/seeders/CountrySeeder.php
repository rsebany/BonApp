<?php

namespace Database\Seeders;

use App\Models\Country;
use Illuminate\Database\Seeder;

class CountrySeeder extends Seeder
{
    public function run(): void
    {
        $countries = [
            'United States',
            'Canada',
            'United Kingdom',
            'France',
            'Germany',
            'Italy',
            'Spain',
            'Australia',
            'Japan',
            'South Korea',
            'Brazil',
            'Mexico',
            'India',
            'China',
            'Algeria', // For DZ location
        ];

        foreach ($countries as $country) {
            Country::create(['country_name' => $country]);
        }
    }
}