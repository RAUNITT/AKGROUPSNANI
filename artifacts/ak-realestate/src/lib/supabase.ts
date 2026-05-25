import { createClient, SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Graceful fallback — client is null when env vars are not configured
export const supabase: SupabaseClient = (url && key)
  ? createClient(url, key)
  : createClient("https://placeholder.supabase.co", "placeholder-key-not-configured");

const isConfigured = Boolean(url && key && url !== "https://placeholder.supabase.co");

// ── Helpers ──────────────────────────────────────────────

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

export async function getSettings() {
  if (!isConfigured) return null;
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();
  if (error) return null;
  return data;
}

export async function updateSettings(settings: Partial<{
  phone: string; email: string; whatsapp: string; office_address: string;
}>) {
  const { error } = await supabase
    .from("site_settings")
    .upsert({ id: 1, ...settings });
  if (error) throw error;
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

export async function submitContact(data: {
  first_name: string; last_name: string;
  email: string; phone: string; message: string;
}) {
  if (!isConfigured) return; // silently succeed in demo mode
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

// ── Demo data (shown when Supabase is not configured) ────

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
];
