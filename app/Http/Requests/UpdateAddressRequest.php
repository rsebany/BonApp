<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAddressRequest extends FormRequest
{
    public function authorize()
    {
        return $this->user()->can('update', $this->route('order'));
    }

    public function rules()
    {
        //
    }
}