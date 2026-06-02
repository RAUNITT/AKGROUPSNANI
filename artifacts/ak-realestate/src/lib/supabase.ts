import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Insight, PropertyRequest } from "./types";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase: SupabaseClient = (url && key)
  ? createClient(url, key)
  : createClient("https://placeholder.supabase.co", "placeholder-key-not-configured");

const isConfigured = Boolean(url && key && url !== "https://placeholder.supabase.co");

// ── Properties ────────────────────────────────────────────

export async function getFeaturedProperties() {
  if (!isConfigured) return DEMO_PROPERTIES;
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("is_featured", true)
    .order("display_order", { ascending: true });
  if (error) return DEMO_PROPERTIES;
  return data ?? [];
}

export async function getAllProperties() {
  if (!isConfigured) return DEMO_PROPERTIES;
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("display_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getPropertyBySlug(slug: string) {
  if (!isConfigured) return DEMO_PROPERTIES.find((p) => p.slug === slug) ?? null;
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) throw error;
  return data;
}

export async function getPropertyById(id: string) {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function createProperty(data: Record<string, unknown>) {
  const { data: row, error } = await supabase
    .from("properties")
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return row;
}

export async function updateProperty(id: string, data: Record<string, unknown>) {
  const { error } = await supabase
    .from("properties")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteProperty(id: string) {
  const { error } = await supabase.from("properties").delete().eq("id", id);
  if (error) throw error;
}

// ── Site Settings ─────────────────────────────────────────

export async function getSettings() {
  if (!isConfigured) return DEMO_SETTINGS;
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();
  if (error) return DEMO_SETTINGS;
  return data;
}

export async function updateSettings(settings: Partial<{
  phone: string; email: string; whatsapp: string; office_address: string;
  stat_projects: number; stat_years: number; stat_cities: number; stat_families: number;
}>) {
  const { error } = await supabase
    .from("site_settings")
    .upsert({ id: 1, ...settings });
  if (error) throw error;
}

// ── Contacts ──────────────────────────────────────────────

export async function submitContact(data: {
  first_name: string; last_name: string;
  email: string; phone: string; message: string;
}) {
  if (!isConfigured) return;
  const { error } = await supabase.from("contacts").insert(data);
  if (error) throw error;
}

export async function getContacts() {
  if (!isConfigured) return [];
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

// ── Insights ──────────────────────────────────────────────

export async function getInsights() {
  if (!isConfigured) return DEMO_INSIGHTS;
  const { data, error } = await supabase
    .from("insights")
    .select("*")
    .order("published_at", { ascending: false });
  if (error) return DEMO_INSIGHTS;
  return (data ?? []) as Insight[];
}

export async function getInsightBySlug(slug: string) {
  if (!isConfigured) return DEMO_INSIGHTS.find((i) => i.slug === slug) ?? null;
  const { data, error } = await supabase
    .from("insights")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) throw error;
  return data as Insight;
}

export async function createInsight(data: Record<string, unknown>) {
  const { data: row, error } = await supabase
    .from("insights")
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return row as Insight;
}

export async function updateInsight(id: string, data: Record<string, unknown>) {
  const { error } = await supabase
    .from("insights")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteInsight(id: string) {
  const { error } = await supabase.from("insights").delete().eq("id", id);
  if (error) throw error;
}

export async function uploadInsightImage(file: File): Promise<string> {
  if (!isConfigured) throw new Error("Supabase not configured");
  const ext = file.name.split(".").pop();
  const path = `insights/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
}

// ── Property Requests ────────────────────────────────────

export async function submitPropertyRequest(data: Omit<PropertyRequest, "id" | "created_at">) {
  if (!isConfigured) return;
  const { error } = await supabase.from("property_requests").insert(data);
  if (error) throw error;
}

export async function getPropertyRequests() {
  if (!isConfigured) return [];
  const { data, error } = await supabase
    .from("property_requests")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as PropertyRequest[];
}

// ── Demo data ─────────────────────────────────────────────

const DEMO_SETTINGS = {
  id: 1,
  phone: "+91 98765 43210",
  email: "luxury@akgroup.com",
  whatsapp: "919876543210",
  office_address: "Chennai, Tamil Nadu",
  stat_projects: 500,
  stat_years: 20,
  stat_cities: 4,
  stat_families: 10000,
};

const DEMO_PROPERTIES = [
  {
    id: "demo-1", slug: "zenith-residences", title: "The Zenith Residences",
    location: "Chennai, Tamil Nadu", price: "₹4.2 Cr onwards", status: "Available",
    description: "A vertical landmark of ultra-premium living rising above the Chennai skyline.",
    images: ["https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80"],
    youtube_url: null, is_featured: true,
    attributes: [{ label: "Type", value: "Apartment" }, { label: "Area", value: "3,200 sq.ft" }],
    display_order: 0, created_at: "", updated_at: "",
  },
  {
    id: "demo-2", slug: "amber-grove-villas", title: "Amber Grove Villas",
    location: "Coimbatore, Tamil Nadu", price: "₹2.8 Cr onwards", status: "Launching Soon",
    description: "Sprawling private villas set within a curated grove of greenery.",
    images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80"],
    youtube_url: null, is_featured: true,
    attributes: [{ label: "Type", value: "Villa" }, { label: "Land Size", value: "4,500 sq.ft" }],
    display_order: 1, created_at: "", updated_at: "",
  },
  {
    id: "demo-3", slug: "prestige-towers", title: "The Prestige Towers",
    location: "Madurai, Tamil Nadu", price: "₹1.9 Cr onwards", status: "Available",
    description: "Twin towers of architectural excellence in the heart of the city.",
    images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80"],
    youtube_url: null, is_featured: true,
    attributes: [{ label: "Type", value: "Apartment" }, { label: "Area", value: "2,100 sq.ft" }],
    display_order: 2, created_at: "", updated_at: "",
  },
  {
    id: "demo-4", slug: "elysian-heights", title: "Elysian Heights",
    location: "Chennai, Tamil Nadu", price: "₹6.5 Cr onwards", status: "High Demand",
    description: "Bespoke penthouses with panoramic ocean vistas and bespoke interiors.",
    images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"],
    youtube_url: null, is_featured: true,
    attributes: [{ label: "Type", value: "Penthouse" }, { label: "Area", value: "5,800 sq.ft" }],
    display_order: 3, created_at: "", updated_at: "",
  },
  {
    id: "demo-5", slug: "serene-gardens", title: "Serene Gardens",
    location: "Trichy, Tamil Nadu", price: "₹95 L onwards", status: "Available",
    description: "Thoughtfully designed mid-rise residences surrounded by curated green spaces.",
    images: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80"],
    youtube_url: null, is_featured: false,
    attributes: [{ label: "Type", value: "Apartment" }, { label: "Area", value: "1,200 sq.ft" }],
    display_order: 4, created_at: "", updated_at: "",
  },
  {
    id: "demo-6", slug: "heritage-manor", title: "Heritage Manor",
    location: "Salem, Tamil Nadu", price: "₹1.4 Cr onwards", status: "Under Construction",
    description: "A limited collection of heritage-inspired bungalows with timeless architecture.",
    images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80"],
    youtube_url: null, is_featured: false,
    attributes: [{ label: "Type", value: "Bungalow" }, { label: "Land Size", value: "3,000 sq.ft" }],
    display_order: 5, created_at: "", updated_at: "",
  },
];

const DEMO_INSIGHTS: Insight[] = [
  {
    id: "ins-1",
    slug: "real-estate-trends-2025",
    title: "Real Estate Trends Shaping Tamil Nadu in 2025",
    excerpt: "From tier-2 city expansion to smart home integration — how the market is evolving.",
    content: "Tamil Nadu's real estate sector is witnessing a transformational shift driven by infrastructure development, IT corridor expansion, and increasing demand for integrated townships...",
    image_url: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
    category: "Market Trends",
    published_at: "2025-05-15T10:00:00Z",
    created_at: "2025-05-15T10:00:00Z",
    updated_at: "2025-05-15T10:00:00Z",
  },
  {
    id: "ins-2",
    slug: "roi-guide-residential-investments",
    title: "Maximising ROI on Residential Investments: A Complete Guide",
    excerpt: "Understanding yield, capital appreciation, and long-term value in the Tamil Nadu market.",
    content: "Investing in residential real estate requires a nuanced understanding of location dynamics, rental demand, and appreciation cycles...",
    image_url: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=800&q=80",
    category: "Investment Guide",
    published_at: "2025-04-20T10:00:00Z",
    created_at: "2025-04-20T10:00:00Z",
    updated_at: "2025-04-20T10:00:00Z",
  },
  {
    id: "ins-3",
    slug: "coimbatore-emerging-realty-hub",
    title: "Coimbatore: Tamil Nadu's Next Major Realty Hub",
    excerpt: "Industrial growth, improved connectivity, and rising NRI interest make Coimbatore unmissable.",
    content: "Once overshadowed by Chennai, Coimbatore has emerged as a powerful real estate destination with a unique combination of industrial activity and quality of life...",
    image_url: "https://images.unsplash.com/photo-1592595896551-12b371d546d5?w=800&q=80",
    category: "City Spotlight",
    published_at: "2025-03-10T10:00:00Z",
    created_at: "2025-03-10T10:00:00Z",
    updated_at: "2025-03-10T10:00:00Z",
  },
];
