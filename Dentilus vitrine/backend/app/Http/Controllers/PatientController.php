<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Appointment;
use App\Models\MedicalRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class PatientController extends Controller
{
    public function index(Request $request)
    {
        $query = User::patients()->with(['patientAppointments', 'patientMedicalRecords']);

        // Search functionality
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        // Filter by active status
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $patients = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $patients
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'phone' => 'nullable|string|max:20',
            'birth_date' => 'nullable|date',
            'address' => 'nullable|string',
            'medical_notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $patient = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'birth_date' => $request->birth_date,
            'address' => $request->address,
            'medical_notes' => $request->medical_notes,
            'role' => 'patient',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Patient créé avec succès',
            'data' => $patient
        ], 201);
    }

    public function show($id)
    {
        $patient = User::patients()
            ->with([
                'patientAppointments.service',
                'patientAppointments.doctor',
                'patientMedicalRecords.doctor',
                'patientTreatmentPlans.doctor'
            ])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $patient
        ]);
    }

    public function update(Request $request, $id)
    {
        $patient = User::patients()->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $patient->id,
            'phone' => 'nullable|string|max:20',
            'birth_date' => 'nullable|date',
            'address' => 'nullable|string',
            'medical_notes' => 'nullable|string',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $patient->update($request->only([
            'first_name', 'last_name', 'email', 'phone',
            'birth_date', 'address', 'medical_notes', 'is_active'
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Patient mis à jour avec succès',
            'data' => $patient
        ]);
    }

    public function destroy($id)
    {
        $patient = User::patients()->findOrFail($id);

        // Soft delete by deactivating
        $patient->update(['is_active' => false]);

        return response()->json([
            'success' => true,
            'message' => 'Patient désactivé avec succès'
        ]);
    }

    public function getAppointments($id)
    {
        $patient = User::patients()->findOrFail($id);
        
        $appointments = $patient->patientAppointments()
            ->with(['service', 'doctor'])
            ->orderBy('appointment_date', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $appointments
        ]);
    }

    public function getMedicalRecords($id)
    {
        $patient = User::patients()->findOrFail($id);
        
        $records = $patient->patientMedicalRecords()
            ->with(['doctor', 'appointment'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data' => $records
        ]);
    }

    public function getTreatmentPlans($id)
    {
        $patient = User::patients()->findOrFail($id);
        
        $plans = $patient->patientTreatmentPlans()
            ->with('doctor')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $plans
        ]);
    }

    public function getStats()
    {
        $totalPatients = User::patients()->count();
        $activePatients = User::patients()->active()->count();
        $newPatientsThisMonth = User::patients()
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        return response()->json([
            'success' => true,
            'data' => [
                'total_patients' => $totalPatients,
                'active_patients' => $activePatients,
                'new_patients_this_month' => $newPatientsThisMonth,
            ]
        ]);
    }
}
