import { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

interface ScrollToTopProps {
  position?: 'left' | 'right';
  bottom?: number;
  showAfter?: number;
}

export default function ScrollToTop({
                                      position = 'right',
                                      bottom = 4,
                                      showAfter = 300,
                                    }: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Kiểm tra vị trí cuộn để hiển thị/ẩn nút
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > showAfter) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showAfter]);

  // Hàm cuộn lên đầu trang
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed ${position === 'right' ? 'right-4' : 'left-4'} z-50 bg-[#9E7A47] hover:bg-[#4E3629] text-white p-3 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 hover:scale-110 ring-[#9E7A47]/30 hover:ring-4`}
      style={{
        bottom: `${bottom}px`,
        opacity: isVisible ? 1 : 0,
        visibility: isVisible ? 'visible' : 'hidden',
        transition: 'opacity 0.3s, visibility 0.3s, transform 0.3s',
      }}
      aria-label="Cuộn lên đầu trang"
    >
      <FaArrowUp size={24} />
    </button>
  );
}
