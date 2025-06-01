<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function authorize()
    {
        return $this->user()->can('create', \App\Models\FoodOrder::class);
    }

    public function rules()
    {
        return [
            'restaurant_id' => 'required|exists:restaurants,id',
            'customer_address_id' => 'required|exists:customer_addresses,id',
            'delivery_fee' => 'required|numeric|min:0',
            'items' => 'required|array|min:1',
            'items.*.menu_item_id' => 'required|exists:menu_items,id,restaurant_id,'.$this->restaurant_id,
            'items.*.quantity' => 'required|integer|min:1',
            'special_instructions' => 'nullable|string|max:500'
        ];
    }

    public function attributes()
    {
        return [
            'items.*.menu_item_id' => 'menu item',
            'items.*.quantity' => 'quantity'
        ];
    }
}