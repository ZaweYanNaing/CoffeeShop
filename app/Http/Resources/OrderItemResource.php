<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'quantity' => $this->quantity,
            'unit_price' => (float) $this->unit_price,
            'subtotal' => (float) $this->subtotal,
            'product' => new ProductResource($this->whenLoaded('product')),
        ];
    }
}
