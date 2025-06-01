<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderRequest extends FormRequest
{
    public function authorize()
    {
        return $this->user()->can('update', $this->route('order'));
    }

    public function rules()
    {
        $order = $this->route('order');
        
        //
    }
}