<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('doctor_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('service_id')->constrained()->onDelete('cascade');
            $table->dateTime('appointment_date');
            $table->enum('status', ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'])->default('scheduled');
            $table->text('notes')->nullable();
            $table->text('patient_notes')->nullable();
            $table->decimal('price', 10, 2)->nullable();
            $table->boolean('is_emergency')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
