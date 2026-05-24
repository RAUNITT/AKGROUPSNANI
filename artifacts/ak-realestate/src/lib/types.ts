export type PropertyAttribute = { label: string; value: string };

export type Property = {
  id: string;
  slug: string;
  title: string;
  location: string;
  price: string;
  status: string;
  description: string | null;
  images: string[];
  youtube_url: string | null;
  is_featured: boolean;
  attributes: PropertyAttribute[];
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type SiteSettings = {
  id: number;
  phone: string;
  email: string;
  whatsapp: string;
  office_address: string;
};

export type ContactSubmission = {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  message: string;
  created_at?: string;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  image_url: string | null;
  category: string;
  author: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};
