<?php


namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Laravel\Scout\EngineManager;
use MeiliSearch\Client;

class MeiliSearchServiceProvider extends ServiceProvider
{
    public function boot()
    {
        // Đảm bảo MeiliSearch được cấu hình đúng
        $this->app->singleton(Client::class, function () {
            return new Client(
                config('scout.meilisearch.host'),
                config('scout.meilisearch.key')
            );
        });

        // Đảm bảo encoding đúng
        $this->app->resolving(EngineManager::class, function ($manager) {
            $manager->extend('meilisearch', function () {
                return new \Laravel\Scout\Engines\MeiliSearchEngine(
                    app(Client::class),
                    config('scout.soft_delete')
                );
            });
        });
    }

    public function register()
    {
        //
    }
}
