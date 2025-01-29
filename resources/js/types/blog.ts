export interface Author {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  category_id?: number;
  category?: Category;
  user_id: number;
  author?: Author;
  published_at: string;
  status: 'draft' | 'published' | 'archived';
  views: number;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  canonical_url?: string;
  og_image?: string;
  structured_data?: string | Record<string, any>;
  tags?: Tag[];
  created_at: string;
  updated_at: string;
}

export interface PaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface PaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface BlogIndexProps {
  posts: {
    data: BlogPost[];
    links: PaginationLinks;
    meta: PaginationMeta;
  };
}

export interface BlogShowProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

export interface BlogCategoryProps {
  category: Category;
  posts: {
    data: BlogPost[];
    links: PaginationLinks;
    meta: PaginationMeta;
  };
}

export interface BlogTagProps {
  tag: Tag;
  posts: {
    data: BlogPost[];
    links: PaginationLinks;
    meta: PaginationMeta;
  };
}
