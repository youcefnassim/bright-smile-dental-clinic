<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Appointment;
use App\Models\User;
use App\Models\Service;
use Carbon\Carbon;

class AppointmentSeeder extends Seeder
{
    public function run(): void
    {
        $patients = User::patients()->get();
        $doctor = User::doctors()->first();
        $services = Service::all();

        if (!$doctor || $patients->isEmpty() || $services->isEmpty()) {
            return;
        }

        // Create appointments for the next 2 weeks
        $appointments = [
            [
                'patient_id' => $patients->random()->id,
                'service_id' => $services->where('name', 'Consultation Générale')->first()->id,
                'appointment_date' => Carbon::today()->setTime(9, 0),
                'status' => 'confirmed',
                'notes' => 'Consultation de routine',
            ],
            [
                'patient_id' => $patients->random()->id,
                'service_id' => $services->where('name', 'Détartrage')->first()->id,
                'appointment_date' => Carbon::today()->setTime(10, 30),
                'status' => 'scheduled',
                'patient_notes' => 'Première visite pour détartrage',
            ],
            [
                'patient_id' => $patients->random()->id,
                'service_id' => $services->where('name', 'Plombage Composite')->first()->id,
                'appointment_date' => Carbon::today()->setTime(14, 0),
                'status' => 'in_progress',
                'notes' => 'Carie sur molaire supérieure droite',
            ],
            [
                'patient_id' => $patients->random()->id,
                'service_id' => $services->where('name', 'Urgence Dentaire')->first()->id,
                'appointment_date' => Carbon::tomorrow()->setTime(9, 30),
                'status' => 'scheduled',
                'is_emergency' => true,
                'patient_notes' => 'Douleur intense depuis hier soir',
            ],
            [
                'patient_id' => $patients->random()->id,
                'service_id' => $services->where('name', 'Blanchiment Dentaire')->first()->id,
                'appointment_date' => Carbon::tomorrow()->setTime(15, 0),
                'status' => 'confirmed',
            ],
            [
                'patient_id' => $patients->random()->id,
                'service_id' => $services->where('name', 'Consultation Générale')->first()->id,
                'appointment_date' => Carbon::yesterday()->setTime(10, 0),
                'status' => 'completed',
                'notes' => 'Contrôle post-traitement satisfaisant',
            ],
            [
                'patient_id' => $patients->random()->id,
                'service_id' => $services->where('name', 'Extraction Dentaire')->first()->id,
                'appointment_date' => Carbon::now()->subDays(2)->setTime(14, 30),
                'status' => 'completed',
                'notes' => 'Extraction de dent de sagesse',
            ],
            [
                'patient_id' => $patients->random()->id,
                'service_id' => $services->where('name', 'Orthodontie - Consultation')->first()->id,
                'appointment_date' => Carbon::now()->addDays(3)->setTime(11, 0),
                'status' => 'scheduled',
                'patient_notes' => 'Consultation pour appareil dentaire',
            ],
        ];

        foreach ($appointments as $appointmentData) {
            $service = Service::find($appointmentData['service_id']);
            Appointment::create(array_merge($appointmentData, [
                'doctor_id' => $doctor->id,
                'price' => $service->price,
            ]));
        }
    }
}
