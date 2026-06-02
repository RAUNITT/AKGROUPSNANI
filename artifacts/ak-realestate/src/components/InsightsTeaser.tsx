import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getInsights } from "@/lib/supabase";
import { format } from "date-fns";

export function InsightsTeaser() {
  const { data: insights, isLoading } = useQuery({
    queryKey: ["insights", "recent"],
    queryFn: getInsights,
  });

  const displayInsights = (insights ?? []).slice(0, 3);

  return (
    <section className="py-16 sm:py-24 bg-[#050505] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[40vw] h-[60vh] bg-amber-900/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 sm:mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[10px] sm:text-xs tracking-[0.3em] text-primary/70 uppercase mb-3">Market Intelligence</p>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-display tracking-wide text-foreground">Latest Insights</h2>
            <div className="mt-4 w-12 h-px bg-gradient-to-r from-primary/80 to-transparent shadow-[0_0_8px_rgba(255,140,0,0.4)]" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href="/insights"
              className="inline-flex items-center text-xs font-semibold tracking-widest uppercase text-foreground hover:text-primary transition-colors gap-2"
              data-testid="link-view-all-insights"
            >
              View All Insights <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[16/10] bg-white/5 w-full mb-4" />
                <div className="h-4 bg-white/5 w-1/4 mb-3" />
                <div className="h-6 bg-white/5 w-full mb-2" />
                <div className="h-6 bg-white/5 w-3/4" />
              </div>
            ))
          ) : (
            displayInsights.map((insight, idx) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.15, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link href={`/insights/${insight.slug}`} className="block group h-full">
                  <div className="relative aspect-[16/10] overflow-hidden mb-5 border border-white/[0.05]">
                    {insight.image_url ? (
                      <img src={insight.image_url} alt={insight.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-75 group-hover:brightness-90" />
                    ) : (
                      <div className="w-full h-full bg-white/5 flex items-center justify-center text-muted-foreground/30 text-xs">No image</div>
                    )}
                    <div className="absolute top-3 left-3 bg-primary text-black text-[9px] font-bold tracking-widest uppercase px-3 py-1">
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
                  <p className="text-sm text-muted-foreground/70 line-clamp-2 mb-4 leading-relaxed">
                    {insight.excerpt}
                  </p>
                  <span className="inline-flex items-center text-xs font-semibold tracking-widest text-primary/70 uppercase group-hover:text-primary transition-colors">
                    Read More <ArrowRight size={12} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
