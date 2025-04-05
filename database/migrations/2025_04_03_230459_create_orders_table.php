<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->decimal('total_price', 12, 2);
            $table->string('status')->default('pending'); // pending, processing, completed, canceled
            $table->string('payment_status')->default('pending'); // pending, paid, awaiting, failed
            $table->string('payment_method'); // cod, bank_transfer
            $table->string('transaction_id')->nullable();
            $table->text('payment_error')->nullable();
            $table->string('name');
            $table->string('email');
            $table->string('phone');
            $table->text('address');
            $table->string('payment_reference')->nullable();
            $table->string('payment_token')->nullable();
            $table->timestamp('payment_expires_at')->nullable();
            $table->text('cancel_reason')->nullable();
            $table->timestamp('canceled_at')->nullable();
            $table->text('admin_note')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
