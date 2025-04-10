@props(['url'])
<tr>
    <td class="header">
        <a href="{{ $url }}" style="display: inline-block;">
            @if (trim($slot) === 'Laravel')
                <div style="text-align: center;">
                    <img src="{{ asset('images/logo.png') }}" class="header-logo" alt="{{ config('app.name') }}">
                    <h1 style="color: #9E7A47; margin: 5px 0 0; font-size: 22px;">{{ config('app.name') }}</h1>
                </div>
            @else
                {{ $slot }}
            @endif
        </a>
    </td>
</tr>
