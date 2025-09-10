<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Appointment::with(['patient', 'doctor', 'service']);

        // Filter by date range
        if ($request->has('date_from')) {
            $query->whereDate('appointment_date', '>=', $request->date_from);
        }
        if ($request->has('date_to')) {
            $query->whereDate('appointment_date', '<=', $request->date_to);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by patient (for patient users)
        if ($request->user()->isPatient()) {
            $query->where('patient_id', $request->user()->id);
        }

        // Filter by doctor
        if ($request->has('doctor_id')) {
            $query->where('doctor_id', $request->doctor_id);
        }

        $appointments = $query->orderBy('appointment_date', 'desc')->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $appointments
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'service_id' => 'required|exists:services,id',
            'appointment_date' => 'required|date|after:now',
            'patient_notes' => 'nullable|string',
            'is_emergency' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        // Check if slot is available
        $appointmentDate = Carbon::parse($request->appointment_date);
        $service = Service::findOrFail($request->service_id);
        
        $conflictingAppointment = Appointment::where('appointment_date', $appointmentDate)
            ->whereIn('status', ['scheduled', 'confirmed', 'in_progress'])
            ->first();

        if ($conflictingAppointment) {
            return response()->json([
                'success' => false,
                'message' => 'Ce créneau n\'est pas disponible'
            ], 409);
        }

        // Assign to first available doctor (simplified logic)
        $doctor = User::doctors()->active()->first();
        
        if (!$doctor) {
            return response()->json([
                'success' => false,
                'message' => 'Aucun médecin disponible'
            ], 400);
        }

        $appointment = Appointment::create([
            'patient_id' => $request->user()->id,
            'doctor_id' => $doctor->id,
            'service_id' => $request->service_id,
            'appointment_date' => $appointmentDate,
            'patient_notes' => $request->patient_notes,
            'is_emergency' => $request->is_emergency ?? false,
            'price' => $service->price,
        ]);

        $appointment->load(['patient', 'doctor', 'service']);

        return response()->json([
            'success' => true,
            'message' => 'Rendez-vous créé avec succès',
            'data' => $appointment
        ], 201);
    }

    public function show($id)
    {
        $appointment = Appointment::with(['patient', 'doctor', 'service', 'medicalRecords'])->findOrFail($id);

        // Check authorization
        if (request()->user()->isPatient() && $appointment->patient_id !== request()->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $appointment
        ]);
    }

    public function update(Request $request, $id)
    {
        $appointment = Appointment::findOrFail($id);

        // Check authorization
        if ($request->user()->isPatient() && $appointment->patient_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'appointment_date' => 'sometimes|date|after:now',
            'status' => 'sometimes|in:scheduled,confirmed,in_progress,completed,cancelled,no_show',
            'notes' => 'nullable|string',
            'patient_notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        // Patients can only update their notes and cancel appointments
        if ($request->user()->isPatient()) {
            $allowedFields = ['patient_notes'];
            if ($request->status === 'cancelled' && $appointment->canBeCancelled()) {
                $allowedFields[] = 'status';
            }
            $updateData = $request->only($allowedFields);
        } else {
            $updateData = $request->only([
                'appointment_date', 'status', 'notes', 'patient_notes'
            ]);
        }

        $appointment->update($updateData);
        $appointment->load(['patient', 'doctor', 'service']);

        return response()->json([
            'success' => true,
            'message' => 'Rendez-vous mis à jour avec succès',
            'data' => $appointment
        ]);
    }

    public function destroy($id)
    {
        $appointment = Appointment::findOrFail($id);

        // Check authorization
        if (request()->user()->isPatient() && $appointment->patient_id !== request()->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé'
            ], 403);
        }

        if (!$appointment->canBeCancelled()) {
            return response()->json([
                'success' => false,
                'message' => 'Ce rendez-vous ne peut pas être annulé'
            ], 400);
        }

        $appointment->update(['status' => 'cancelled']);

        return response()->json([
            'success' => true,
            'message' => 'Rendez-vous annulé avec succès'
        ]);
    }

    public function getAvailableSlots(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'date' => 'required|date|after_or_equal:today',
            'service_id' => 'required|exists:services,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $date = Carbon::parse($request->date);
        $service = Service::findOrFail($request->service_id);

        // Generate time slots (9:00 to 17:00, every 30 minutes)
        $slots = [];
        $startTime = $date->copy()->setTime(9, 0);
        $endTime = $date->copy()->setTime(17, 0);

        while ($startTime < $endTime) {
            $slots[] = $startTime->format('H:i');
            $startTime->addMinutes(30);
        }

        // Remove booked slots
        $bookedSlots = Appointment::whereDate('appointment_date', $date)
            ->whereIn('status', ['scheduled', 'confirmed', 'in_progress'])
            ->pluck('appointment_date')
            ->map(fn($datetime) => Carbon::parse($datetime)->format('H:i'))
            ->toArray();

        $availableSlots = array_diff($slots, $bookedSlots);

        return response()->json([
            'success' => true,
            'data' => array_values($availableSlots)
        ]);
    }

    public function getTodayAppointments(Request $request)
    {
        $appointments = Appointment::with(['patient', 'service'])
            ->today()
            ->orderBy('appointment_date')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $appointments
        ]);
    }
}
