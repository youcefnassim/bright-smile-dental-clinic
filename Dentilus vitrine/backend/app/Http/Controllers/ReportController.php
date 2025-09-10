<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\User;
use App\Models\Service;
use App\Models\Inventory;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function getDashboardStats()
    {
        $today = Carbon::today();
        $thisMonth = Carbon::now()->startOfMonth();
        
        // Appointments stats
        $todayAppointments = Appointment::today()->count();
        $thisMonthAppointments = Appointment::where('appointment_date', '>=', $thisMonth)->count();
        $completedAppointments = Appointment::byStatus('completed')->count();
        
        // Patients stats
        $totalPatients = User::patients()->count();
        $newPatientsThisMonth = User::patients()
            ->where('created_at', '>=', $thisMonth)
            ->count();
        
        // Revenue stats (completed appointments)
        $todayRevenue = Appointment::byStatus('completed')
            ->whereDate('appointment_date', $today)
            ->sum('price');
        
        $thisMonthRevenue = Appointment::byStatus('completed')
            ->where('appointment_date', '>=', $thisMonth)
            ->sum('price');
        
        // Inventory alerts
        $lowStockItems = Inventory::lowStock()->active()->count();
        $expiringItems = Inventory::expiringSoon(30)->active()->count();

        return response()->json([
            'success' => true,
            'data' => [
                'appointments' => [
                    'today' => $todayAppointments,
                    'this_month' => $thisMonthAppointments,
                    'completed' => $completedAppointments,
                ],
                'patients' => [
                    'total' => $totalPatients,
                    'new_this_month' => $newPatientsThisMonth,
                ],
                'revenue' => [
                    'today' => $todayRevenue,
                    'this_month' => $thisMonthRevenue,
                ],
                'inventory' => [
                    'low_stock_items' => $lowStockItems,
                    'expiring_items' => $expiringItems,
                ]
            ]
        ]);
    }

    public function getAppointmentReport(Request $request)
    {
        $startDate = $request->get('start_date', Carbon::now()->startOfMonth());
        $endDate = $request->get('end_date', Carbon::now()->endOfMonth());

        $appointments = Appointment::with(['patient', 'service', 'doctor'])
            ->whereBetween('appointment_date', [$startDate, $endDate])
            ->orderBy('appointment_date', 'desc')
            ->get();

        // Group by status
        $byStatus = $appointments->groupBy('status')->map->count();
        
        // Group by service
        $byService = $appointments->groupBy('service.name')->map->count();
        
        // Daily appointments count
        $dailyCount = $appointments->groupBy(function($appointment) {
            return $appointment->appointment_date->format('Y-m-d');
        })->map->count();

        return response()->json([
            'success' => true,
            'data' => [
                'appointments' => $appointments,
                'summary' => [
                    'total' => $appointments->count(),
                    'by_status' => $byStatus,
                    'by_service' => $byService,
                    'daily_count' => $dailyCount,
                ]
            ]
        ]);
    }

    public function getPatientReport(Request $request)
    {
        $patients = User::patients()
            ->with(['patientAppointments', 'patientMedicalRecords'])
            ->withCount(['patientAppointments', 'patientMedicalRecords'])
            ->get();

        // Age distribution
        $ageGroups = $patients->filter(function($patient) {
            return $patient->birth_date;
        })->groupBy(function($patient) {
            $age = Carbon::parse($patient->birth_date)->age;
            if ($age < 18) return '0-17';
            if ($age < 30) return '18-29';
            if ($age < 45) return '30-44';
            if ($age < 60) return '45-59';
            return '60+';
        })->map->count();

        // New patients by month
        $newPatientsByMonth = $patients->groupBy(function($patient) {
            return $patient->created_at->format('Y-m');
        })->map->count();

        return response()->json([
            'success' => true,
            'data' => [
                'patients' => $patients,
                'summary' => [
                    'total' => $patients->count(),
                    'age_groups' => $ageGroups,
                    'new_by_month' => $newPatientsByMonth,
                ]
            ]
        ]);
    }

    public function getFinancialReport(Request $request)
    {
        $startDate = $request->get('start_date', Carbon::now()->startOfMonth());
        $endDate = $request->get('end_date', Carbon::now()->endOfMonth());

        $completedAppointments = Appointment::byStatus('completed')
            ->with(['service', 'patient'])
            ->whereBetween('appointment_date', [$startDate, $endDate])
            ->get();

        $totalRevenue = $completedAppointments->sum('price');
        
        // Revenue by service
        $revenueByService = $completedAppointments->groupBy('service.name')
            ->map(function($appointments) {
                return $appointments->sum('price');
            });

        // Daily revenue
        $dailyRevenue = $completedAppointments->groupBy(function($appointment) {
            return $appointment->appointment_date->format('Y-m-d');
        })->map(function($appointments) {
            return $appointments->sum('price');
        });

        // Monthly revenue trend
        $monthlyRevenue = $completedAppointments->groupBy(function($appointment) {
            return $appointment->appointment_date->format('Y-m');
        })->map(function($appointments) {
            return $appointments->sum('price');
        });

        return response()->json([
            'success' => true,
            'data' => [
                'appointments' => $completedAppointments,
                'summary' => [
                    'total_revenue' => $totalRevenue,
                    'total_appointments' => $completedAppointments->count(),
                    'average_per_appointment' => $completedAppointments->count() > 0 ? $totalRevenue / $completedAppointments->count() : 0,
                    'revenue_by_service' => $revenueByService,
                    'daily_revenue' => $dailyRevenue,
                    'monthly_revenue' => $monthlyRevenue,
                ]
            ]
        ]);
    }

    public function getInventoryReport()
    {
        $inventory = Inventory::active()->get();
        
        $totalValue = $inventory->sum(function($item) {
            return $item->current_stock * $item->unit_price;
        });

        $lowStockItems = $inventory->filter->isLowStock();
        $outOfStockItems = $inventory->filter->isOutOfStock();
        $expiringItems = $inventory->filter(function($item) {
            return $item->expiry_date && $item->expiry_date <= Carbon::now()->addDays(30);
        });

        // Group by category
        $byCategory = $inventory->groupBy('category')->map(function($items) {
            return [
                'count' => $items->count(),
                'total_value' => $items->sum(function($item) {
                    return $item->current_stock * $item->unit_price;
                })
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'inventory' => $inventory,
                'summary' => [
                    'total_items' => $inventory->count(),
                    'total_value' => $totalValue,
                    'low_stock_count' => $lowStockItems->count(),
                    'out_of_stock_count' => $outOfStockItems->count(),
                    'expiring_count' => $expiringItems->count(),
                    'by_category' => $byCategory,
                ],
                'alerts' => [
                    'low_stock' => $lowStockItems->values(),
                    'out_of_stock' => $outOfStockItems->values(),
                    'expiring' => $expiringItems->values(),
                ]
            ]
        ]);
    }
}
