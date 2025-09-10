<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        User::create([
            'first_name' => 'Dr. Ayad',
            'last_name' => 'Soumia',
            'email' => 'admin@brightsmile.dz',
            'password' => Hash::make('password123'),
            'phone' => '05 41 70 60 27',
            'role' => 'admin',
            'is_active' => true,
        ]);

        // Create doctor user
        User::create([
            'first_name' => 'Dr. Ahmed',
            'last_name' => 'Benali',
            'email' => 'doctor@brightsmile.dz',
            'password' => Hash::make('password123'),
            'phone' => '05 41 70 60 28',
            'role' => 'doctor',
            'is_active' => true,
        ]);

        // Create sample patients with Algerian names
        $patients = [
            [
                'first_name' => 'Amina',
                'last_name' => 'Bensalem',
                'email' => 'amina.bensalem@email.dz',
                'phone' => '0661234567',
                'birth_date' => '1990-05-15',
                'address' => 'Cité El Badr, Oran',
                'medical_notes' => 'Allergie à la pénicilline',
            ],
            [
                'first_name' => 'Youcef',
                'last_name' => 'Meziane',
                'email' => 'youcef.meziane@email.dz',
                'phone' => '0662345678',
                'birth_date' => '1985-08-22',
                'address' => 'Hai El Badr, Alger',
                'medical_notes' => 'Diabète type 2',
            ],
            [
                'first_name' => 'Fatima',
                'last_name' => 'Boumediene',
                'email' => 'fatima.boumediene@email.dz',
                'phone' => '0663456789',
                'birth_date' => '1992-12-03',
                'address' => 'Cité Universitaire, Constantine',
                'medical_notes' => null,
            ],
            [
                'first_name' => 'Karim',
                'last_name' => 'Hadj Ahmed',
                'email' => 'karim.hadjahmed@email.dz',
                'phone' => '0664567890',
                'birth_date' => '1988-03-18',
                'address' => 'Quartier Populaire, Annaba',
                'medical_notes' => 'Hypertension artérielle',
            ],
            [
                'first_name' => 'Aicha',
                'last_name' => 'Khelifi',
                'email' => 'aicha.khelifi@email.dz',
                'phone' => '0665678901',
                'birth_date' => '1995-07-10',
                'address' => 'Centre-ville, Tlemcen',
                'medical_notes' => null,
            ],
            [
                'first_name' => 'Mohamed',
                'last_name' => 'Belabes',
                'email' => 'mohamed.belabes@email.dz',
                'phone' => '0666789012',
                'birth_date' => '1980-11-25',
                'address' => 'Nouvelle ville, Batna',
                'medical_notes' => 'Problèmes cardiaques',
            ],
        ];

        foreach ($patients as $patientData) {
            User::create(array_merge($patientData, [
                'password' => Hash::make('password123'),
                'role' => 'patient',
                'is_active' => true,
            ]));
        }
    }
}
