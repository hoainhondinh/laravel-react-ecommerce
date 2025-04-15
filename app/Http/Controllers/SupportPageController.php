<?php

namespace App\Http\Controllers;

use App\Models\SupportPage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupportPageController extends Controller
{
    /**
     * Display a listing of the support pages.
     */
    public function index()
    {
        return Inertia::render('Support/Index', [
            'supportPages' => SupportPage::where('is_active', true)
                ->orderBy('order')
                ->select('id', 'title', 'slug', 'meta_description')
                ->get()
        ]);
    }

    /**
     * Display the specified support page.
     */
    public function show(string $slug)
    {
        $page = SupportPage::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        // Lấy tất cả các trang khác để hiển thị sidebar
        $supportPages = SupportPage::where('is_active', true)
            ->orderBy('order')
            ->select('id', 'title', 'slug')
            ->get();

        return Inertia::render('Support/Show', [
            'page' => $page,
            'supportPages' => $supportPages
        ]);
    }
}
