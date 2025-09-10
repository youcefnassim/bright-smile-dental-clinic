<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'category',
        'current_stock',
        'minimum_stock',
        'unit_price',
        'supplier',
        'expiry_date',
        'is_active',
    ];

    protected $casts = [
        'current_stock' => 'integer',
        'minimum_stock' => 'integer',
        'unit_price' => 'decimal:2',
        'expiry_date' => 'date',
        'is_active' => 'boolean',
    ];

    // Scopes
    public function scopeLowStock($query)
    {
        return $query->whereColumn('current_stock', '<=', 'minimum_stock');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeExpiringSoon($query, $days = 30)
    {
        return $query->where('expiry_date', '<=', now()->addDays($days));
    }

    // Accessors
    public function getStockStatusAttribute()
    {
        if ($this->current_stock <= 0) {
            return 'out_of_stock';
        } elseif ($this->current_stock <= $this->minimum_stock) {
            return 'low_stock';
        }
        return 'in_stock';
    }

    public function getFormattedPriceAttribute()
    {
        return number_format($this->unit_price, 2) . ' DA';
    }

    // Methods
    public function isLowStock()
    {
        return $this->current_stock <= $this->minimum_stock;
    }

    public function isOutOfStock()
    {
        return $this->current_stock <= 0;
    }
}
