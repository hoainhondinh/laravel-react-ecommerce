import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';

export default function FlashMessages() {
  const { flash, errors } = usePage().props as any;
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (flash?.success || flash?.error) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [flash]);

  // If there are global errors (not field-specific)
  const hasGlobalErrors = errors && (errors.system || errors._error);

  // If nothing to show, return null
  if ((!flash?.success && !flash?.error && !hasGlobalErrors) || !visible) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 z-50 w-96 max-w-full">
      {flash?.success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 shadow-md">
          <strong className="font-bold">Thành công! </strong>
          <span className="block sm:inline">{flash.success}</span>
          <button
            onClick={() => setVisible(false)}
            className="absolute top-0 right-0 px-4 py-3"
          >
            <span className="text-green-500">×</span>
          </button>
        </div>
      )}

      {flash?.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 shadow-md">
          <strong className="font-bold">Lỗi! </strong>
          <span className="block sm:inline">{flash.error}</span>
          <button
            onClick={() => setVisible(false)}
            className="absolute top-0 right-0 px-4 py-3"
          >
            <span className="text-red-500">×</span>
          </button>
        </div>
      )}

      {hasGlobalErrors && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 shadow-md">
          <strong className="font-bold">Lỗi! </strong>
          <span className="block sm:inline">
            {errors.system || errors._error}
          </span>
          <button
            onClick={() => setVisible(false)}
            className="absolute top-0 right-0 px-4 py-3"
          >
            <span className="text-red-500">×</span>
          </button>
        </div>
      )}
    </div>
  );
}
