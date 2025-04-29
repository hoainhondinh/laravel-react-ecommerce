import { Dispatch, SetStateAction } from 'react';

export interface BaseFormData {
  [key: string]: string | number | boolean | null | undefined;
}

// These form data interfaces define the shape of each form's data
export interface EmailTestFormData extends BaseFormData {
  email: string;
  type: 'new_order' | 'status_update' | 'payment_confirmed';
  order_id: string | number;
  previous_status?: string;
}

export interface LoginFormData extends BaseFormData {
  email: string;
  password: string;
  remember: boolean;
  _token?: string;

}

export interface ContactFormData extends BaseFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  honeypot?: string;
  limit_exceeded?: string;
}

export interface CheckoutFormData extends BaseFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  address_id: number;
  payment_method: 'cod' | 'bank_transfer';
}

export interface AddressFormData extends BaseFormData {
  name: string;
  phone: string;
  address: string;
  province: string;
  district: string;
  ward: string;
  is_default: boolean;
}
