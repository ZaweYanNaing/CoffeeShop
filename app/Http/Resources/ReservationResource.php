<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReservationResource extends JsonResource
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
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'reservation_date' => $this->reservation_date->format('Y-m-d'),
            'reservation_time' => $this->reservation_time,
            'party_size' => $this->party_size,
            'status' => $this->status,
            'special_request' => $this->special_request,
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
