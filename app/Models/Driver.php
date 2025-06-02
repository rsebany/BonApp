<?php 

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Driver extends Model
{
    use SoftDeletes,HasFactory;

    protected $fillable = [
        'user_id',
        'driver_license_number',
        'vehicle_type',
        'vehicle_make',
        'vehicle_model',
        'vehicle_year',
        'vehicle_color',
        'license_plate',
        'is_approved',
        'is_available',
        'current_lat',
        'current_lng'
    ];

    protected $casts = [
        'is_approved' => 'boolean',
        'is_available' => 'boolean'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(FoodOrder::class, 'assigned_driver_id');
    }

    public function scopeAvailable($query)
    {
        return $query->where('is_available', true)
                    ->where('is_approved', true);
    }
}