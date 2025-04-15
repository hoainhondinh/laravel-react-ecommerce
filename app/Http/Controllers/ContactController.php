<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactFormSubmitted;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ContactController extends Controller
{
    /**
     * Hiển thị trang liên hệ
     */
    public function index()
    {
        return Inertia::render('Contact/Index');
    }

    /**
     * Xử lý gửi form liên hệ
     */
    public function store(Request $request)
    {
        // Kiểm tra số lần gửi từ một IP trong ngày
        $maxSubmissionsPerDay = config('contact.submissions_limit', 5);
        $submissionsCount = ContactMessage::where('ip_address', $request->ip())
            ->whereDate('created_at', today())
            ->count();

        if ($submissionsCount >= $maxSubmissionsPerDay) {
            return redirect()->back()->withErrors([
                'limit_exceeded' => 'Bạn đã gửi quá nhiều tin nhắn trong ngày. Vui lòng thử lại sau.'
            ]);
        }

        // Validation chi tiết
        $validator = Validator::make($request->all(), [
            'name' => [
                'required',
                'string',
                'min:2',
                'max:255',
                'regex:/^[\pL\s\-\']+$/u', // Chỉ chấp nhận chữ cái, dấu trắng, dấu nháy đơn và dấu gạch ngang
            ],
            'email' => [
                'required',
                'email:rfc,dns',
                'max:255',
            ],
            'phone' => [
                'required',
                'string',
                'regex:/^([0-9\s\-\+\(\)]*)$/', // Chỉ chấp nhận số, dấu cách, dấu gạch ngang, dấu + và dấu ngoặc
                'min:10',
                'max:20',
            ],
            'subject' => [
                'required',
                'string',
                'min:5',
                'max:255',
            ],
            'message' => [
                'required',
                'string',
                'min:20',
                'max:2000',
            ],
            'honeypot' => 'size:0' // Chống spam
        ], [
            'name.required' => 'Vui lòng nhập họ tên của bạn.',
            'name.min' => 'Họ tên phải có ít nhất 2 ký tự.',
            'name.regex' => 'Họ tên chỉ được chứa chữ cái và dấu cách.',

            'email.required' => 'Vui lòng nhập địa chỉ email.',
            'email.email' => 'Vui lòng nhập địa chỉ email hợp lệ.',
            'email.dns' => 'Địa chỉ email không tồn tại.',

            'phone.required' => 'Vui lòng nhập số điện thoại.',
            'phone.regex' => 'Số điện thoại không hợp lệ.',
            'phone.min' => 'Số điện thoại phải có ít nhất 10 ký tự.',

            'subject.required' => 'Vui lòng nhập chủ đề.',
            'subject.min' => 'Chủ đề phải có ít nhất 5 ký tự.',

            'message.required' => 'Vui lòng nhập nội dung tin nhắn.',
            'message.min' => 'Nội dung tin nhắn phải có ít nhất 20 ký tự.',
            'message.max' => 'Nội dung tin nhắn không được vượt quá 2000 ký tự.',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        // Kiểm tra spam keywords
        $spamKeywords = [
            'casino', 'loan', 'viagra', 'cbd', 'bitcoin', 'crypto', 'lottery', 'dating',
            'investment opportunity', 'make money fast', 'free money', 'work from home',
            'weight loss', 'diet pills'
        ];

        $content = strtolower($request->message . ' ' . $request->subject);
        $isSpam = false;

        foreach ($spamKeywords as $keyword) {
            if (str_contains($content, $keyword)) {
                $isSpam = true;
                break;
            }
        }

        // Lưu thông tin liên hệ vào database
        $contactMessage = ContactMessage::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'subject' => $request->subject,
            'message' => $request->message,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'status' => $isSpam ? 'spam' : 'pending'
        ]);

        // Gửi email thông báo nếu không phải spam
        if (!$isSpam && config('contact.send_notifications', true)) {
            try {
                Mail::to(config('contact.admin_email', 'admin@example.com'))
                    ->send(new ContactFormSubmitted($contactMessage));
            } catch (\Exception $e) {
                // Log lỗi nhưng vẫn tiếp tục
                \Log::error('Không thể gửi email thông báo liên hệ: ' . $e->getMessage());
            }
        }

        return redirect()->route('contact.success');
    }

    /**
     * Hiển thị trang cảm ơn sau khi gửi liên hệ
     */
    public function success()
    {
        return Inertia::render('Contact/Success');
    }
}
