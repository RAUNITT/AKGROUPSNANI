import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { getInsightBySlug } from "@/lib/supabase";
import type { Insight } from "@/lib/types";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { format } from "date-fns";

export default function InsightDetail() {
  const [, params] = useRoute("/insights/:slug");
  const slug = params?.slug ?? "";
  const [insight, setInsight] = useState<Insight | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getInsightBySlug(slug)
      .then((data) => setInsight(data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="page-content bg-[#0a0a0a]/90 text-white flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !insight) {
    return (
      <div className="page-content bg-[#0a0a0a]/90 text-white flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-foreground/50 text-sm">Insight not found.</p>
        <Link href="/insights" className="text-primary text-sm hover:underline">← Back to insights</Link>
      </div>
    );
  }

  return (
    <div className="page-content bg-transparent text-white">
      <NavBar />

      <div className="bg-[#0a0a0a]/90 min-h-screen pt-[56px]">
        <article>
        {/* Hero Image */}
        <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] bg-[#050505]">
          {insight.image_url && (
            <img src={insight.image_url} alt="" className="w-full h-full object-cover opacity-60" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-12 max-w-4xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex flex-wrap items-center gap-4 mb-4 text-[10px] sm:text-xs tracking-widest uppercase font-semibold text-primary/80">
                <span className="flex items-center gap-1.5 bg-primary/10 border border-primary/30 px-3 py-1 text-primary">
                  <Tag size={12} /> {insight.category}
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar size={12} /> {format(new Date(insight.published_at), "MMM dd, yyyy")}
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-display text-white leading-tight mb-4">
                {insight.title}
              </h1>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <Link
            href="/insights"
            className="inline-flex items-center gap-2 text-xs tracking-widest text-muted-foreground/60 hover:text-primary transition-colors mb-10 uppercase"
            data-testid="link-back-to-insights"
          >
            <ArrowLeft size={13} /> Back to Insights
          </Link>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="prose prose-invert prose-amber max-w-none prose-lg prose-headings:font-serif prose-headings:font-display prose-p:text-foreground/80 prose-p:leading-relaxed prose-a:text-primary hover:prose-a:text-amber-400"
            dangerouslySetInnerHTML={{ __html: insight.content.replace(/\n/g, "<br/>") }}
          />
        </div>
        </article>
      </div>

      <Footer />
    </div>
  );
}
