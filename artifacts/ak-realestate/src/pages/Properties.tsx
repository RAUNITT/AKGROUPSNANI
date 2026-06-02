import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getAllProperties } from "@/lib/supabase";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Search, SlidersHorizontal } from "lucide-react";
import { useRequestProperty } from "@/contexts/RequestPropertyContext";
import type { Property } from "@/lib/types";

const STATUS_COLOR: Record<string, string> = {
  available: "text-emerald-400 border-emerald-400/40 bg-emerald-400/10",
  "for sale": "text-sky-400 border-sky-400/40 bg-sky-400/10",
  "high demand": "text-amber-400 border-amber-400/40 bg-amber-400/10",
  "launching soon": "text-primary border-primary/40 bg-primary/10",
  "sold out": "text-foreground/40 border-foreground/20 bg-foreground/5",
  "under construction": "text-purple-400 border-purple-400/40 bg-purple-400/10",
};

function statusColor(status: string) {
  return STATUS_COLOR[status.toLowerCase()] ?? "text-primary border-primary/40 bg-primary/10";
}

export default function Properties() {
  const { data: properties, isLoading } = useQuery({
    queryKey: ["properties"],
    queryFn: getAllProperties,
  });

  const { openModal } = useRequestProperty();

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All");
  const [status, setStatus] = useState("All");
  const [type, setType] = useState("All");

  const locations = ["All", "Chennai", "Coimbatore", "Madurai", "Trichy", "Salem"];
  const statuses = ["All", "Available", "Launching Soon", "High Demand"];

  // Extract types dynamically
  const types = ["All", ...Array.from(new Set(
    (properties || [])
      .flatMap(p => (p.attributes ?? []).filter((a: { label: string; value: string }) => a.label.toLowerCase() === "type").map((a: { label: string; value: string }) => a.value))
  ))];

  const filteredProperties = (properties || []).filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                          p.location.toLowerCase().includes(search.toLowerCase());
    const matchesLocation = location === "All" || p.location.includes(location);
    const matchesStatus = status === "All" || p.status === status;

    let matchesType = true;
    if (type !== "All") {
      const pType = (p.attributes ?? []).find((a: { label: string; value: string }) => a.label.toLowerCase() === "type")?.value;
      matchesType = pType === type;
    }

    return matchesSearch && matchesLocation && matchesStatus && matchesType;
  });

  return (
    <div className="page-content bg-transparent text-white">
      <NavBar />
      
      <div className="bg-[#0a0a0a]/90 min-h-screen pt-16">
        {/* Header */}
        <div className="pt-16 pb-10 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[40vh] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-[10px] sm:text-xs tracking-[0.3em] text-primary/70 uppercase mb-3">Our Portfolio</p>
              <h1 className="text-3xl sm:text-5xl font-serif font-display tracking-wide">Discover Properties</h1>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <Button
                onClick={() => openModal()}
                className="bg-gradient-to-r from-primary to-amber-500 text-black font-semibold tracking-widest uppercase rounded-none px-6 h-12"
                data-testid="button-request-custom-property"
              >
                Request a Custom Property
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="border-y border-white/10 bg-[#0d0d0d] sticky top-[72px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={16} />
              <Input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search properties..." 
                className="pl-10 bg-white/5 border-white/10 rounded-none h-11 text-sm focus-visible:ring-primary"
                data-testid="input-search-properties"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row w-full md:w-2/3 gap-4">
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="bg-white/5 border-white/10 rounded-none h-11 text-sm focus-visible:ring-primary" data-testid="select-location">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent className="bg-[#0f0f0f] border-white/10 text-white">
                  {locations.map(loc => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}
                </SelectContent>
              </Select>
              
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="bg-white/5 border-white/10 rounded-none h-11 text-sm focus-visible:ring-primary" data-testid="select-status">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-[#0f0f0f] border-white/10 text-white">
                  {statuses.map(st => <SelectItem key={st} value={st}>{st}</SelectItem>)}
                </SelectContent>
              </Select>
              
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="bg-white/5 border-white/10 rounded-none h-11 text-sm focus-visible:ring-primary" data-testid="select-type">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent className="bg-[#0f0f0f] border-white/10 text-white">
                  {types.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/3] bg-white/5 w-full" />
                <div className="p-6 border border-white/5 border-t-0">
                  <div className="h-6 w-3/4 bg-white/5 mb-3" />
                  <div className="h-4 w-1/2 bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-muted-foreground/50" size={24} />
            </div>
            <h3 className="text-xl font-serif text-foreground/90 mb-2">No properties found</h3>
            <p className="text-muted-foreground/60 text-sm mb-6">Try adjusting your search or filters to find what you're looking for.</p>
            <Button 
              variant="outline" 
              onClick={() => { setSearch(""); setLocation("All"); setStatus("All"); setType("All"); }}
              className="border-primary/50 text-primary hover:bg-primary hover:text-black rounded-none"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProperties.map((prop, idx) => (
              <motion.div
                key={prop.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: (idx % 6) * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link href={`/property/${prop.slug}`} className="block group h-full">
                  <div className="relative overflow-hidden bg-[#0d0d0d] border border-white/10 transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_12px_40px_rgba(255,140,0,0.12)] h-full flex flex-col">
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {prop.images?.[0] ? (
                        <img
                          src={prop.images[0]}
                          alt={prop.title}
                          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105 brightness-75 group-hover:brightness-90"
                        />
                      ) : (
                        <div className="w-full h-full bg-white/5 flex items-center justify-center text-muted-foreground/30 text-xs">No image</div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />

                      <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                        <Badge variant="outline" className={`text-[9px] sm:text-[10px] tracking-widest backdrop-blur-sm px-2 py-0.5 ${statusColor(prop.status)}`}>
                          {prop.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 sm:p-6 flex flex-col flex-grow">
                      <h3 className="text-lg sm:text-xl font-serif tracking-wide mb-3 text-foreground/90 group-hover:text-primary transition-colors duration-300">
                        {prop.title}
                      </h3>
                      <div className="flex items-end justify-between mt-auto">
                        <div className="space-y-1">
                          <p className="text-[10px] sm:text-xs tracking-[0.2em] text-muted-foreground uppercase">{prop.location}</p>
                          {prop.attributes?.[0] && (
                            <p className="text-[10px] sm:text-xs text-muted-foreground/60">{prop.attributes[0].value}</p>
                          )}
                        </div>
                        <p className="text-sm sm:text-base font-semibold text-foreground/90 group-hover:text-primary transition-colors">
                          {prop.price}
                        </p>
                      </div>
                      <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center gap-1.5 text-[10px] tracking-widest text-primary/70 group-hover:text-primary transition-colors uppercase font-medium">
                        View Details <ArrowRight size={11} />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      </div>
      <Footer />
    </div>
  );
}
