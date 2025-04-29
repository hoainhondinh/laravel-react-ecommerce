<div class="flex items-center gap-2" x-data="{}">
    <img src="{{ asset('images/logo.png') }}"
         alt="Yến Sào Xuân Mạnh"
         class="h-10"
         x-show="!$store.theme.isDarkMode">

    <img src="{{ asset('images/logo-dark.png') }}"
         alt="Yến Sào Xuân Mạnh"
         class="h-10"
         x-show="$store.theme.isDarkMode">

</div>
