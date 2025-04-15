import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface ContactFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  limit_exceeded?: string;
}

export default function Index({ }: PageProps) {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    honeypot: '', // Chống spam
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [clientErrors, setClientErrors] = useState<ContactFormErrors>({});

  // Validate riêng từng trường khi blur
  const validateField = (field: string, value: string) => {
    let error = '';

    switch (field) {
      case 'name':
        if (!value.trim()) {
          error = 'Vui lòng nhập họ tên của bạn.';
        } else if (value.trim().length < 2) {
          error = 'Họ tên phải có ít nhất 2 ký tự.';
        } else if (!/^[a-zA-ZÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêếìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸ\s\-\']+$/.test(value)) {
          error = 'Họ tên chỉ được chứa chữ cái và dấu cách.';
        }
        break;

      case 'email':
        if (!value.trim()) {
          error = 'Vui lòng nhập địa chỉ email.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Vui lòng nhập địa chỉ email hợp lệ.';
        }
        break;

      case 'phone':
        if (!value.trim()) {
          error = 'Vui lòng nhập số điện thoại.';
        } else if (!/^([0-9\s\-\+\(\)]*)$/.test(value)) {
          error = 'Số điện thoại không hợp lệ.';
        } else if (value.replace(/[\s\-\+\(\)]/g, '').length < 10) {
          error = 'Số điện thoại phải có ít nhất 10 ký tự.';
        }
        break;

      case 'subject':
        if (!value.trim()) {
          error = 'Vui lòng nhập chủ đề.';
        } else if (value.trim().length < 5) {
          error = 'Chủ đề phải có ít nhất 5 ký tự.';
        }
        break;

      case 'message':
        if (!value.trim()) {
          error = 'Vui lòng nhập nội dung tin nhắn.';
        } else if (value.trim().length < 20) {
          error = 'Nội dung tin nhắn phải có ít nhất 20 ký tự.';
        }
        break;
    }

    setClientErrors(prev => ({
      ...prev,
      [field]: error
    }));

    return error === '';
  };

  // Xử lý onBlur event
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  // Validate tất cả các trường khi submit
  const validateForm = () => {
    const fields = ['name', 'email', 'phone', 'subject', 'message'];
    let isValid = true;

    fields.forEach(field => {
      const valid = validateField(field, data[field as keyof typeof data] as string);
      if (!valid) isValid = false;
    });

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    post(route('contact.store'), {
      onSuccess: () => {
        reset();
        setFormSubmitted(true);
        setClientErrors({});
      },
    });
  };

  // Format số điện thoại khi nhập
  const formatPhoneNumber = (value: string) => {
    // Xóa tất cả ký tự không phải số
    const phoneNumber = value.replace(/[^\d]/g, '');

    // Format theo mẫu 0xxx xxx xxx
    if (phoneNumber.length <= 4) {
      return phoneNumber;
    } else if (phoneNumber.length <= 7) {
      return `${phoneNumber.slice(0, 4)} ${phoneNumber.slice(4)}`;
    } else {
      return `${phoneNumber.slice(0, 4)} ${phoneNumber.slice(4, 7)} ${phoneNumber.slice(7, 10)}`;
    }
  };

  // Xử lý nhập số điện thoại
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Chỉ cho phép nhập số và một số ký tự đặc biệt
    if (/^[0-9\s\-\+\(\)]*$/.test(value)) {
      setData('phone', value);
    }
  };

  // SEO structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Liên hệ với chúng tôi",
    "description": "Gửi thông tin liên hệ hoặc yêu cầu hỗ trợ, chúng tôi sẽ phản hồi trong thời gian sớm nhất.",
    "url": window.location.href,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+84-123-456-789",
      "contactType": "customer service",
      "areaServed": "VN",
      "availableLanguage": "Vietnamese"
    }
  };

  return (
    <AuthenticatedLayout>
      <Head>
        <title>Liên hệ | Your Store Name</title>
        <meta name="description" content="Liên hệ với chúng tôi để được hỗ trợ và giải đáp mọi thắc mắc" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Head>

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-neutral text-center mb-4">LIÊN HỆ</h1>
          <div className="w-24 h-1 bg-primary mx-auto mb-10"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Thông tin liên hệ */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-neutral mb-6">Thông tin liên hệ</h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-primary rounded-full p-3 text-white mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Địa chỉ</h3>
                    <p className="text-charcoal mt-1">123 Nguyễn Văn A, Quận 1, TP.HCM</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary rounded-full p-3 text-white mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Điện thoại</h3>
                    <p className="text-charcoal mt-1">
                      <a href="tel:+84123456789" className="hover:text-primary transition-colors">0123 456 789</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary rounded-full p-3 text-white mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Email</h3>
                    <p className="text-charcoal mt-1">
                      <a href="mailto:info@example.com" className="hover:text-primary transition-colors">info@example.com</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-primary rounded-full p-3 text-white mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Giờ làm việc</h3>
                    <p className="text-charcoal mt-1">Thứ 2 - Thứ 6: 8:00 - 17:30</p>
                    <p className="text-charcoal">Thứ 7: 8:00 - 12:00</p>
                    <p className="text-charcoal">Chủ nhật: Nghỉ</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-3">Kết nối với chúng tôi</h3>
                <div className="flex space-x-4">
                  <a href="#" className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                    </svg>
                  </a>
                  <a href="#" className="bg-pink-600 text-white p-2 rounded-full hover:bg-pink-700 transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  <a href="#" className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Form liên hệ */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-neutral mb-6">Gửi tin nhắn cho chúng tôi</h2>

              {formSubmitted ? (
                <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
                  <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-green-800 mb-2">Cảm ơn bạn!</h3>
                  <p className="text-green-700">Tin nhắn của bạn đã được gửi thành công. Chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {errors.limit_exceeded && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-red-600">{errors.limit_exceeded}</p>
                    </div>
                  )}

                  <div className="mb-4">
                    <label htmlFor="name" className="block text-charcoal font-medium mb-1">Họ tên <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-2 rounded-md border ${
                        errors.name || clientErrors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-primary focus:ring-primary'
                      } focus:outline-none focus:ring-1`}
                      required
                    />
                    {(errors.name || clientErrors.name) && (
                      <div className="text-red-500 text-sm mt-1">{errors.name || clientErrors.name}</div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="email" className="block text-charcoal font-medium mb-1">Email <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={data.email}
                      onChange={(e) => setData('email', e.target.value)}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-2 rounded-md border ${
                        errors.email || clientErrors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-primary focus:ring-primary'
                      } focus:outline-none focus:ring-1`}
                      required
                    />
                    {(errors.email || clientErrors.email) && (
                      <div className="text-red-500 text-sm mt-1">{errors.email || clientErrors.email}</div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="phone" className="block text-charcoal font-medium mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={data.phone}
                      onChange={handlePhoneChange}
                      onBlur={handleBlur}
                      placeholder="0xxx xxx xxx"
                      className={`w-full px-4 py-2 rounded-md border ${
                        errors.phone || clientErrors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-primary focus:ring-primary'
                      } focus:outline-none focus:ring-1`}
                      required
                    />
                    {(errors.phone || clientErrors.phone) && (
                      <div className="text-red-500 text-sm mt-1">{errors.phone || clientErrors.phone}</div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="subject" className="block text-charcoal font-medium mb-1">Chủ đề <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={data.subject}
                      onChange={(e) => setData('subject', e.target.value)}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-2 rounded-md border ${
                        errors.subject || clientErrors.subject ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-primary focus:ring-primary'
                      } focus:outline-none focus:ring-1`}
                      required
                    />
                    {(errors.subject || clientErrors.subject) && (
                      <div className="text-red-500 text-sm mt-1">{errors.subject || clientErrors.subject}</div>
                    )}
                  </div>

                  <div className="mb-6">
                    <label htmlFor="message" className="block text-charcoal font-medium mb-1">Nội dung <span className="text-red-500">*</span></label>
                    <textarea
                      id="message"
                      name="message"
                      value={data.message}
                      onChange={(e) => setData('message', e.target.value)}
                      onBlur={handleBlur}
                      rows={5}
                      className={`w-full px-4 py-2 rounded-md border ${
                        errors.message || clientErrors.message ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-primary focus:ring-primary'
                      } focus:outline-none focus:ring-1`}
                      required
                    ></textarea>
                    {(errors.message || clientErrors.message) && (
                      <div className="text-red-500 text-sm mt-1">{errors.message || clientErrors.message}</div>
                    )}
                    <div className="text-right text-sm text-gray-500 mt-1">
                      {data.message.length}/2000 ký tự
                    </div>
                  </div>

                  {/* Honeypot field - hidden from users but bots will fill it */}
                  <div className="hidden">
                    <label htmlFor="honeypot">Để trống trường này</label>
                    <input
                      type="text"
                      id="honeypot"
                      name="honeypot"
                      value={data.honeypot}
                      onChange={(e) => setData('honeypot', e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={processing || Object.keys(clientErrors).some(key => !!clientErrors[key as keyof ContactFormErrors])}
                    className="w-full py-3 px-6 bg-primary hover:bg-primary-dark text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70"
                  >
                    {processing ? 'Đang gửi...' : 'Gửi tin nhắn'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Bản đồ */}
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-neutral mb-6 text-center">Bản đồ cửa hàng</h2>
            <div className="w-full h-96 rounded-lg overflow-hidden shadow-md">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d342.3475867826034!2d109.11417500740492!3d13.885741602586878!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x316f3e1f013e94d7%3A0x3c33b26a1a2a8075!2z4bqibmggS3RzIFh1w6JuIE3huqFuaA!5e0!3m2!1svi!2s!4v1744723512188!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{border: 0}}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-neutral mb-6 text-center">Câu hỏi thường gặp</h2>

            <div className="space-y-4">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-neutral">Thời gian giao hàng là bao lâu?</h3>
                <p className="mt-2 text-charcoal">Thời gian giao hàng thông thường từ 1-3 ngày làm việc đối với nội thành và 3-7 ngày đối với các tỉnh thành khác tùy thuộc vào khu vực.</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-neutral">Tôi có thể thanh toán bằng những phương thức nào?</h3>
                <p className="mt-2 text-charcoal">Chúng tôi chấp nhận nhiều phương thức thanh toán bao gồm: thanh toán khi nhận hàng (COD), chuyển khoản ngân hàng, thẻ tín dụng/ghi nợ và các ví điện tử như MoMo, VNPay, ZaloPay.</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-neutral">Chính sách đổi trả hàng như thế nào?</h3>
                <p className="mt-2 text-charcoal">Chúng tôi chấp nhận đổi trả trong vòng 7 ngày kể từ ngày nhận hàng nếu sản phẩm bị lỗi, hư hỏng từ nhà sản xuất, không đúng mẫu hoặc kích thước. Sản phẩm cần giữ nguyên tem, nhãn và chưa qua sử dụng.</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-neutral">Làm thế nào để theo dõi đơn hàng?</h3>
                <p className="mt-2 text-charcoal">Bạn có thể theo dõi đơn hàng bằng cách đăng nhập vào tài khoản và kiểm tra trong mục "Đơn hàng của tôi". Hoặc sử dụng mã đơn hàng kèm theo số điện thoại/email đặt hàng để tra cứu trên website.</p>
              </div>
            </div>

            <div className="text-center mt-8">
              <a href={route('support.index')} className="inline-flex items-center text-primary hover:text-primary-dark font-semibold">
                Xem thêm câu hỏi khác
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
