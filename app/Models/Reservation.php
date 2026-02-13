<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'email',
        'phone',
        'reservation_date',
        'reservation_time',
        'party_size',
        'status', // pending, confirmed, cancelled
        'special_request',
    ];
    
    protected $casts = [
        'reservation_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
