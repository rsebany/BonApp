<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMenuItemRequest extends FormRequest
{
    public function authorize()
    {
        //
    }

    public function rules()
    {
        $order = $this->route('order');
        
        //
    }
}