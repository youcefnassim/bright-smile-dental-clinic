<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Inventory;

class InventorySeeder extends Seeder
{
    public function run(): void
    {
        $inventory = [
            [
                'name' => 'Gants Latex (Boîte de 100)',
                'description' => 'Gants d\'examen en latex poudrés',
                'category' => 'Consommables',
                'current_stock' => 25,
                'minimum_stock' => 10,
                'unit_price' => 850.00,
                'supplier' => 'Medico Algérie',
                'expiry_date' => '2025-12-31',
            ],
            [
                'name' => 'Masques Chirurgicaux (Boîte de 50)',
                'description' => 'Masques chirurgicaux 3 plis',
                'category' => 'Consommables',
                'current_stock' => 15,
                'minimum_stock' => 20,
                'unit_price' => 450.00,
                'supplier' => 'Pharma Dent',
                'expiry_date' => '2025-06-30',
            ],
            [
                'name' => 'Anesthésique Local - Lidocaïne 2%',
                'description' => 'Cartouches d\'anesthésique local',
                'category' => 'Médicaments',
                'current_stock' => 30,
                'minimum_stock' => 15,
                'unit_price' => 120.00,
                'supplier' => 'Dental Pharma',
                'expiry_date' => '2024-12-15',
            ],
            [
                'name' => 'Composite Dentaire - Teinte A2',
                'description' => 'Résine composite photopolymérisable',
                'category' => 'Matériaux',
                'current_stock' => 8,
                'minimum_stock' => 5,
                'unit_price' => 2500.00,
                'supplier' => 'Dental Materials Co.',
                'expiry_date' => '2025-08-20',
            ],
            [
                'name' => 'Aiguilles Dentaires 27G',
                'description' => 'Aiguilles courtes pour anesthésie',
                'category' => 'Instruments',
                'current_stock' => 100,
                'minimum_stock' => 50,
                'unit_price' => 25.00,
                'supplier' => 'Medico Algérie',
                'expiry_date' => null,
            ],
            [
                'name' => 'Désinfectant de Surface',
                'description' => 'Solution désinfectante pour surfaces',
                'category' => 'Hygiène',
                'current_stock' => 5,
                'minimum_stock' => 8,
                'unit_price' => 650.00,
                'supplier' => 'Hygiène Pro',
                'expiry_date' => '2025-03-15',
            ],
            [
                'name' => 'Fraises Diamantées Assortiment',
                'description' => 'Set de fraises diamantées diverses formes',
                'category' => 'Instruments',
                'current_stock' => 12,
                'minimum_stock' => 6,
                'unit_price' => 1200.00,
                'supplier' => 'Dental Tools Ltd',
                'expiry_date' => null,
            ],
            [
                'name' => 'Coton Hydrophile (500g)',
                'description' => 'Coton médical stérilisé',
                'category' => 'Consommables',
                'current_stock' => 20,
                'minimum_stock' => 10,
                'unit_price' => 350.00,
                'supplier' => 'Pharma Dent',
                'expiry_date' => null,
            ],
            [
                'name' => 'Radiographies Dentaires',
                'description' => 'Films radiographiques intra-oraux',
                'category' => 'Imagerie',
                'current_stock' => 3,
                'minimum_stock' => 10,
                'unit_price' => 180.00,
                'supplier' => 'Radio Dent',
                'expiry_date' => '2025-01-30',
            ],
            [
                'name' => 'Ciment Dentaire Temporaire',
                'description' => 'Ciment provisoire pour obturations',
                'category' => 'Matériaux',
                'current_stock' => 6,
                'minimum_stock' => 4,
                'unit_price' => 890.00,
                'supplier' => 'Dental Materials Co.',
                'expiry_date' => '2025-11-10',
            ],
        ];

        foreach ($inventory as $item) {
            Inventory::create($item);
        }
    }
}
