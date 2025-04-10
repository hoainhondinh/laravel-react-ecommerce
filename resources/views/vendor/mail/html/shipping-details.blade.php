<div style="background-color: #f8fafc; border-radius: 6px; padding: 15px; margin: 15px 0;">
    <div style="font-weight: 600; color: #1e293b; margin-bottom: 10px;">{{ __('Shipping Details') }}</div>

    <table style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                <span style="font-weight: 600; color: #64748b;">{{ __('Recipient') }}:</span>
            </td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                <span style="color: #1e293b;">{{ $order->name }}</span>
            </td>
        </tr>
        <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                <span style="font-weight: 600; color: #64748b;">{{ __('Phone') }}:</span>
            </td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                <span style="color: #1e293b;">{{ $order->phone }}</span>
            </td>
        </tr>
        <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                <span style="font-weight: 600; color: #64748b;">{{ __('Email') }}:</span>
            </td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                <span style="color: #1e293b;">{{ $order->email }}</span>
            </td>
        </tr>
        <tr>
            <td style="padding: 8px 0;">
                <span style="font-weight: 600; color: #64748b;">{{ __('Address') }}:</span>
            </td>
            <td style="padding: 8px 0; text-align: right;">
                <span style="color: #1e293b;">{{ $order->address }}</span>
            </td>
        </tr>
    </table>
</div>
