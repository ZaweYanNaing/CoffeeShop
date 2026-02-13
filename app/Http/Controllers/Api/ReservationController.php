<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReservationResource;
use App\Models\Reservation;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $reservations = $request->user()->is_admin 
            ? Reservation::latest()->get()
            : $request->user()->reservations()->latest()->get();

        return ReservationResource::collection($reservations);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'reservation_date' => 'required|date|after:today',
            'reservation_time' => 'required',
            'party_size' => 'required|integer|min:1|max:20',
            'name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'nullable|string',
            'special_request' => 'nullable|string',
        ]);

        $reservation = Reservation::create([
            'user_id' => $request->user() ? $request->user()->id : null, 
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'reservation_date' => $validated['reservation_date'],
            'reservation_time' => $validated['reservation_time'],
            'party_size' => $validated['party_size'],
            'status' => 'pending',
            'special_request' => $validated['special_request'] ?? null,
        ]);

        return new ReservationResource($reservation);
    }
}
