<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TreatmentPlan;
use App\Models\User;
use Carbon\Carbon;

class TreatmentPlanSeeder extends Seeder
{
    public function run(): void
    {
        $patients = User::patients()->get();
        $doctor = User::doctors()->first();

        if (!$doctor || $patients->isEmpty()) {
            return;
        }

        $treatmentPlans = [
            [
                'patient_id' => $patients->random()->id,
                'title' => 'Traitement Orthodontique Complet',
                'description' => 'Plan de traitement orthodontique sur 24 mois incluant pose d\'appareil, ajustements mensuels et suivi.',
                'status' => 'active',
                'start_date' => Carbon::now()->subMonths(2),
                'end_date' => Carbon::now()->addMonths(22),
                'total_cost' => 45000.00,
            ],
            [
                'patient_id' => $patients->random()->id,
                'title' => 'Réhabilitation Prothétique',
                'description' => 'Remplacement de plusieurs dents manquantes par couronnes et bridges.',
                'status' => 'draft',
                'start_date' => Carbon::now()->addWeeks(2),
                'end_date' => Carbon::now()->addMonths(4),
                'total_cost' => 32000.00,
            ],
            [
                'patient_id' => $patients->random()->id,
                'title' => 'Traitement Parodontal',
                'description' => 'Traitement complet de la maladie parodontale avec détartrages profonds et maintenance.',
                'status' => 'active',
                'start_date' => Carbon::now()->subWeeks(3),
                'end_date' => Carbon::now()->addMonths(6),
                'total_cost' => 18500.00,
            ],
            [
                'patient_id' => $patients->random()->id,
                'title' => 'Implantologie Multiple',
                'description' => 'Pose de 3 implants dentaires avec couronnes sur implants.',
                'status' => 'completed',
                'start_date' => Carbon::now()->subMonths(8),
                'end_date' => Carbon::now()->subMonths(2),
                'total_cost' => 85000.00,
            ],
            [
                'patient_id' => $patients->random()->id,
                'title' => 'Restaurations Esthétiques',
                'description' => 'Blanchiment dentaire et facettes céramiques pour améliorer l\'esthétique du sourire.',
                'status' => 'draft',
                'start_date' => Carbon::now()->addMonth(),
                'end_date' => Carbon::now()->addMonths(3),
                'total_cost' => 28000.00,
            ],
        ];

        foreach ($treatmentPlans as $planData) {
            TreatmentPlan::create(array_merge($planData, [
                'doctor_id' => $doctor->id,
            ]));
        }
    }
}
