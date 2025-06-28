<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\MenuItem;
use App\Models\Address;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'restaurant_id' => 'required|exists:restaurants,id',
            'customer_address_id' => 'required|exists:addresses,id',
            'delivery_time' => 'required|string',
            'notes' => 'nullable|string|max:500',
            'items' => 'required|array|min:1',
            'items.*.menu_item_id' => 'required|exists:menu_items,id',
            'items.*.quantity' => 'required|integer|min:1|max:10',
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            // Validate that address belongs to the customer
            if ($this->customer_address_id) {
                $address = Address::find($this->customer_address_id);
                if ($address && $address->customer_id !== auth()->id()) {
                    $validator->errors()->add('customer_address_id', 'The selected address does not belong to you.');
                }
            }

            // Validate that all menu items belong to the selected restaurant
            if ($this->restaurant_id && $this->items) {
                foreach ($this->items as $index => $item) {
                    if (isset($item['menu_item_id'])) {
                        $menuItem = MenuItem::find($item['menu_item_id']);
                        if ($menuItem && $menuItem->restaurant_id != $this->restaurant_id) {
                            $validator->errors()->add(
                                "items.{$index}.menu_item_id",
                                'The selected menu item does not belong to the selected restaurant.'
                            );
                        }
                    }
                }
            }
        });
    }

    public function messages(): array
    {
        return [
            'delivery_time.required' => 'Please select a delivery time.',
            'notes.max' => 'Order notes may not be greater than 500 characters.',
            'items.required' => 'At least one item must be selected.',
            'items.*.menu_item_id.required' => 'Menu item is required.',
            'items.*.menu_item_id.exists' => 'The selected menu item is invalid.',
            'items.*.quantity.required' => 'Quantity is required.',
            'items.*.quantity.min' => 'Quantity must be at least 1.',
            'items.*.quantity.max' => 'Quantity cannot exceed 10.',
        ];
    }
}