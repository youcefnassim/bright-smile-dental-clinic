<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\TreatmentPlanController;
use App\Http\Controllers\ReportController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public services (for appointment booking)
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{id}', [ServiceController::class, 'show']);
Route::get('/services/categories', [ServiceController::class, 'getCategories']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    
    // Authentication
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::put('/change-password', [AuthController::class, 'changePassword']);

    // Appointments
    Route::apiResource('appointments', AppointmentController::class);
    Route::get('/appointments/slots/available', [AppointmentController::class, 'getAvailableSlots']);
    Route::get('/appointments/today/list', [AppointmentController::class, 'getTodayAppointments']);

    // Patients (Admin/Doctor only for most operations)
    Route::middleware('role:admin,doctor')->group(function () {
        Route::apiResource('patients', PatientController::class);
        Route::get('/patients/{id}/appointments', [PatientController::class, 'getAppointments']);
        Route::get('/patients/{id}/medical-records', [PatientController::class, 'getMedicalRecords']);
        Route::get('/patients/{id}/treatment-plans', [PatientController::class, 'getTreatmentPlans']);
        Route::get('/patients/stats/overview', [PatientController::class, 'getStats']);
    });

    // Services (Admin/Doctor only for modifications)
    Route::middleware('role:admin,doctor')->group(function () {
        Route::post('/services', [ServiceController::class, 'store']);
        Route::put('/services/{id}', [ServiceController::class, 'update']);
        Route::delete('/services/{id}', [ServiceController::class, 'destroy']);
    });

    // Inventory (Admin/Doctor only)
    Route::middleware('role:admin,doctor')->group(function () {
        Route::apiResource('inventory', InventoryController::class);
        Route::put('/inventory/{id}/stock', [InventoryController::class, 'updateStock']);
        Route::get('/inventory/alerts/low-stock', [InventoryController::class, 'getLowStockItems']);
        Route::get('/inventory/alerts/expiring', [InventoryController::class, 'getExpiringItems']);
        Route::get('/inventory/categories/list', [InventoryController::class, 'getCategories']);
        Route::get('/inventory/stats/overview', [InventoryController::class, 'getStats']);
    });

    // Treatment Plans
    Route::apiResource('treatment-plans', TreatmentPlanController::class);
    Route::get('/treatment-plans/stats/overview', [TreatmentPlanController::class, 'getStats']);

    // Reports (Admin/Doctor only)
    Route::middleware('role:admin,doctor')->group(function () {
        Route::get('/reports/dashboard', [ReportController::class, 'getDashboardStats']);
        Route::get('/reports/appointments', [ReportController::class, 'getAppointmentReport']);
        Route::get('/reports/patients', [ReportController::class, 'getPatientReport']);
        Route::get('/reports/financial', [ReportController::class, 'getFinancialReport']);
        Route::get('/reports/inventory', [ReportController::class, 'getInventoryReport']);
    });
});

// Fallback route
Route::fallback(function () {
    return response()->json([
        'success' => false,
        'message' => 'Endpoint non trouvé'
    ], 404);
});
