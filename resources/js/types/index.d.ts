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
  sold_count?: number; // Số lượng đã bán
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
    sold_count?: number; // Số lượng đã bán của biến thể
  }>
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

export interface Author {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  Category?: {
    id: number;
    name: string;
  };
  Author?: {
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
  banners?: Banner[]; // Thêm banners vào PageProps
};
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
