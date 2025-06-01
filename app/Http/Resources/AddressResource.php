<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AddressResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'customer_id' => $this->when(isset($this->customer_id), $this->customer_id),
            'unit_number' => $this->unit_number,
            'street_number' => $this->street_number,
            'address_line1' => $this->address_line1,
            'address_line2' => $this->address_line2,
            'city' => $this->city,
            'region' => $this->region,
            'postal_code' => $this->postal_code,
            'country' => new CountryResource($this->whenLoaded('country')),
            'full_address' => $this->getFullAddress(),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }

    private function getFullAddress(): string
    {
        $parts = array_filter([
            $this->unit_number ? "Unit {$this->unit_number}" : null,
            $this->street_number,
            $this->address_line1,
            $this->address_line2,
            $this->city,
            $this->region,
            $this->postal_code,
            $this->country?->country_name ?? null,
        ]);

        return implode(', ', $parts);
    }
}