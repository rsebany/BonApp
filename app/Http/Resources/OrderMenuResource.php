<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderMenuResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_id' => $this->order_id,
            'menu_item' => new MenuItemResource($this->whenLoaded('menuItem')),
            'qty_ordered' => $this->qty_ordered,
            'item_total' => $this->qty_ordered * $this->menuItem->price,
            'formatted_item_total' => number_format((float) ($this->qty_ordered * $this->menuItem->price), 2),
        ];
    }
}