import { User, GroupedCartItems } from '@/types';

export interface Address {
  id: number;
  name: string;
  phone: string;
  address: string;
  province?: string;
  district?: string;
  ward?: string;
  is_default: boolean;
  full_address: string;
}

export interface CheckoutPageProps extends Record<string, unknown> {
  cartItems: Record<number, GroupedCartItems>;
  totalPrice: number;
  isGuest: boolean;
  guestInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  userAddresses?: Address[];
  auth: {
    user: User | null;
  };
}
