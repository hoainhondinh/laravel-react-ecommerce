import React from 'react';

interface SoldProgressBarProps {
  soldCount: number;
  quantity: number;
  showMessage?: boolean;  // Hiển thị thông tin "Còn lại" ở dưới
  showPercentage?: boolean; // Hiển thị text trên thanh progress
  className?: string;
}

export default function SoldProgressBar({
                                          soldCount,
                                          quantity,
                                          showMessage = true,
                                          showPercentage = true,
                                          className = ''
                                        }: SoldProgressBarProps) {
  const totalStock = quantity + soldCount;
  const soldPercentage = totalStock > 0 ? (soldCount / totalStock) * 100 : 0;
  const quantityPercentage = totalStock > 0 ? (quantity / totalStock) * 100 : 0;

  // Ensure minimum width for text visibility if showing percentage
  const displayPercentage = showPercentage ? Math.max(soldPercentage, 15) : soldPercentage;

  // Determine which status to show based on new conditions
  const getStatus = () => {
    if (quantityPercentage <= 15) {
      return {
        text: `CHỈ CÒN ${quantity}`,
        gradientClass: 'from-amber-300 to-red-200',
        icon: '🔥'
      };
    } else if (soldPercentage >= 15) {
      return {
        text: `ĐÃ BÁN ${soldCount}`,
        gradientClass: 'from-amber-300 to-yellow-200',
        icon: '🚀'
      };
    } else {
      return {
        text: 'ĐANG BÁN CHẠY',
        gradientClass: 'from-amber-300 to-yellow-200',
        icon: '⭐'
      };
    }
  };

  const status = getStatus();

  return (
    <div className={`${className} w-full`}>
      {/* Custom styled progress bar with dark background */}
      <div className="relative w-full bg-yellow-900 rounded-md h-6 overflow-hidden shadow-inner">
        {/* Gradient progress value */}
        <div
          className={`h-full bg-gradient-to-r ${status.gradientClass} rounded-md transition-all duration-300 ${quantityPercentage <= 15 ? 'bg-stripes bg-stripes-white animate-pulse' : ''}`}
          style={{width: `${displayPercentage}%`}}
        ></div>

        {/* Text overlay - centered */}
        {showPercentage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="text-xs font-bold text-white-800 flex items-center">
              {status.icon && <span className="mr-1">{status.icon}</span>}
              <span className="text-white font-extrabold tracking-wide text-xs sm:text-sm">{status.text}</span>
            </div>
          </div>
        )}
      </div>

      {showMessage && (
        <div className="flex justify-between text-xs mt-1">
          {/*<span className="text-gray-600">Đã bán: {soldCount}</span>*/}
          <span className="text-gray-600">Còn lại: {quantity}</span>
        </div>
      )}
    </div>
  );
}
