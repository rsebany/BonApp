<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RateOrderRequest extends FormRequest
{
    public function authorize()
    {
        return $this->user()->can('rate', $this->route('order'));
    }

    public function rules()
    {
        return [
            'driver_rating' => 'required_if:restaurant_rating,null|integer|between:1,5',
            'restaurant_rating' => 'required_if:driver_rating,null|integer|between:1,5',
            'comment' => 'nullable|string|max:500'
        ];
    }

    public function messages()
    {
        return [
            'driver_rating.required_if' => 'Veuillez noter soit le driver, soit le restaurant',
            'restaurant_rating.required_if' => 'Veuillez noter soit le driver, soit le restaurant'
        ];
    }
}