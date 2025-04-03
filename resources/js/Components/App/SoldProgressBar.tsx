import React from 'react';

interface SoldProgressBarProps {
  soldCount: number;
  quantity: number;
  showPercentage?: boolean;
  showMessage?: boolean;
  className?: string;
}

export default function SoldProgressBar({
                                          soldCount,
                                          quantity,
                                          showPercentage = true,
                                          showMessage = true,
                                          className = ''
                                        }: SoldProgressBarProps) {
  const totalStock = quantity + soldCount;
  const soldPercentage = totalStock > 0 ? (soldCount / totalStock) * 100 : 0;

  return (
    <div className={`${className}`}>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">Đã bán: {soldCount}</span>
        <span className="text-gray-600">Còn lại: {quantity}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full relative"
          style={{ width: `${Math.min(soldPercentage, 100)}%` }}
        >
          {showPercentage && soldPercentage > 10 && (
            <span className="absolute text-xs text-white font-medium right-1 leading-3 top-0">
              {Math.round(soldPercentage)}%
            </span>
          )}
        </div>
      </div>

      {showMessage && (
        <>
          {soldPercentage > 75 && (
            <p className="text-red-500 text-sm mt-2 font-medium">
              Sản phẩm sắp hết hàng, hãy nhanh tay mua ngay!
            </p>
          )}

          {soldPercentage > 50 && soldPercentage <= 75 && (
            <p className="text-orange-500 text-sm mt-2 font-medium">
              Sản phẩm đang bán chạy, còn hạn chế số lượng.
            </p>
          )}
        </>
      )}
    </div>
  );
}
