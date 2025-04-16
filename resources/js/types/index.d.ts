import { Config } from 'ziggy-js';

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
}

export type Image = {
  id: number;
  thumb: string;
  small: string;
  large: string;
}

export type VariationTypeOption = {
  id: number;
  name: string;
  images: Image[];
  type: VariationType
}

export type VariationType = {
  id: number;
  name: string;
  type: 'Select' | 'Radio' | 'Image';
  options: VariationTypeOption[];
}

// Cập nhật interface Product
export type Product = {
  id: number;
  title: string;
  slug: string;
  price: number;
  original_price?: number; // Giá gốc (trước khi giảm)
  discount_percent?: number; // Phần trăm giảm giá
  is_on_sale?: boolean; // Đang giảm giá hay không
  has_variations?: boolean; // Có biến thể hay không
  quantity: number;
  sold_count: number; // Số lượng đã bán
  image: string;
  images: Image[];
  short_description: string;
  description: string;
  user: {
    id: number;
    name: string;
  };
  department: {
    id: number;
    name: string;
    slug: string;
  };
  variationTypes: VariationType[],
  variations: Array<{
    id: number;
    variation_type_option_ids: number[];
    quantity: number;
    price: number;
    original_price?: number; // Giá gốc biến thể
    discount_percent?: number; // Phần trăm giảm giá biến thể
    is_on_sale?: boolean; // Biến thể đang giảm giá hay không
    sold_count: number; // Số lượng đã bán của biến thể
  }>
}
export interface Department {
  id: number;
  name: string;
  slug: string;
  products_count?: number;
  active: boolean;
}
// Cập nhật CartItem để hỗ trợ giá gốc
export type CartItem = {
  id: number;
  product_id: number;
  title: string;
  slug: string;
  price: number;
  original_price?: number; // Giá gốc
  discount_percent?: number; // Phần trăm giảm giá
  is_on_sale?: boolean; // Đang giảm giá hay không
  quantity: number;
  available_quantity: number;
  image: string;
  option_ids: Record<string, number>;
  options: VariationTypeOption[]
}

export type GroupedCartItems = {
  user: User;
  items: CartItem[];
  totalPrice: number;
  totalQuantity: number;
}
interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  product: {
    title: string;
    slug: string;
    image: string;
  };
  options: string | any[]; // Could be a JSON string or an array
}
export interface Order {
  id: number;
  user_id: number | null;
  total_price: number;
  status: string;
  payment_status: string;
  payment_method: string;
  transaction_id?: string;
  payment_error?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  cancel_reason?: string;
  canceled_at?: string;
  created_at: string;
  updated_at: string;
  is_guest: boolean;
  token?: string;
  items: OrderItem[];
  histories?: OrderHistory[];
  status_text?: string;
  payment_status_text?: string;
  can_be_canceled?: boolean;
}

export interface OrderHistory {
  id: number;
  order_id: number;
  status: string;
  note?: string;
  created_at: string;
}
export interface Author {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  department_id: number;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  author?: {
    id: number;
    name: string;
  };
  published_at: string;
  status: string;
}

// Banner Types
export interface BannerImage {
  desktop: string;
  mobile: string;
}

export interface Banner {
  id: number;
  title: string;
  description?: string;
  url?: string;
  image: BannerImage;
  is_active?: boolean;
  order?: number;
  start_date?: string;
  end_date?: string;
}
export interface ResourceResponse<T> {
  data: T[];
}

export type PaginationProps<T> = {
  data: Array<T>
}

export type PageProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
  csrf_token: string;
  auth: {
    user: User;
  };
  ziggy: Config & { location: string };
  totalQuantity: number;
  totalPrice: number;
  miniCartItems: CartItem[];
  banners?: Banner[];
  blogCategories?: ResourceResponse<Category>;
  departments?: ResourceResponse<Department>;
  success?: string;
  error?: string;
  checkoutPending?: boolean;
  isGuest?: boolean;
  guestInfo?: {
    name: string;
    email: string;
    phone: string;
  };
};
export interface GuestCheckoutProps extends PageProps {
  auth: {
    user: User | null;
  };
}

export interface CheckoutProps extends PageProps {
  cartItems: Record<number, GroupedCartItems>;
  totalPrice: number;
  isGuest: boolean;
  guestInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface OrderConfirmationProps extends PageProps {
  order: Order;
  qrCodeUrl: string | null;
  isGuest?: boolean;
}

export interface OrderShowProps extends PageProps {
  order: Order;
}

export interface CheckoutNoticeProps {
  show: boolean;
}
export interface PaginatedData<T> extends PaginationProps<T> {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number;
  to?: number;
  prev_page_url: string | null;
  next_page_url: string | null;
  links?: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
}
// import { Config } from 'ziggy-js';
//
// export interface User {
//     id: number;
//     name: string;
//     email: string;
//     email_verified_at?: string;
// }
//
// export type Image = {
//   id: number;
//   thumb: string;
//   small: string;
//   large: string;
// }
//
// export type VariationTypeOption = {
//   id: number;
//   name: string;
//   images: Image[];
//   type: VariationType
// }
//
// export type VariationType = {
//   id: number;
//   name: string;
//   type: 'Select' | 'Radio' | 'Image';
//   options: VariationTypeOption[];
// }
//
// export type Product = {
//   id: number;
//   title: string;
//   slug: string;
//   price: number;
//   quantity: number;
//   image: string;
//   images: Image[];
//   short_description: string;
//   description: string;
//   user: {
//     id: number;
//     name: string;
//   };
//   department: {
//     id: number;
//     name: string;
//   };
//   variationTypes: VariationType[],
//   variations: Array<{
//     id: number;
//     variation_type_option_ids: number[];
//     quantity: number;
//     price: number;
//   }>
// }
//
//   export type CartItem = {
//     id: number;
//     product_id: number;
//     title: string;
//     slug: string;
//     price: number;
//     quantity: number;
//     image: string;
//     option_ids: Record<string, number>;
//     options: VariationTypeOption[]
//   }
//
//   export type GroupedCartItems = {
//     user: User;
//     items: CartItem[];
//     totalPrice: number;
//     totalQuantity: number;
//   }
// export interface Author {
//   id: number;
//   name: string;
// }
//
// export interface Category {
//   id: number;
//   name: string;
//   slug: string;
// }
//
// export interface BlogPost {
//   id: number;
//   title: string;
//   slug: string;
//   excerpt?: string;
//   content: string;
//   featured_image?: string;
//   Category?: {
//     id: number;
//     name: string;
//   };
//   Author?: {
//     id: number;
//     name: string;
//   };
//   published_at: string;
//   status: string;
// }
// export type PaginationProps<T> ={
//   data: Array<T>
// }
//
// export type PageProps<
//     T extends Record<string, unknown> = Record<string, unknown>,
// > = T & {
//     csrf_token: string;
//     auth: {
//         user: User;
//     };
//     ziggy: Config & { location: string };
//     totalQuantity: number;
//     totalPrice: number;
//     miniCartItems: CartItem[];
// };
