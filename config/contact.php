<?php


return [
    /*
    |--------------------------------------------------------------------------
    | Contact Form Settings
    |--------------------------------------------------------------------------
    |
    | This file contains settings for the contact form functionality.
    |
    */

    // Email address that receives contact form submissions
    'admin_email' => env('CONTACT_ADMIN_EMAIL', 'admin@example.com'),

    // Send notification emails for new contact form submissions
    'send_notifications' => env('CONTACT_SEND_NOTIFICATIONS', true),

    // Enable Google reCAPTCHA for spam prevention
    'enable_recaptcha' => env('CONTACT_ENABLE_RECAPTCHA', false),
    'recaptcha_site_key' => env('RECAPTCHA_SITE_KEY'),
    'recaptcha_secret_key' => env('RECAPTCHA_SECRET_KEY'),

    // Maximum contact form submissions allowed per IP address per day
    'submissions_limit' => env('CONTACT_SUBMISSIONS_LIMIT', 5),

    // Contact page details
    'company_name' => env('COMPANY_NAME', 'Công ty TNHH Thương mại'),
    'company_address' => env('COMPANY_ADDRESS', '123 Nguyễn Văn A, Quận 1, TP.HCM'),
    'contact_phone' => env('CONTACT_PHONE', '0123 456 789'),
    'contact_email' => env('CONTACT_EMAIL', 'info@example.com'),
    'office_hours' => [
        'weekdays' => 'Thứ 2 - Thứ 6: 8:00 - 17:30',
        'saturday' => 'Thứ 7: 8:00 - 12:00',
        'sunday' => 'Chủ nhật: Nghỉ'
    ],
];
