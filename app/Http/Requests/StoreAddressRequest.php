<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAddressRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'unit_number' => 'nullable|string|max:10',
            'street_number' => 'required|string|max:10',
            'address_line1' => 'required|string|max:255',
            'address_line2' => 'nullable|string|max:255',
            'city' => 'required|string|max:50',
            'region' => 'required|string|max:50',
            'postal_code' => 'required|string|max:20',
            'country_id' => 'required|exists:countries,id',
        ];
    }

    public function attributes(): array
    {
        return [
            'unit_number' => 'unit number',
            'street_number' => 'street number',
            'address_line1' => 'street name',
            'address_line2' => 'address line 2',
            'city' => 'city',
            'region' => 'state/region',
            'postal_code' => 'postal code',
            'country_id' => 'country',
        ];
    }

    public function messages(): array
    {
        return [
            'street_number.required' => 'Street number is required.',
            'address_line1.required' => 'Street name is required.',
            'city.required' => 'City is required.',
            'region.required' => 'State/Region is required.',
            'postal_code.required' => 'Postal code is required.',
            'country_id.required' => 'Country is required.',
            'country_id.exists' => 'The selected country is invalid.',
        ];
    }
}