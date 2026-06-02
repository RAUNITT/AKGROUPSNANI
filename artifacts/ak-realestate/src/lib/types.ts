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
  stat_projects?: number;
  stat_years?: number;
  stat_cities?: number;
  stat_families?: number;
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

export type Insight = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  image_url: string | null;
  category: string;
  published_at: string;
  created_at: string;
  updated_at: string;
};

export type PropertyRequest = {
  id?: string;
  name: string;
  phone: string;
  email: string;
  property_type: string;
  location_preference: string;
  budget_min: string;
  budget_max: string;
  bedrooms: string;
  purpose: string;
  additional_notes: string | null;
  created_at?: string;
};
