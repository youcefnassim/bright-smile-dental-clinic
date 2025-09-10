<?php

namespace App\Http\Controllers;

use App\Models\TreatmentPlan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TreatmentPlanController extends Controller
{
    public function index(Request $request)
    {
        $query = TreatmentPlan::with(['patient', 'doctor']);

        // Filter by patient
        if ($request->has('patient_id')) {
            $query->where('patient_id', $request->patient_id);
        }

        // Filter by doctor
        if ($request->has('doctor_id')) {
            $query->where('doctor_id', $request->doctor_id);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->byStatus($request->status);
        }

        // For patients, only show their own plans
        if ($request->user()->isPatient()) {
            $query->where('patient_id', $request->user()->id);
        }

        $plans = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $plans
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'patient_id' => 'required|exists:users,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'total_cost' => 'nullable|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        // Verify patient exists and is a patient
        $patient = User::patients()->findOrFail($request->patient_id);

        $plan = TreatmentPlan::create([
            'patient_id' => $request->patient_id,
            'doctor_id' => $request->user()->id,
            'title' => $request->title,
            'description' => $request->description,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'total_cost' => $request->total_cost,
        ]);

        $plan->load(['patient', 'doctor']);

        return response()->json([
            'success' => true,
            'message' => 'Plan de traitement créé avec succès',
            'data' => $plan
        ], 201);
    }

    public function show($id)
    {
        $plan = TreatmentPlan::with(['patient', 'doctor'])->findOrFail($id);

        // Check authorization
        if (request()->user()->isPatient() && $plan->patient_id !== request()->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $plan
        ]);
    }

    public function update(Request $request, $id)
    {
        $plan = TreatmentPlan::findOrFail($id);

        // Check authorization
        if ($request->user()->isPatient()) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'status' => 'sometimes|in:draft,active,completed,cancelled',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'total_cost' => 'nullable|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], 422);
        }

        $plan->update($request->only([
            'title', 'description', 'status', 'start_date', 'end_date', 'total_cost'
        ]));

        $plan->load(['patient', 'doctor']);

        return response()->json([
            'success' => true,
            'message' => 'Plan de traitement mis à jour avec succès',
            'data' => $plan
        ]);
    }

    public function destroy($id)
    {
        $plan = TreatmentPlan::findOrFail($id);

        // Check authorization
        if (request()->user()->isPatient()) {
            return response()->json([
                'success' => false,
                'message' => 'Non autorisé'
            ], 403);
        }

        $plan->update(['status' => 'cancelled']);

        return response()->json([
            'success' => true,
            'message' => 'Plan de traitement annulé avec succès'
        ]);
    }

    public function getStats()
    {
        $totalPlans = TreatmentPlan::count();
        $activePlans = TreatmentPlan::active()->count();
        $completedPlans = TreatmentPlan::completed()->count();
        $draftPlans = TreatmentPlan::byStatus('draft')->count();

        return response()->json([
            'success' => true,
            'data' => [
                'total_plans' => $totalPlans,
                'active_plans' => $activePlans,
                'completed_plans' => $completedPlans,
                'draft_plans' => $draftPlans,
            ]
        ]);
    }
}
