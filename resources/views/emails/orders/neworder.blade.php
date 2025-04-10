@component('mail::message')
    # Đơn hàng #{{ $order->id }} đã được đặt thành công

    Xin chào {{ $order->name }},

    Cảm ơn bạn đã đặt hàng tại cửa hàng của chúng tôi.
    Đơn hàng của bạn đã được đặt thành công và đang chờ xử lý.

    @component('mail::panel')
        ### Thông tin đơn hàng:
        - **Mã đơn hàng:** #{{ $order->id }}
        - **Ngày đặt hàng:** {{ $order->created_at->format('d/m/Y H:i') }}
        - **Tổng giá trị:** {{ number_format($order->total_price) }} đ
        - **Phương thức thanh toán:** {{ $order->payment_method === 'cod' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản ngân hàng' }}
    @endcomponent

    @component('mail::table')
        | Sản phẩm | Số lượng | Đơn giá | Thành tiền |
        | :-------- | :--------: | ---------: | ---------: |
        @foreach($order->items as $item)
            | {{ $item->product->title }} @if(!empty($item->options)) <br><small>{{ is_string($item->options) ? json_decode($item->options, true) : collect($item->options)->pluck('name')->join(', ') }}</small> @endif | {{ $item->quantity }} | {{ number_format($item->price) }} đ | {{ number_format($item->price * $item->quantity) }} đ |
        @endforeach
        | **Tổng cộng** | {{ $order->items->sum('quantity') }} | | **{{ number_format($order->total_price) }} đ** |
    @endcomponent

    @component('mail::button', ['url' => route('orders.show', $order->id), 'color' => 'primary'])
        Xem chi tiết đơn hàng
    @endcomponent

    Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi!

    Trân trọng,<br>
    {{ config('app.name') }}

    @component('mail::subcopy')
        Nếu bạn gặp vấn đề với nút "Xem chi tiết đơn hàng", hãy copy và dán liên kết này vào trình duyệt web của bạn: [{{ route('orders.show', $order->id) }}]({{ route('orders.show', $order->id) }})
    @endcomponent
@endcomponent
