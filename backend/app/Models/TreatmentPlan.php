<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TreatmentPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'doctor_id',
        'title',
        'description',
        'status',
        'start_date',
        'end_date',
        'total_cost',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'total_cost' => 'decimal:2',
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

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    // Accessors
    public function getFormattedTotalCostAttribute()
    {
        return number_format($this->total_cost, 2) . ' DA';
    }

    public function getStatusBadgeAttribute()
    {
        return match($this->status) {
            'draft' => 'secondary',
            'active' => 'primary',
            'completed' => 'success',
            'cancelled' => 'danger',
            default => 'secondary'
        };
    }
}
