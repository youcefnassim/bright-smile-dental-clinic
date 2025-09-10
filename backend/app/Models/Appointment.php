<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'doctor_id',
        'service_id',
        'appointment_date',
        'status',
        'notes',
        'patient_notes',
        'price',
        'is_emergency',
    ];

    protected $casts = [
        'appointment_date' => 'datetime',
        'price' => 'decimal:2',
        'is_emergency' => 'boolean',
    ];

    // Relationships
    public function patient()
    {
        return $this->belongsTo(User::class, 'patient_id');
    }

    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function medicalRecords()
    {
        return $this->hasMany(MedicalRecord::class);
    }

    // Scopes
    public function scopeToday($query)
    {
        return $query->whereDate('appointment_date', Carbon::today());
    }

    public function scopeUpcoming($query)
    {
        return $query->where('appointment_date', '>', Carbon::now());
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeThisWeek($query)
    {
        return $query->whereBetween('appointment_date', [
            Carbon::now()->startOfWeek(),
            Carbon::now()->endOfWeek()
        ]);
    }

    public function scopeThisMonth($query)
    {
        return $query->whereBetween('appointment_date', [
            Carbon::now()->startOfMonth(),
            Carbon::now()->endOfMonth()
        ]);
    }

    // Accessors
    public function getFormattedDateAttribute()
    {
        return $this->appointment_date->format('d/m/Y');
    }

    public function getFormattedTimeAttribute()
    {
        return $this->appointment_date->format('H:i');
    }

    public function getStatusColorAttribute()
    {
        return match($this->status) {
            'scheduled' => 'blue',
            'confirmed' => 'green',
            'in_progress' => 'orange',
            'completed' => 'gray',
            'cancelled' => 'red',
            'no_show' => 'red',
            default => 'gray'
        };
    }

    // Methods
    public function canBeCancelled()
    {
        return in_array($this->status, ['scheduled', 'confirmed']) && 
               $this->appointment_date > Carbon::now()->addHours(24);
    }

    public function canBeRescheduled()
    {
        return in_array($this->status, ['scheduled', 'confirmed']);
    }
}
