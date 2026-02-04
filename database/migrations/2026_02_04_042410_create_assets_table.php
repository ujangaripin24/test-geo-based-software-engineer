<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('assets', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('organization_id')
                ->constrained('organizations')
                ->onDelete('cascade');
                
            $table->foreignUuid('region_id')
                ->constrained('regions')
                ->onDelete('cascade');

            $table->string('name');
            $table->string('category');
            $table->string('status')->default('active');
            $table->jsonb('meta')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index('organization_id');
            $table->index('region_id');
            $table->index(['organization_id', 'category']);
        });
        DB::statement('ALTER TABLE assets ADD COLUMN geom geometry(GEOMETRY, 4326)');

        DB::statement('CREATE INDEX assets_geom_gist ON assets USING GIST (geom)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assets');
    }
};
