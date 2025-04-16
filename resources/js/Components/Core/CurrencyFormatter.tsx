import React from 'react';

function CurrencyFormatter(
  {amount,
    currency = 'VND',
    locale
  } : {
    amount?: number, // Thêm dấu ? để chỉ ra rằng amount có thể undefined
    currency?: string,
    locale?: string
  }) {
  // Kiểm tra amount có tồn tại không
  if (amount === undefined) {
    return null; // Hoặc giá trị mặc định như '-'
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(amount);
}

export default CurrencyFormatter;
