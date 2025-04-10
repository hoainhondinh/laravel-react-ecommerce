<div class="order-info">
    <table style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                <span style="font-weight: 600; color: #64748b;">{{ __('Order Number') }}:</span>
            </td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                <span style="font-weight: 600; color: #1e293b;">#{{ $order->id }}</span>
            </td>
        </tr>
        <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                <span style="font-weight: 600; color: #64748b;">{{ __('Order Date') }}:</span>
            </td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                {{ $order->created_at->format('d/m/Y H:i') }}
            </td>
        </tr>
        <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                <span style="font-weight: 600; color: #64748b;">{{ __('Payment Method') }}:</span>
            </td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                {{ $order->payment_method === 'cod' ? __('Cash on Delivery') : __('Bank Transfer') }}
            </td>
        </tr>
        @if($order->items && count($order->items) > 0)
            <!-- Items Header -->
            <tr>
                <td colspan="2" style="padding: 16px 0 8px 0;">
                    <span style="font-weight: 600; color: #1e293b;">{{ __('Order Items') }}</span>
                </td>
            </tr>
            @foreach($order->items as $item)
                <tr>
                    <td style="padding: 8px 0; border-bottom: 1px dashed #e2e8f0;">
                        <div>
                            <span style="font-weight: 500; color: #334155;">{{ $item->product->title }}</span>
                            <span style="color: #64748b;"> × {{ $item->quantity }}</span>
                        </div>
                        @if(!empty($item->options))
                            <div style="font-size: 12px; color: #94a3b8;">
                                @php
                                    $optionsData = is_string($item->options) ? json_decode($item->options, true) : $item->options;
                                    $optionText = '';

                                    if (is_array($optionsData)) {
                                        $formattedOptions = [];
                                        foreach ($optionsData as $key => $value) {
                                            if (is_array($value) && isset($value['name'])) {
                                                $formattedOptions[] = $value['name'];
                                            } elseif (!is_array($value)) {
                                                $formattedOptions[] = $value;
                                            }
                                        }
                                        $optionText = implode(', ', $formattedOptions);
                                    }
                                @endphp
                                {{ $optionText }}
                            </div>
                        @endif
                    </td>
                    <td style="padding: 8px 0; border-bottom: 1px dashed #e2e8f0; text-align: right;">
                        {{ number_format($item->price * $item->quantity) }} đ
                    </td>
                </tr>
            @endforeach
        @endif
        <tr>
            <td style="padding: 12px 0 8px 0;">
                <span style="font-weight: 700; color: #1e293b;">{{ __('Total') }}:</span>
            </td>
            <td style="padding: 12px 0 8px 0; text-align: right;">
                <span style="font-weight: 700; color: #1e293b;">{{ number_format($order->total_price) }} đ</span>
            </td>
        </tr>
    </table>
</div>
