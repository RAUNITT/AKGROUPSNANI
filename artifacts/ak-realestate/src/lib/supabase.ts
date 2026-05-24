import { createClient, SupabaseClient } from "@supabase/supabase-js";

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

// ── Blog Posts ────────────────────────────────────────────

export async function getPublishedPosts() {
  if (!isConfigured) return DEMO_BLOG_POSTS;
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });
  if (error) return DEMO_BLOG_POSTS;
  return data ?? [];
}

export async function getAllPosts() {
  if (!isConfigured) return DEMO_BLOG_POSTS;
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getPostBySlug(slug: string) {
  if (!isConfigured) return DEMO_BLOG_POSTS.find((p) => p.slug === slug) ?? null;
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) throw error;
  return data;
}

export async function createPost(data: Record<string, unknown>) {
  const { data: row, error } = await supabase
    .from("blog_posts")
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return row;
}

export async function updatePost(id: string, data: Record<string, unknown>) {
  const { error } = await supabase
    .from("blog_posts")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function deletePost(id: string) {
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) throw error;
}

// ── Demo data ─────────────────────────────────────────────

const DEMO_PROPERTIES = [
  {
    id: "demo-1", slug: "zenith-residences", title: "The Zenith Residences",
    location: "Chennai, Tamil Nadu", price: "₹4.2 Cr onwards", status: "Available",
    description: "A vertical landmark of ultra-premium living rising above the Chennai skyline.",
    images: ["https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80"],
    youtube_url: null, is_featured: true,
    attributes: [{ label: "Type", value: "Apartment" }, { label: "Area", value: "3,200 sq.ft" }],
    display_order: 0, created_at: "2025-01-15T00:00:00Z", updated_at: "2025-01-15T00:00:00Z",
  },
  {
    id: "demo-2", slug: "amber-grove-villas", title: "Amber Grove Villas",
    location: "Coimbatore, Tamil Nadu", price: "₹2.8 Cr onwards", status: "Launching Soon",
    description: "Sprawling private villas set within a curated grove of greenery.",
    images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80"],
    youtube_url: null, is_featured: true,
    attributes: [{ label: "Type", value: "Villa" }, { label: "Land Size", value: "4,500 sq.ft" }],
    display_order: 1, created_at: "2025-02-10T00:00:00Z", updated_at: "2025-02-10T00:00:00Z",
  },
  {
    id: "demo-3", slug: "prestige-towers", title: "The Prestige Towers",
    location: "Madurai, Tamil Nadu", price: "₹1.9 Cr onwards", status: "Available",
    description: "Twin towers of architectural excellence in the heart of the city.",
    images: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80"],
    youtube_url: null, is_featured: true,
    attributes: [{ label: "Type", value: "Apartment" }, { label: "Area", value: "2,100 sq.ft" }],
    display_order: 2, created_at: "2025-03-05T00:00:00Z", updated_at: "2025-03-05T00:00:00Z",
  },
  {
    id: "demo-4", slug: "elysian-heights", title: "Elysian Heights",
    location: "Chennai, Tamil Nadu", price: "₹6.5 Cr onwards", status: "High Demand",
    description: "Bespoke penthouses with panoramic ocean vistas and bespoke interiors.",
    images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"],
    youtube_url: null, is_featured: true,
    attributes: [{ label: "Type", value: "Penthouse" }, { label: "Area", value: "5,800 sq.ft" }],
    display_order: 3, created_at: "2025-03-20T00:00:00Z", updated_at: "2025-03-20T00:00:00Z",
  },
  {
    id: "demo-5", slug: "saffron-gardens", title: "Saffron Gardens",
    location: "Trichy, Tamil Nadu", price: "₹89 Lakh onwards", status: "Available",
    description: "Thoughtfully designed apartments in a vibrant residential community.",
    images: ["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80"],
    youtube_url: null, is_featured: false,
    attributes: [{ label: "Type", value: "Apartment" }, { label: "Area", value: "1,450 sq.ft" }],
    display_order: 4, created_at: "2025-04-01T00:00:00Z", updated_at: "2025-04-01T00:00:00Z",
  },
  {
    id: "demo-6", slug: "royal-palms-residency", title: "Royal Palms Residency",
    location: "Thanjavur, Tamil Nadu", price: "₹1.4 Cr onwards", status: "Under Construction",
    description: "Heritage-inspired luxury villas surrounded by palm groves and lush gardens.",
    images: ["https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80"],
    youtube_url: null, is_featured: false,
    attributes: [{ label: "Type", value: "Villa" }, { label: "Land Size", value: "3,200 sq.ft" }],
    display_order: 5, created_at: "2025-04-15T00:00:00Z", updated_at: "2025-04-15T00:00:00Z",
  },
];

