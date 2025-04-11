<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Kiểm tra xem các cột đã tồn tại chưa
            if (!Schema::hasColumn('orders', 'is_guest')) {
                $table->boolean('is_guest')->default(false)->after('user_id');
            }

            if (!Schema::hasColumn('orders', 'token')) {
                $table->string('token', 100)->nullable()->after('is_guest');
            }

            // Thêm index cho token để tăng tốc truy vấn
            $table->index('token');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            if (Schema::hasColumn('orders', 'is_guest')) {
                $table->dropColumn('is_guest');
            }

            if (Schema::hasColumn('orders', 'token')) {
                $table->dropIndex(['token']);
                $table->dropColumn('token');
            }
        });
    }
};
