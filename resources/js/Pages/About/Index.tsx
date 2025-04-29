import React from 'react';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface TeamMember {
  id: number;
  name: string;
  position: string;
  image: string;
  bio: string;
}

interface Testimonial {
  id: number;
  name: string;
  title: string;
  content: string;
  avatar: string;
  rating: number;
}

interface Milestone {
  year: string;
  title: string;
  description: string;
}

interface AboutProps extends Record<string, unknown>  {
  team: TeamMember[];
  testimonials: Testimonial[];
  milestones: Milestone[];
}

export default function Index({ team, testimonials, milestones }: PageProps<AboutProps>) {
  // SEO structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Yến sào Xuân Mạnh",
    "url": window.location.origin,
    "logo": `${window.location.origin}/images/logo.png`,
    "description": "Yến sào Xuân Mạnh - Thương hiệu yến sào cao cấp, uy tín hàng đầu Việt Nam với hơn 10 năm kinh nghiệm.",
    "foundingDate": "2010",
    "founders": [
      {
        "@type": "Person",
        "name": "Nguyễn Xuân Mạnh"
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Nguyễn Văn Linh",
      "addressLocality": "Quận 7",
      "addressRegion": "TP. Hồ Chí Minh",
      "postalCode": "700000",
      "addressCountry": "VN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+84-123-456-789",
      "contactType": "customer service"
    }
  };

  return (
    <AuthenticatedLayout>
      <Head>
        <title>Giới thiệu về Yến sào Xuân Mạnh</title>
        <meta name="description" content="Yến sào Xuân Mạnh - Thương hiệu yến sào cao cấp, uy tín hàng đầu Việt Nam với hơn 10 năm kinh nghiệm." />
        <meta name="keywords" content="yến sào, yến sào cao cấp, Xuân Mạnh, thương hiệu yến sào Việt Nam" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Head>

      {/* Hero Section */}
      <section className="relative h-96 bg-cover bg-center" style={{ backgroundImage: 'url(/images/about/hero-bg.jpg)' }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Yến Sào Xuân Mạnh</h1>
          <p className="text-xl text-white max-w-3xl mx-auto">Với hơn 10 năm kinh nghiệm, chúng tôi tự hào mang đến những sản phẩm yến sào chất lượng cao nhất, giàu dinh dưỡng và có nguồn gốc tự nhiên.</p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div className="mb-10 lg:mb-0">
              <img
                src="/images/about/about-image.jpg"
                alt="Nhà máy sản xuất yến sào Xuân Mạnh"
                className="rounded-lg shadow-xl w-full h-auto"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-neutral mb-6">Câu chuyện của chúng tôi</h2>
              <div className="w-20 h-1 bg-primary mb-8"></div>

              <p className="text-charcoal mb-6">
                Thành lập từ năm 2010, Yến sào Xuân Mạnh khởi đầu với tâm huyết mang đến những sản phẩm yến sào chất lượng cao nhất cho thị trường Việt Nam. Từ một cơ sở nhỏ tại Khánh Hòa, chúng tôi đã không ngừng phát triển và mở rộng quy mô.
              </p>

              <p className="text-charcoal mb-6">
                Trên hành trình hơn một thập kỷ, Yến sào Xuân Mạnh luôn kiên định với sứ mệnh cung cấp sản phẩm yến sào tự nhiên, tinh khiết và giàu dinh dưỡng, giúp nâng cao sức khỏe và chất lượng cuộc sống của người tiêu dùng.
              </p>

              <p className="text-charcoal mb-6">
                Hiện nay, Yến sào Xuân Mạnh tự hào là một trong những thương hiệu yến sào uy tín hàng đầu Việt Nam, với chuỗi nhà yến đạt chuẩn và hệ thống sản xuất hiện đại, đảm bảo mọi sản phẩm đều đạt tiêu chuẩn chất lượng và an toàn vệ sinh thực phẩm cao nhất.
              </p>

              <div className="grid grid-cols-3 gap-6 mt-10">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">10+</div>
                  <div className="text-charcoal">Năm kinh nghiệm</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">20+</div>
                  <div className="text-charcoal">Sản phẩm cao cấp</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">50k+</div>
                  <div className="text-charcoal">Khách hàng tin dùng</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-base-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-neutral mb-4">Tầm nhìn & Sứ mệnh</h2>
            <div className="w-20 h-1 bg-primary mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral text-center mb-4">Tầm nhìn</h3>
              <p className="text-charcoal text-center">
                Trở thành thương hiệu yến sào hàng đầu Việt Nam và vươn tầm quốc tế, được khách hàng tin tưởng lựa chọn bởi chất lượng vượt trội và giá trị dinh dưỡng.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-neutral text-center mb-4">Sứ mệnh</h3>
              <p className="text-charcoal text-center">
                Mang đến những sản phẩm yến sào chất lượng cao nhất từ thiên nhiên, góp phần nâng cao sức khỏe và chất lượng cuộc sống của mọi người tiêu dùng Việt Nam.
              </p>
            </div>
          </div>

          <div className="mt-10 bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-neutral text-center mb-4">Giá trị cốt lõi</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-lg text-neutral mb-2">Chất lượng</h4>
                <p className="text-charcoal">Cam kết cung cấp sản phẩm chất lượng cao nhất, không gian lận, giữ nguyên giá trị dinh dưỡng từ tự nhiên.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h4 className="font-semibold text-lg text-neutral mb-2">Đổi mới</h4>
                <p className="text-charcoal">Không ngừng nghiên cứu, áp dụng công nghệ và phương pháp mới để nâng cao chất lượng và đa dạng sản phẩm.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-lg text-neutral mb-2">Tận tâm</h4>
                <p className="text-charcoal">Luôn đặt lợi ích và sức khỏe của khách hàng lên hàng đầu, phục vụ với tinh thần tận tâm và trách nhiệm.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-neutral mb-4">Sản phẩm của chúng tôi</h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
            <p className="max-w-3xl mx-auto text-charcoal">
              Yến sào Xuân Mạnh tự hào mang đến đa dạng sản phẩm yến sào chất lượng cao,
              được chế biến theo phương pháp truyền thống kết hợp công nghệ hiện đại,
              giữ nguyên hương vị và dưỡng chất quý giá từ thiên nhiên.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <img
                src="/images/products/yen-tinh-che.jpg"
                alt="Yến sào tinh chế"
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-neutral mb-2">Yến sào tinh chế</h3>
                <p className="text-charcoal mb-4">
                  Sản phẩm yến sào nguyên tổ được tinh chế kỹ lưỡng, loại bỏ tạp chất, giữ nguyên dưỡng chất tự nhiên.
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-sm text-charcoal">100% tự nhiên</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <img
                src="/images/products/yen-chung.jpg"
                alt="Yến chưng sẵn"
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-neutral mb-2">Yến chưng sẵn</h3>
                <p className="text-charcoal mb-4">
                  Sản phẩm yến chưng sẵn tiện lợi, chế biến theo công thức độc quyền, giữ nguyên hương vị và dưỡng chất.
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-sm text-charcoal">Tiện lợi, dễ sử dụng</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <img
                src="/images/products/yen-collagen.jpg"
                alt="Yến collagen"
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-neutral mb-2">Yến collagen</h3>
                <p className="text-charcoal mb-4">
                  Kết hợp giữa yến sào và collagen cao cấp, giúp dưỡng da, chống lão hóa và tăng cường sức khỏe từ bên trong.
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-sm text-charcoal">Công thức độc quyền</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <a href="/products" className="inline-block py-3 px-6 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors">
              Xem tất cả sản phẩm
            </a>
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="py-16 bg-base-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-neutral mb-4">Quy trình sản xuất</h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
            <p className="max-w-3xl mx-auto text-charcoal">
              Từ các nhà yến tự nhiên đến sản phẩm cuối cùng, mỗi bước trong quy trình sản xuất của Yến sào Xuân Mạnh
              đều được kiểm soát nghiêm ngặt để đảm bảo chất lượng tốt nhất.
            </p>
          </div>

          <div className="relative">
            {/* Process Timeline */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-primary transform -translate-y-1/2 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-white rounded-full shadow-md flex items-center justify-center mb-6 border-4 border-primary">
                  <span className="text-xl font-bold text-primary">01</span>
                </div>
                <h3 className="text-lg font-semibold text-neutral mb-3">Thu hoạch</h3>
                <p className="text-charcoal">Thu hoạch tổ yến từ các nhà yến tự nhiên, đảm bảo đúng thời điểm để có chất lượng tốt nhất.</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-white rounded-full shadow-md flex items-center justify-center mb-6 border-4 border-primary">
                  <span className="text-xl font-bold text-primary">02</span>
                </div>
                <h3 className="text-lg font-semibold text-neutral mb-3">Sơ chế</h3>
                <p className="text-charcoal">Sơ chế thủ công kết hợp công nghệ hiện đại, loại bỏ tạp chất nhưng vẫn giữ nguyên cấu trúc tổ yến.</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-white rounded-full shadow-md flex items-center justify-center mb-6 border-4 border-primary">
                  <span className="text-xl font-bold text-primary">03</span>
                </div>
                <h3 className="text-lg font-semibold text-neutral mb-3">Chế biến</h3>
                <p className="text-charcoal">Chế biến theo công thức độc quyền, kết hợp với các thành phần tự nhiên để tạo ra sản phẩm chất lượng cao.</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-white rounded-full shadow-md flex items-center justify-center mb-6 border-4 border-primary">
                  <span className="text-xl font-bold text-primary">04</span>
                </div>
                <h3 className="text-lg font-semibold text-neutral mb-3">Đóng gói</h3>
                <p className="text-charcoal">Đóng gói bằng hệ thống hiện đại, đảm bảo vệ sinh an toàn thực phẩm và bảo quản tối ưu dưỡng chất.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-neutral mb-4">Hành trình phát triển</h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          </div>

          <div className="relative border-l-4 border-primary ml-4 md:ml-0 md:mx-auto md:max-w-3xl">
            {milestones.map((milestone, index) => (
              <div key={index} className={`mb-10 ml-8 md:ml-0 md:grid md:grid-cols-2 md:gap-8 ${index % 2 === 0 ? '' : 'md:flex md:flex-row-reverse'}`}>
                <div className={`absolute -left-[13px] md:${index % 2 === 0 ? 'md:left-0' : 'md:right-0'} flex items-center justify-center w-6 h-6 bg-primary rounded-full`}>
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <div className={`md:text-${index % 2 === 0 ? 'right' : 'left'} md:pr-10`}>
                  <span className="inline-block px-4 py-2 bg-primary text-white font-bold rounded-lg mb-3">
                    {milestone.year}
                  </span>
                  <h3 className="text-xl font-bold text-neutral mb-2">{milestone.title}</h3>
                </div>
                <div>
                  <p className="text-charcoal">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-base-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-neutral mb-4">Đội ngũ của chúng tôi</h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
            <p className="max-w-3xl mx-auto text-charcoal">
              Đội ngũ chuyên gia giàu kinh nghiệm là nền tảng cho sự phát triển bền vững của Yến sào Xuân Mạnh.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div key={member.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover object-center"
                />
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-neutral mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.position}</p>
                  <p className="text-charcoal text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-neutral mb-4">Khách hàng nói gì về chúng tôi</h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-base-100 rounded-lg p-8 shadow-md relative">
                <div className="absolute top-4 right-4 text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <p className="text-charcoal italic">{testimonial.content}</p>
                </div>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-neutral">{testimonial.name}</h4>
                    <p className="text-sm text-charcoal">{testimonial.title}</p>
                  </div>
                </div>
                <div className="mt-4 flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-base-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-neutral mb-4">Chứng nhận chất lượng</h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
            <p className="max-w-3xl mx-auto text-charcoal">
              Yến sào Xuân Mạnh tự hào đạt được các chứng nhận quốc tế về chất lượng và an toàn thực phẩm.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center h-32">
              <img src="/images/certifications/iso-22000.png" alt="ISO 22000" className="max-h-full" />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center h-32">
              <img src="/images/certifications/haccp.png" alt="HACCP" className="max-h-full" />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center h-32">
              <img src="/images/certifications/gmp.png" alt="GMP" className="max-h-full" />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center h-32">
              <img src="/images/certifications/halal.png" alt="Halal" className="max-h-full" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Bạn muốn tìm hiểu thêm về sản phẩm?</h2>
          <p className="text-white/90 text-lg max-w-2xl mx-auto mb-8">
            Hãy liên hệ với chúng tôi ngay hôm nay để được tư vấn chi tiết và nhận những ưu đãi đặc biệt.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/products"
              className="inline-block py-3 px-6 bg-white text-primary font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Xem sản phẩm
            </a>
            <a
              href="/lien-he"
              className="inline-block py-3 px-6 bg-transparent text-white font-medium rounded-lg border border-white hover:bg-white/10 transition-colors"
            >
              Liên hệ ngay
            </a>
          </div>
        </div>
      </section>
    </AuthenticatedLayout>
  );
}
