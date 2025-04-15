<x-mail::message>
    # Tin nhắn liên hệ mới

    Có một tin nhắn liên hệ mới đã được gửi từ website.

    **Tên:** {{ $contactMessage->name }}
    **Email:** {{ $contactMessage->email }}
    **Điện thoại:** {{ $contactMessage->phone }}
    **Chủ đề:** {{ $contactMessage->subject }}

    **Nội dung tin nhắn:**
    {{ $contactMessage->message }}

    **Thời gian gửi:** {{ $contactMessage->created_at->format('d/m/Y H:i:s') }}
    **IP Address:** {{ $contactMessage->ip_address }}

    <x-mail::button :url="url('/admin/contact-messages/'.$contactMessage->id)">
        Xem chi tiết trong trang quản trị
    </x-mail::button>

    Trân trọng,<br>
    {{ config('app.name') }}
</x-mail::message>
