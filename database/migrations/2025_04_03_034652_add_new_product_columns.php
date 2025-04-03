<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Thêm cột vào bảng products nếu cột chưa tồn tại
        if (Schema::hasTable('products')) {
            Schema::table('products', function (Blueprint $table) {
                if (!Schema::hasColumn('products', 'original_price')) {
                    $table->decimal('original_price', 12, 2)->nullable()->after('price');
                }

                if (!Schema::hasColumn('products', 'sold_count')) {
                    $table->integer('sold_count')->default(0)->after('quantity');
                }
            });
        }

        // Sửa tên bảng từ 'variations' thành 'product_variations'
        if (Schema::hasTable('product_variations')) {
            Schema::table('product_variations', function (Blueprint $table) {
                // Kiểm tra xem cột đã tồn tại chưa
                if (!Schema::hasColumn('product_variations', 'original_price')) {
                    $table->decimal('original_price', 12, 2)->nullable()->after('price');
                }

                if (!Schema::hasColumn('product_variations', 'sold_count')) {
                    $table->integer('sold_count')->default(0)->after('quantity');
                }
            });
        }
    }

    public function down(): void
    {
        // Xóa cột từ bảng products
        if (Schema::hasTable('products')) {
            Schema::table('products', function (Blueprint $table) {
                if (Schema::hasColumn('products', 'original_price')) {
                    $table->dropColumn('original_price');
                }

                if (Schema::hasColumn('products', 'sold_count')) {
                    $table->dropColumn('sold_count');
                }
            });
        }

        // Xóa cột từ bảng product_variations
        if (Schema::hasTable('product_variations')) {
            Schema::table('product_variations', function (Blueprint $table) {
                if (Schema::hasColumn('product_variations', 'original_price')) {
                    $table->dropColumn('original_price');
                }

                if (Schema::hasColumn('product_variations', 'sold_count')) {
                    $table->dropColumn('sold_count');
                }
            });
        }
    }
};
