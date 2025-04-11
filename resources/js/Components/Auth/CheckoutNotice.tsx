import React from 'react';
import { Link } from '@inertiajs/react';
import { CheckoutNoticeProps } from '@/types';

export default function CheckoutNotice({ show }: CheckoutNoticeProps) {
  if (!show) return null;

  return (
    <div className="alert alert-info mb-6">
      <div className="flex-1">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h3 className="font-bold">Login to Complete Your Order</h3>
          <div className="text-sm">
            Please login to continue the checkout process. Your shopping cart items will be preserved.
          </div>
          <div className="text-sm mt-2">
            If you don't have an account, you can <Link href={route('register')} className="text-primary font-medium hover:underline">register</Link> or <Link href={route('checkout.guest')} className="text-primary font-medium hover:underline">continue as guest</Link>.
          </div>
        </div>
      </div>
    </div>
  );
}
