import { useState, useMemo } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Search, MapPin, ArrowRight, SlidersHorizontal } from "lucide-react";
import { getAllProperties } from "@/lib/supabase";
import type { Property } from "@/lib/types";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";

// Parse approximate crore value from price string
function parseCr(price: string): number {
  const lower = price.toLowerCase();
  const num = parseFloat(price.replace(/[^0-9.]/g, "") || "0");
  if (lower.includes("lakh")) return num / 100;
  return num;
}

const PRICE_FILTERS = [
  { label: "All Prices", fn: () => true },
  { label: "Under ₹2 Cr", fn: (p: Property) => parseCr(p.price) < 2 },
  { label: "₹2 – 5 Cr", fn: (p: Property) => parseCr(p.price) >= 2 && parseCr(p.price) < 5 },
  { label: "₹5 – 10 Cr", fn: (p: Property) => parseCr(p.price) >= 5 && parseCr(p.price) < 10 },
  { label: "Above ₹10 Cr", fn: (p: Property) => parseCr(p.price) >= 10 },
];

function PropertyCard({ property, index }: { property: Property; index: number }) {
  const thumb = property.images?.[0];
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
    >
      <Link href={`/property/${property.slug}`} className="group block border border-white/[0.07] hover:border-primary/30 transition-all duration-400 bg-[#0d0d0d]">
        {/* Image */}
        <div className="aspect-[4/3] overflow-hidden bg-[#111] relative">
          {thumb ? (
            <img
              src={thumb}
              alt={property.title}
              className="w-full h-full object-cover brightness-[0.82] group-hover:brightness-90 group-hover:scale-[1.03] transition-all duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-foreground/15 text-xs tracking-widest uppercase">No image</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d]/70 via-transparent to-transparent" />
          <span className="absolute top-3 left-3 text-[8px] tracking-[0.28em] uppercase px-2.5 py-1 border border-primary/40 text-primary/85 bg-black/40 backdrop-blur-sm">
            {property.status}
          </span>
        </div>

        {/* Info */}
        <div className="px-5 py-4">
          <h3 className="font-serif text-base font-semibold text-foreground/88 leading-tight mb-1.5 group-hover:text-foreground transition-colors">
            {property.title}
          </h3>
          <div className="flex items-center gap-1.5 text-[11px] text-foreground/40 font-light mb-3">
            <MapPin size={10} className="text-primary/40 shrink-0" />
            {property.location}
          </div>
          <div className="flex items-center justify-between">
            <span className="font-serif text-primary font-semibold text-base">{property.price}</span>
            <span className="text-primary/50 group-hover:text-primary transition-colors">
              <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Properties() {
  const [search, setSearch] = useState("");
  const [priceFilter, setPriceFilter] = useState(0);
  const [statusFilter, setStatusFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ["all-properties"],
    queryFn: getAllProperties,
  });

  const statuses = useMemo(() => {
    const s = new Set(properties.map((p) => p.status));
    return ["All", ...Array.from(s)];
  }, [properties]);

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      const matchSearch = !search.trim() ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.location.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || p.status === statusFilter;
      const matchPrice = PRICE_FILTERS[priceFilter].fn(p);
      return matchSearch && matchStatus && matchPrice;
    });
  }, [properties, search, priceFilter, statusFilter]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <NavBar />

      {/* Page header */}
      <div className="pt-[61px]">
        <div className="border-b border-white/[0.06] bg-[#080808]">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            >
              <p className="text-[9px] tracking-[0.42em] text-primary/55 uppercase font-light mb-3">Our Portfolio</p>
              <h1 className="font-serif font-semibold text-3xl sm:text-4xl text-foreground/90 mb-2 tracking-tight">
                All Properties
              </h1>
              <p className="text-sm text-foreground/40 font-light">
                {isLoading ? "Loading…" : `${filtered.length} ${filtered.length === 1 ? "property" : "properties"} found`}
                {properties.length > 0 && !isLoading && ` · ${properties.length} total`}
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
          {/* Filter bar */}
          <div className="mb-8 space-y-4">
            <div className="flex gap-3 flex-col sm:flex-row">
              {/* Search */}
              <div className="relative flex-1 max-w-sm">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30" />
                <input
                  type="text"
                  placeholder="Search by name or location…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-10 pl-9 pr-4 bg-white/5 border border-white/10 text-sm text-foreground/80 placeholder:text-foreground/25 focus:outline-none focus:border-primary/40 font-light"
                />
              </div>
              <button
                onClick={() => setShowFilters((v) => !v)}
                className={[
                  "flex items-center gap-2 h-10 px-4 border text-[10px] tracking-widest uppercase font-light transition-colors",
                  showFilters ? "border-primary/50 text-primary bg-primary/5" : "border-white/10 text-foreground/45 hover:border-white/20 hover:text-foreground/65",
                ].join(" ")}
              >
                <SlidersHorizontal size={12} />
                Filters
              </button>
            </div>

            {/* Expandable filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-4 border border-white/[0.06] p-4 bg-white/[0.02]"
              >
                {/* Price filter */}
                <div>
                  <p className="text-[9px] tracking-[0.3em] text-foreground/35 uppercase mb-2 font-light">Price Range</p>
                  <div className="flex flex-wrap gap-2">
                    {PRICE_FILTERS.map((f, i) => (
                      <button
                        key={f.label}
                        onClick={() => setPriceFilter(i)}
                        className={[
                          "text-[10px] tracking-wider uppercase px-3 py-1.5 border transition-all font-light",
                          priceFilter === i
                            ? "border-primary/60 text-primary bg-primary/10"
                            : "border-white/10 text-foreground/45 hover:border-white/22 hover:text-foreground/65",
                        ].join(" ")}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status filter */}
                <div>
                  <p className="text-[9px] tracking-[0.3em] text-foreground/35 uppercase mb-2 font-light">Status</p>
                  <div className="flex flex-wrap gap-2">
                    {statuses.map((s) => (
                      <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={[
                          "text-[10px] tracking-wider uppercase px-3 py-1.5 border transition-all font-light",
                          statusFilter === s
                            ? "border-primary/60 text-primary bg-primary/10"
                            : "border-white/10 text-foreground/45 hover:border-white/22 hover:text-foreground/65",
                        ].join(" ")}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="flex justify-center py-24">
              <div className="w-6 h-6 border border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
              <p className="text-foreground/30 text-sm font-light">No properties match your filters.</p>
              <button
                onClick={() => { setSearch(""); setPriceFilter(0); setStatusFilter("All"); }}
                className="text-primary text-xs tracking-widest uppercase underline underline-offset-4 font-light"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((p, i) => (
                <PropertyCard key={p.id} property={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
