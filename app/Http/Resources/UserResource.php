<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Disable wrapping so "user" and "me" responses return a flat object.
     *
     * @var string|null
     */
    public static $wrap = null;

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
            'is_admin' => $this->is_admin ?? false,
            'is_banned' => $this->isBanned(),
            'banned_at' => $this->banned_at?->toDateTimeString(),
            'created_at' => $this->created_at?->toDateTimeString(),
            'orders_count' => $this->whenCounted('orders'),
            'reservations_count' => $this->whenCounted('reservations'),
            'reviews_count' => $this->whenCounted('reviews'),
            'orders' => OrderResource::collection($this->whenLoaded('orders')),
        ];
    }
}
