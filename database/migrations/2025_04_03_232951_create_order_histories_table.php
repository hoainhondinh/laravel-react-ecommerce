<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->string('status');
            $table->text('note')->nullable();
            $table->timestamps();
        });

        // Thêm cột cancel_reason và canceled_at vào bảng orders
        Schema::table('orders', function (Blueprint $table) {
            $table->string('cancel_reason')->nullable()->after('address');
            $table->timestamp('canceled_at')->nullable()->after('cancel_reason');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_histories');

        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['cancel_reason', 'canceled_at']);
        });
    }
};
