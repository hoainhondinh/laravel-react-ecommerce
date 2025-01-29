import React, { useState, useEffect } from 'react';

interface BannerImage {
  desktop: string;
  mobile: string;
}

interface Banner {
  id: number;
  title: string;
  description?: string;
  url?: string;
  image: BannerImage;
}

interface BannerCarouselProps {
  banners: Banner[];
}

const BannerCarousel: React.FC<BannerCarouselProps> = ({ banners }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isHovering, setIsHovering] = useState<boolean>(false);

  // Tự động chuyển slide sau mỗi 5 giây nếu không hover
  useEffect(() => {
    if (!isHovering && banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === banners.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [currentIndex, isHovering, banners.length]);

  // Xử lý khi không có banner nào
  if (!banners || banners.length === 0) {
    return null;
  }

  // Chỉ hiển thị 1 banner không cần controls
  if (banners.length === 1) {
    const banner = banners[0];
    return (
      <div className="w-full overflow-hidden">
        <a
          href={banner.url || '#'}
          className="block w-full"
          target={banner.url?.startsWith('http') ? '_blank' : '_self'}
          rel={banner.url?.startsWith('http') ? 'noopener noreferrer' : ''}
        >
          <picture>
            <source media="(max-width: 768px)" srcSet={banner.image.mobile} />
            <source media="(min-width: 769px)" srcSet={banner.image.desktop} />
            <img
              src={banner.image.desktop}
              alt={banner.title}
              className="w-full h-auto object-cover"
            />
          </picture>

          {(banner.title || banner.description) && (
            <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-4">
              {banner.title && <h2 className="text-xl font-bold">{banner.title}</h2>}
              {banner.description && <p className="text-sm mt-1">{banner.description}</p>}
            </div>
          )}
        </a>
      </div>
    );
  }

  // Nhiều banner sẽ hiển thị carousel với controls
  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`transition-opacity duration-500 absolute top-0 left-0 w-full ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
            style={{ display: index === currentIndex ? 'block' : 'none' }}
          >
            <a
              href={banner.url || '#'}
              className="block w-full relative"
              target={banner.url?.startsWith('http') ? '_blank' : '_self'}
              rel={banner.url?.startsWith('http') ? 'noopener noreferrer' : ''}
            >
              <picture>
                <source media="(max-width: 768px)" srcSet={banner.image.mobile} />
                <source media="(min-width: 769px)" srcSet={banner.image.desktop} />
                <img
                  src={banner.image.desktop}
                  alt={banner.title}
                  className="w-full h-auto object-cover"
                />
              </picture>

              {(banner.title || banner.description) && (
                <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white p-4">
                  {banner.title && <h2 className="text-xl font-bold">{banner.title}</h2>}
                  {banner.description && <p className="text-sm mt-1">{banner.description}</p>}
                </div>
              )}
            </a>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-80 rounded-full p-2 z-20 transition-all duration-300"
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();
          setCurrentIndex(prevIndex =>
            prevIndex === 0 ? banners.length - 1 : prevIndex - 1
          );
        }}
        aria-label="Previous banner"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-80 rounded-full p-2 z-20 transition-all duration-300"
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();
          setCurrentIndex(prevIndex =>
            prevIndex === banners.length - 1 ? 0 : prevIndex + 1
          );
        }}
        aria-label="Next banner"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicator dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to banner ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;
