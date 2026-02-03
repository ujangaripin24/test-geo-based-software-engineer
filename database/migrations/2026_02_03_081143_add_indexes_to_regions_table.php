<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('regions', function (Blueprint $table) {
            $table->index('organization_id');
        });

        DB::statement('CREATE INDEX regions_geom_gist ON regions USING GIST (geom)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('regions', function (Blueprint $table) {
            $table->dropIndex(['organization_id']);
        });

        DB::statement('DROP INDEX IF EXISTS regions_geom_gist');
    }
};
