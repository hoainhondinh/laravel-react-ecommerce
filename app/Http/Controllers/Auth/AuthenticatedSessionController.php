<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Services\CartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;
use App\Enums\RolesEnum;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
            'checkoutPending' => session('checkout_pending', false), // Thêm biến này
        ]);
    }

    /**
     * Handle an incoming authentication request.
     * @throws ValidationException
     */
    public function store(LoginRequest $request, CartService $cartService): \Symfony\Component\HttpFoundation\Response
    {
        $request->authenticate();

        $request->session()->regenerate();

        /** @var User $user */
        $user = Auth::user();
        $cartService->moveCartItemsToDatabase($user->id);

        // Kiểm tra nếu user đang trong quá trình checkout
        if (session()->has('checkout_pending')) {
            session()->forget('checkout_pending');
            return redirect()->route('checkout.index');
        }

        // Xử lý chuyển hướng tùy thuộc vào vai trò
        if ($user->hasAnyRole([RolesEnum::Admin, RolesEnum::Vendor])) {
            return Inertia::location(route('filament.admin.pages.dashboard'));
        } else {
            $route = route('dashboard', absolute: false);
            return redirect()->intended($route);
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