const DEMO_BLOG_POSTS = [
  {
    id: "blog-1",
    slug: "real-estate-trends-2025",
    title: "Real Estate Trends Shaping Tamil Nadu in 2025",
    excerpt: "From rising demand in Tier-2 cities to the luxury segment boom, here's what's defining the Tamil Nadu market this year.",
    content: "The Tamil Nadu real estate market has witnessed remarkable growth over the past few years, and 2025 is no different. Several key trends are shaping the landscape.\n\nFirst, the rise of Tier-2 cities. Cities like Coimbatore, Madurai, and Trichy are seeing unprecedented interest from both developers and buyers. Improved connectivity, better infrastructure, and lower land costs are driving this shift.\n\nSecond, the luxury segment is booming. Premium and ultra-premium properties in Chennai are in high demand, with NRI buyers and successful entrepreneurs seeking lifestyle upgrades.\n\nThird, sustainability is no longer optional. Green-certified buildings, rainwater harvesting, and solar integration are now expected features in any premium development.\n\nFinally, the digital-first buyer journey has transformed how properties are marketed and sold. Virtual tours, WhatsApp consultations, and transparent pricing have become the norm.\n\nAt AK Group, we're at the forefront of all these trends — delivering properties that don't just meet market expectations but exceed them.",
    image_url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    category: "Market Update",
    author: "AK Group Editorial",
    is_published: true,
    created_at: "2025-05-10T00:00:00Z",
    updated_at: "2025-05-10T00:00:00Z",
  },
  {
    id: "blog-2",
    slug: "buying-your-first-luxury-home",
    title: "5 Things to Know Before Buying Your First Luxury Home",
    excerpt: "Luxury real estate is a different game. From due diligence to legal checks, here's your complete guide to a confident first purchase.",
    content: "Buying a luxury property is one of the most significant decisions of your life. Unlike a regular residential purchase, premium real estate comes with its own set of considerations.\n\n1. Understand the all-in cost. The sticker price is just the beginning. Factor in stamp duty, registration fees, GST (if under construction), interior fit-out, and annual maintenance charges.\n\n2. Verify RERA registration. Ensure the project is registered with Tamil Nadu RERA. This protects you legally and guarantees project completion timelines.\n\n3. Evaluate the developer's track record. Visit completed projects by the same builder. Speak to existing residents. A developer's past work is the best indicator of what you'll receive.\n\n4. Location fundamentals still apply. Even in luxury, location drives value. Proximity to quality schools, hospitals, commercial hubs, and the airport significantly impacts appreciation.\n\n5. Work with a trusted advisor. The luxury segment benefits enormously from expert guidance. At AK Group, our advisors provide transparent, end-to-end support from site visit to registration.",
    image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    category: "Tips & Advice",
    author: "AK Group Editorial",
    is_published: true,
    created_at: "2025-04-22T00:00:00Z",
    updated_at: "2025-04-22T00:00:00Z",
  },
  {
    id: "blog-3",
    slug: "investment-guide-chennai-real-estate",
    title: "Chennai Real Estate as an Investment: A 2025 Guide",
    excerpt: "Is Chennai still the right market for property investment? We break down the numbers, the hotspots, and the opportunities.",
    content: "Chennai continues to be one of India's most resilient real estate markets. Despite global economic headwinds, the city's fundamentals remain strong.\n\nThe IT corridor along Old Mahabalipuram Road (OMR) continues to attract working professionals and investors alike. Capital values have appreciated 12–18% YoY in premium micro-markets.\n\nAnnual rental yields in Chennai's prime residential segments range from 3.5% to 5.5% — competitive by Indian metro standards.\n\nFor the ultra-premium segment, the story is even more compelling. Supply remains limited, demand continues to grow, and the profile of buyers has never been more discerning.\n\nKey investment hotspots in 2025: Nungambakkam and Poes Garden for established luxury; OMR and Perumbakkam for growth-oriented buyers; ECR and East Coast Road for lifestyle and second-home buyers.\n\nOur recommendation: invest in quality, invest in proven developers, and invest for the long term. Real estate rewards patience.",
    image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    category: "Investment",
    author: "AK Group Research",
    is_published: true,
    created_at: "2025-04-05T00:00:00Z",
    updated_at: "2025-04-05T00:00:00Z",
  },
  {
    id: "blog-4",
    slug: "vaastu-modern-luxury-homes",
    title: "Vaastu Principles in Modern Luxury Architecture",
    excerpt: "How AK Group integrates ancient Vaastu wisdom with contemporary design to create spaces that feel right — inside and out.",
    content: "At AK Group, we believe that a truly great home resonates on multiple levels — architectural, aesthetic, and energetic. This is why we integrate Vaastu Shastra principles into our design process from day one.\n\nVaastu is not superstition — it's a sophisticated ancient science of spatial arrangement that promotes well-being, prosperity, and harmony. When adapted intelligently to modern construction, it results in spaces that simply feel better to live in.\n\nKey Vaastu elements we incorporate: Main entrances facing east or north for optimal light and positive energy. Master bedrooms in the southwest for stability. Living spaces that allow free circulation of air and natural light. Kitchen placement in the southeast to align with fire element principles.\n\nOf course, we never compromise on modern design aesthetics. Our approach is to find creative solutions where Vaastu principles enhance rather than restrict the architectural vision.\n\nThe result is homes where residents consistently report a sense of calm, clarity, and wellbeing — qualities that go far beyond square footage and specifications.",
    image_url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80",
    category: "Design",
    author: "AK Group Design Team",
    is_published: true,
    created_at: "2025-03-18T00:00:00Z",
    updated_at: "2025-03-18T00:00:00Z",
  },
];
