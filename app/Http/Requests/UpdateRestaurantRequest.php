<?php

// app/Http/Requests/UpdateRestaurantRequest.php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRestaurantRequest extends FormRequest
{
    public function authorize()
    {
        return auth()->user()->role === 'admin';
    }

    public function rules()
    {
        return [
            'restaurant_name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:restaurants,email,'.$this->restaurant->id,
            'phone' => 'required|string|max:20',
            'description' => 'nullable|string',
            'cuisine_type' => 'required|string|max:255',
            'opening_hours' => 'required|array',
            'delivery_time' => 'required|string|max:50',
            'minimum_order' => 'required|numeric|min:0',
            'delivery_fee' => 'required|numeric|min:0',
            'is_active' => 'boolean',
            
            'address.unit_number' => 'nullable|string|max:20',
            'address.street_number' => 'nullable|string|max:20',
            'address.address_line1' => 'required|string|max:255',
            'address.address_line2' => 'nullable|string|max:255',
            'address.city' => 'required|string|max:100',
            'address.region' => 'required|string|max:100',
            'address.postal_code' => 'required|string|max:20',
            'address.country_id' => 'required|exists:countries,id',
        ];
    }

    public function messages()
    {
        return [
            'restaurant_name.required' => 'Restaurant name is required.',
            'restaurant_name.unique' => 'A restaurant with this name already exists.',
            'email.required' => 'Email address is required.',
            'email.unique' => 'This email address is already in use.',
            'phone.required' => 'Phone number is required.',
            'cuisine_type.required' => 'Cuisine type is required.',
            'opening_hours.required' => 'Opening hours are required.',
            'delivery_time.required' => 'Delivery time is required.',
            'delivery_time.min' => 'Delivery time must be at least 1 minute.',
            'delivery_time.max' => 'Delivery time cannot exceed 120 minutes.',
            'minimum_order.required' => 'Minimum order amount is required.',
            'delivery_fee.required' => 'Delivery fee is required.',
            
            // Address messages
            'address.required' => 'Address information is required.',
            'address.address_line1.required' => 'Address line 1 is required.',
            'address.city.required' => 'City is required.',
            'address.region.required' => 'Region/State is required.',
            'address.postal_code.required' => 'Postal code is required.',
            'address.country_id.required' => 'Country is required.',
            'address.country_id.exists' => 'The selected country is invalid.',
        ];
    }
}