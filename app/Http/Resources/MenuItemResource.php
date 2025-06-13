<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MenuItemResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'item_name' => $this->item_name,
            'price' => $this->price,
            'description' => $this->description,
            'restaurant_id' => $this->restaurant_id
        ];
    }
}