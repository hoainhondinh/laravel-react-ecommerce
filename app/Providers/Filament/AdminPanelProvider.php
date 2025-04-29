<?php

namespace App\Providers\Filament;

use App\Enums\RolesEnum;
use Closure;
use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Pages;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\Widgets;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;
use Illuminate\Database\Eloquent\Model;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->brandLogo(asset('images/logo-light.png'))      // Logo cho chế độ sáng
            ->darkModeBrandLogo(asset('images/logo-dark.png')) // Logo cho chế độ tối
            ->sidebarWidth('14rem')
            ->login()
            ->colors([
                'primary' => Color::hex('#9E7A47'),    // Mocha
                'secondary' => Color::hex('#A7C5A4'),  // Soft Green
                'accent' => Color::hex('#FFBF49'),     // Amber Gold
                'danger' => Color::hex('#F87272'),     // Error
                'success' => Color::hex('#36D399'),    // Success
                'warning' => Color::hex('#FBBD23'),    // Warning
            ])
            ->darkMode(true)
            ->collapsibleNavigationGroups()
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\\Filament\\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\\Filament\\Pages')
            ->pages([
                Pages\Dashboard::class,
            ])
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\\Filament\\Widgets')
            ->widgets([
                Widgets\AccountWidget::class,
//                Widgets\FilamentInfoWidget::class,
            ])
            ->middleware(middleware: [
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                VerifyCsrfToken::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
                'auth',
                sprintf('role:%s|%s',
                    RolesEnum::Admin->value,
                    RolesEnum::Vendor->value,
                )
            ]);
//            ->authMiddleware([
//                Authenticate::class,
//            ]);
    }

    public function boot()
    {
        Model::unguard();
    }
}
