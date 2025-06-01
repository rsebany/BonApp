<?php

namespace App\Http\Requests;

use App\Models\Restaurant;
use Illuminate\Foundation\Http\FormRequest;

class StoreRestaurantRequest extends FormRequest
{
    public function authorize()
    {
        return $this->user()->can('create', Restaurant::class);
    }

    public function rules()
    {
        return [
            'restaurant_name' => 'required|string|max:100',
            'address_id' => 'required|exists:addresses,id'
        ];
    }
}