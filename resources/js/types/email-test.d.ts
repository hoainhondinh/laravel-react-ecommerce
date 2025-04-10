// resources/js/types/email-test.d.ts
import { User, PageProps } from '../index';

export interface Order {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  total_price: string;
  created_at: string;
  payment_method: 'cod' | 'bank_transfer';
  status: 'pending' | 'processing' | 'completed' | 'canceled';
  payment_status: 'pending' | 'paid' | 'awaiting' | 'failed';
  items?: OrderItem[];
  user?: User;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  options?: string | any[];
  product?: {
    id: number;
    title: string;
    slug: string;
    image: string;
  };
}

export interface EmailTestProps extends PageProps {
  orders: Order[];
}

export interface FormData {
  email: string;
  type: 'new_order' | 'status_update' | 'payment_confirmed';
  order_id: number | string;
  previous_status: string;
}
