<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Service;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            [
                'name' => 'Consultation Générale',
                'description' => 'Examen dentaire complet avec diagnostic et conseils personnalisés',
                'price' => 2500.00,
                'duration_minutes' => 30,
                'category' => 'Consultation',
                'icon' => 'fas fa-stethoscope',
            ],
            [
                'name' => 'Détartrage',
                'description' => 'Nettoyage professionnel pour éliminer le tartre et la plaque dentaire',
                'price' => 3500.00,
                'duration_minutes' => 45,
                'category' => 'Hygiène',
                'icon' => 'fas fa-tooth',
            ],
            [
                'name' => 'Plombage Composite',
                'description' => 'Restauration dentaire avec matériau composite de haute qualité',
                'price' => 4500.00,
                'duration_minutes' => 60,
                'category' => 'Restauration',
                'icon' => 'fas fa-tools',
            ],
            [
                'name' => 'Extraction Dentaire',
                'description' => 'Extraction simple ou chirurgicale selon le cas',
                'price' => 3000.00,
                'duration_minutes' => 45,
                'category' => 'Chirurgie',
                'icon' => 'fas fa-cut',
            ],
            [
                'name' => 'Couronne Céramique',
                'description' => 'Prothèse fixe en céramique pour restaurer une dent endommagée',
                'price' => 15000.00,
                'duration_minutes' => 90,
                'category' => 'Prothèse',
                'icon' => 'fas fa-crown',
            ],
            [
                'name' => 'Implant Dentaire',
                'description' => 'Remplacement de racine dentaire par implant en titane',
                'price' => 25000.00,
                'duration_minutes' => 120,
                'category' => 'Implantologie',
                'icon' => 'fas fa-screw',
            ],
            [
                'name' => 'Blanchiment Dentaire',
                'description' => 'Traitement professionnel pour éclaircir les dents',
                'price' => 8000.00,
                'duration_minutes' => 60,
                'category' => 'Esthétique',
                'icon' => 'fas fa-smile',
            ],
            [
                'name' => 'Orthodontie - Consultation',
                'description' => 'Évaluation orthodontique et plan de traitement',
                'price' => 3000.00,
                'duration_minutes' => 45,
                'category' => 'Orthodontie',
                'icon' => 'fas fa-align-center',
            ],
            [
                'name' => 'Traitement de Canal',
                'description' => 'Endodontie pour traiter les infections de la pulpe dentaire',
                'price' => 8500.00,
                'duration_minutes' => 90,
                'category' => 'Endodontie',
                'icon' => 'fas fa-syringe',
            ],
            [
                'name' => 'Urgence Dentaire',
                'description' => 'Prise en charge immédiate des douleurs et traumatismes',
                'price' => 4000.00,
                'duration_minutes' => 30,
                'category' => 'Urgence',
                'icon' => 'fas fa-ambulance',
            ],
        ];

        foreach ($services as $service) {
            Service::create($service);
        }
    }
}
