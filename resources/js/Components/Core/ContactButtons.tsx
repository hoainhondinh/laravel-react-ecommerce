import { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaPhone, FaFacebookMessenger } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';

interface ContactButtonProps {
  position?: 'left' | 'right';
  showLabels?: boolean;
}

export default function ContactButtons({
                                         position = 'right',
                                         showLabels = false
                                       }: ContactButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  useEffect(() => {
    // Hiển thị các nút sau khi trang đã load
    const timer = setTimeout(() => setIsVisible(true), 800);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const contactButtons = [
    {
      id: 'store',
      label: 'Tìm cửa hàng',
      icon: <FaMapMarkerAlt size={24} />,
      href: '/stores',
      color: 'bg-[#4E3629] hover:bg-[#3A2A1F]',
      ringColor: 'ring-[#4E3629]/30'
    },
    {
      id: 'phone',
      label: 'Gọi trực tiếp',
      icon: <FaPhone size={24} />,
      href: 'tel:0589153703',
      color: 'bg-[#9E7A47] hover:bg-[#8B6A3E]',
      ringColor: 'ring-[#9E7A47]/30'
    },
    {
      id: 'messenger',
      label: 'Messenger',
      icon: <FaFacebookMessenger size={24} />,
      href: 'https://m.me/yourusername',
      color: 'bg-[#D9C97E] hover:bg-[#CAB964]',
      ringColor: 'ring-[#D9C97E]/30'
    },
    {
      id: 'zalo',
      label: 'Zalo',
      icon: <SiZalo size={24} />,
      href: 'https://zalo.me/yourzaloID',
      color: 'bg-[#A5C79B] hover:bg-[#96B593]',
      ringColor: 'ring-[#A5C79B]/30'
    }
  ];

  return (
    <div
      className={`fixed ${position === 'right' ? 'right-4' : 'left-4'} bottom-16 z-50 flex flex-col space-y-4`}
      style={{
        transform: isVisible ? 'translateX(0)' : `translateX(${position === 'right' ? '100px' : '-100px'})`,
        transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        opacity: isVisible ? 1 : 0,
      }}
    >
      {contactButtons.map((button) => (
        <div key={button.id} className="relative">
          {/* Tooltip/Label chỉ hiển thị khi hover hoặc showLabels=true */}
          {(hoveredButton === button.id || showLabels) && (
            <div
              className={`absolute ${position === 'right' ? 'right-14' : 'left-14'} top-1/2 -translate-y-1/2 bg-white text-[#333333] shadow-lg rounded-md px-3 py-2 whitespace-nowrap font-medium pointer-events-none`}
            >
              {button.label}
              <div
                className={`absolute top-1/2 -translate-y-1/2 ${position === 'right' ? '-right-2' : '-left-2'} w-2 h-2 bg-white transform rotate-45`}
              ></div>
            </div>
          )}

          {/* Nút chính có khả năng click */}
          <a
            href={button.href}
            className={`${button.color} text-white p-3 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 hover:scale-110 ${button.ringColor} hover:ring-4`}
            target={button.id !== 'phone' && button.id !== 'store' ? '_blank' : '_self'}
            rel="noopener noreferrer"
            aria-label={button.label}
            onMouseEnter={() => setHoveredButton(button.id)}
            onMouseLeave={() => setHoveredButton(null)}
          >
            {button.icon}
          </a>

          {/* Hiệu ứng pulse khi hover */}
          <span
            className={`absolute inset-0 rounded-full ${button.ringColor} opacity-0 ${hoveredButton === button.id ? 'animate-ping opacity-40' : ''} pointer-events-none`}
          ></span>
        </div>
      ))}

      {/* Pulse animation spotlight */}
      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-none">
        <span className="flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D9C97E] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#D9C97E]"></span>
        </span>
      </div>
    </div>
  );
}
