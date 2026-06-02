import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getInsights } from "@/lib/supabase";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { ArrowRight, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function Insights() {
  const { data: insights, isLoading } = useQuery({
    queryKey: ["insights"],
    queryFn: getInsights,
  });

  const [activeTab, setActiveTab] = useState("All");
  const tabs = ["All", "Market Trends", "Investment Guide", "City Spotlight"];

  const filteredInsights = (insights || []).filter(
    (insight) => activeTab === "All" || insight.category === activeTab
  );

  return (
    <div className="page-content bg-transparent text-white">
      <NavBar />
      
      <div className="bg-[#0a0a0a]/90 min-h-screen pt-16">
        {/* Hero */}
        <div className="pt-16 pb-16 px-4 sm:px-6 relative overflow-hidden border-b border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[40vh] bg-amber-900/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="text-4xl sm:text-6xl font-serif font-display tracking-wide mb-4">INSIGHTS</h1>
            <p className="text-muted-foreground/70 text-sm sm:text-base max-w-2xl mx-auto uppercase tracking-widest">
              Market intelligence, city spotlights, investment guides
            </p>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/10 bg-[#0d0d0d] sticky top-[72px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap px-6 py-4 text-xs font-semibold tracking-widest uppercase transition-colors relative ${
                  activeTab === tab ? "text-primary" : "text-muted-foreground/60 hover:text-foreground"
                }`}
                data-testid={`tab-${tab.toLowerCase().replace(/ /g, "-")}`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[16/10] bg-white/5 w-full mb-4" />
                <div className="h-4 bg-white/5 w-1/4 mb-3" />
                <div className="h-6 bg-white/5 w-full mb-2" />
                <div className="h-6 bg-white/5 w-3/4" />
              </div>
            ))}
          </div>
        ) : filteredInsights.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-serif text-foreground/90 mb-2">No insights found</h3>
            <p className="text-muted-foreground/60 text-sm">Check back later for more updates.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {filteredInsights.map((insight, idx) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: (idx % 6) * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link href={`/insights/${insight.slug}`} className="block group h-full">
                  <div className="relative aspect-[16/10] overflow-hidden mb-5 border border-white/[0.05]">
                    {insight.image_url ? (
                      <img src={insight.image_url} alt={insight.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-75 group-hover:brightness-90" />
                    ) : (
                      <div className="w-full h-full bg-white/5 flex items-center justify-center text-muted-foreground/30 text-xs">No image</div>
                    )}
                    <div className="absolute top-3 left-3 bg-primary text-black text-[9px] font-bold tracking-widest uppercase px-3 py-1 shadow-lg">
                      {insight.category}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] tracking-widest text-muted-foreground/50 uppercase mb-3">
                    <Calendar size={12} />
                    {format(new Date(insight.published_at), "MMM dd, yyyy")}
                  </div>
                  <h3 className="text-xl font-serif font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {insight.title}
                  </h3>
                  <p className="text-sm text-muted-foreground/70 line-clamp-3 mb-4 leading-relaxed">
                    {insight.excerpt}
                  </p>
                  <span className="inline-flex items-center text-xs font-semibold tracking-widest text-primary/70 uppercase group-hover:text-primary transition-colors">
                    Read <ArrowRight size={12} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                  </span>
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
