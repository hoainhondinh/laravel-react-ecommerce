{{--<x-mail::layout>--}}
{{-- Header --}}
{{--<x-slot:header>--}}
{{--<x-mail::header :url="config('app.url')">--}}
{{--{{ config('app.name') }}--}}
{{--</x-mail::header>--}}
{{--</x-slot:header>--}}

{{-- Body --}}
{{--{{ $slot }}--}}

{{-- Subcopy --}}
{{--@isset($subcopy)--}}
{{--<x-slot:subcopy>--}}
{{--<x-mail::subcopy>--}}
{{--{{ $subcopy }}--}}
{{--</x-mail::subcopy>--}}
{{--</x-slot:subcopy>--}}
{{--@endisset--}}

{{-- Footer --}}
{{--<x-slot:footer>--}}
{{--<x-mail::footer>--}}
{{--© {{ date('Y') }} {{ config('app.name') }}. {{ __('All rights reserved.') }}--}}
{{--</x-mail::footer>--}}
{{--</x-slot:footer>--}}
{{--</x-mail::layout>--}}
@component('mail::layout')
    {{-- Header --}}
    @slot('header')
        @component('mail::header', ['url' => config('app.url')])
            {{ config('app.name') }}
        @endcomponent
    @endslot

    {{-- Body --}}
    {{ $slot }}

    {{-- Subcopy --}}
    @isset($subcopy)
        @slot('subcopy')
            @component('mail::subcopy')
                {{ $subcopy }}
            @endcomponent
        @endslot
    @endisset

    {{-- Footer --}}
    @slot('footer')
        @component('mail::footer')
            © {{ date('Y') }} {{ config('app.name') }}. Tất cả các quyền được bảo lưu.
            <div style="margin-top: 15px;">
                <a href="{{ url('/') }}" style="color: #9E7A47; text-decoration: none; margin: 0 10px;">Trang chủ</a>
                <a href="{{ url('/products') }}" style="color: #9E7A47; text-decoration: none; margin: 0 10px;">Sản phẩm</a>
                <a href="{{ url('/blog') }}" style="color: #9E7A47; text-decoration: none; margin: 0 10px;">Blog</a>
            </div>
        @endcomponent
    @endslot
@endcomponent
