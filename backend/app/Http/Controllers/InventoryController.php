<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class InventoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Inventory::query();

        // Filter by category
        if ($request->has('category')) {
            $query->byCategory($request->category);
        }

        // Filter by stock status
        if ($request->has('low_stock') && $request->boolean('low_stock')) {
            $query->lowStock();
        }

        // Filter by expiring items
        if ($request->has('expiring_soon')) {
            $days = $request->expiring_soon ?: 30;
            $query->expiringSoon($days);
        }

        // Search functionality
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('supplier', 'like', "%{$search}%");
            });
        }

        $inventory = $query->orderBy('name')->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $inventory
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string|max:255',
            'current_stock' => 'required|integer|min:0',
            'minimum_stock' => 'required|integer|min:0',
            'unit_price' => 'required|numeric|min:0',
            'supplier' => 'nullable|string|max:255',
            'expiry_date' => 'nullable|date|after:today',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $item = Inventory::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Article ajouté à l\'inventaire avec succès',
            'data' => $item
        ], 201);
    }

    public function show($id)
    {
        $item = Inventory::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $item
        ]);
    }

    public function update(Request $request, $id)
    {
        $item = Inventory::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'category' => 'sometimes|string|max:255',
            'current_stock' => 'sometimes|integer|min:0',
            'minimum_stock' => 'sometimes|integer|min:0',
            'unit_price' => 'sometimes|numeric|min:0',
            'supplier' => 'nullable|string|max:255',
            'expiry_date' => 'nullable|date|after:today',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $item->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Article mis à jour avec succès',
            'data' => $item
        ]);
    }

    public function destroy($id)
    {
        $item = Inventory::findOrFail($id);
        $item->update(['is_active' => false]);

        return response()->json([
            'success' => true,
            'message' => 'Article supprimé avec succès'
        ]);
    }

    public function updateStock(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'quantity' => 'required|integer',
            'type' => 'required|in:add,subtract,set',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $item = Inventory::findOrFail($id);
        $quantity = $request->quantity;

        switch ($request->type) {
            case 'add':
                $newStock = $item->current_stock + $quantity;
                break;
            case 'subtract':
                $newStock = max(0, $item->current_stock - $quantity);
                break;
            case 'set':
                $newStock = max(0, $quantity);
                break;
        }

        $item->update(['current_stock' => $newStock]);

        return response()->json([
            'success' => true,
            'message' => 'Stock mis à jour avec succès',
            'data' => $item
        ]);
    }

    public function getLowStockItems()
    {
        $items = Inventory::lowStock()->active()->get();

        return response()->json([
            'success' => true,
            'data' => $items
        ]);
    }

    public function getExpiringItems(Request $request)
    {
        $days = $request->get('days', 30);
        $items = Inventory::expiringSoon($days)->active()->get();

        return response()->json([
            'success' => true,
            'data' => $items
        ]);
    }

    public function getCategories()
    {
        $categories = Inventory::active()
            ->select('category')
            ->distinct()
            ->pluck('category');

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    public function getStats()
    {
        $totalItems = Inventory::active()->count();
        $lowStockItems = Inventory::lowStock()->active()->count();
        $outOfStockItems = Inventory::where('current_stock', 0)->active()->count();
        $expiringItems = Inventory::expiringSoon(30)->active()->count();

        return response()->json([
            'success' => true,
            'data' => [
                'total_items' => $totalItems,
                'low_stock_items' => $lowStockItems,
                'out_of_stock_items' => $outOfStockItems,
                'expiring_items' => $expiringItems,
            ]
        ]);
    }
}
