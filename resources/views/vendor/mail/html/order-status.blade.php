{{-- resources/views/vendor/mail/html/order-status.blade.php --}}
@props(['status'])

@php
    // Sử dụng switch-case thay vì match để tương thích với PHP < 8.0
    switch($status) {
        case 'pending':
            $statusText = 'Chờ xử lý';
            $statusColor = '#eab308';      // yellow-500
            $backgroundColor = '#fef9c3';  // yellow-100
            break;
        case 'processing':
            $statusText = 'Đang xử lý';
            $statusColor = '#3b82f6';      // blue-500
            $backgroundColor = '#dbeafe';  // blue-100
            break;
        case 'completed':
            $statusText = 'Đã hoàn thành';
            $statusColor = '#10b981';      // green-500
            $backgroundColor = '#d1fae5';  // green-100
            break;
        case 'canceled':
            $statusText = 'Đã hủy';
            $statusColor = '#ef4444';      // red-500
            $backgroundColor = '#fee2e2';  // red-100
            break;
        default:
            $statusText = ucfirst($status);
            $statusColor = '#6b7280';      // gray-500
            $backgroundColor = '#f3f4f6';  // gray-100
    }
@endphp

<div style="display: inline-block; padding: 6px 12px; border-radius: 4px; font-size: 14px; font-weight: 500; color: {{ $statusColor }}; background-color: {{ $backgroundColor }};">
    {{ $statusText }}
</div>
