<?php

namespace App\Http\Requests;

use App\Models\Restaurant;
use Illuminate\Foundation\Http\FormRequest;

class UpdateRestaurantRequest extends FormRequest
{
    public function authorize()
    {
        return $this->user()->can('update', $this->route('restaurant'));
    }

    public function rules()
    {
        $restaurant = $this->route('restaurant');
        
        return [
            'restaurant_name' => 'sometimes|required|string|max:100',
            'address_id' => 'sometimes|required|exists:addresses,id'
        ];
    }
}