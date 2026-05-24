import { useState, useMemo } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Calendar, ArrowRight, Tag } from "lucide-react";
import { getPublishedPosts } from "@/lib/supabase";
import type { BlogPost } from "@/lib/types";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";

const CATEGORIES = ["All", "Market Update", "Tips & Advice", "Investment", "Design", "News"];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

function ArticleCard({ post, index, featured }: { post: BlogPost; index: number; featured?: boolean }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
    >
      <Link
        href={`/insights/${post.slug}`}
        className={[
          "group flex bg-[#0d0d0d] border border-white/[0.07] hover:border-primary/25 transition-all duration-400",
          featured ? "flex-col md:flex-row" : "flex-col",
        ].join(" ")}
      >
        {/* Image */}
        {post.image_url && (
          <div className={[
            "overflow-hidden bg-[#111] shrink-0",
            featured ? "h-52 md:h-auto md:w-1/2" : "h-44",
          ].join(" ")}>
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-full object-cover brightness-80 group-hover:brightness-90 group-hover:scale-[1.03] transition-all duration-700"
            />
          </div>
        )}

        {/* Content */}
        <div className={["flex flex-col justify-between px-5 py-5", featured ? "md:px-8 md:py-8" : ""].join(" ")}>
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="flex items-center gap-1.5 text-[8px] tracking-[0.28em] text-primary/65 uppercase font-light">
                <Tag size={8} />
                {post.category}
              </span>
              <span className="text-white/10">·</span>
              <span className="flex items-center gap-1.5 text-[8px] tracking-[0.18em] text-foreground/30 font-light">
                <Calendar size={8} />
                {formatDate(post.created_at)}
              </span>
            </div>

            <h2 className={[
              "font-serif font-semibold text-foreground/88 leading-snug mb-3 group-hover:text-foreground transition-colors",
              featured ? "text-xl sm:text-2xl" : "text-base",
            ].join(" ")}>
              {post.title}
            </h2>

            {post.excerpt && (
              <p className="text-sm text-foreground/42 font-light leading-relaxed line-clamp-3 mb-4">
                {post.excerpt}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 text-[10px] tracking-[0.22em] text-primary/55 uppercase group-hover:text-primary transition-colors">
            Read More <ArrowRight size={11} />
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export default function Insights() {
  const [category, setCategory] = useState("All");

  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["published-posts"],
    queryFn: getPublishedPosts,
  });

  const filtered = useMemo(() => {
    if (category === "All") return posts;
    return posts.filter((p) => p.category === category);
  }, [posts, category]);

  const [featured, ...rest] = filtered;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <NavBar />

      <div className="pt-[61px]">
        {/* Page header */}
        <div className="border-b border-white/[0.06] bg-[#080808]">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            >
              <p className="text-[9px] tracking-[0.42em] text-primary/55 uppercase font-light mb-3">Knowledge & News</p>
              <h1 className="font-serif font-semibold text-3xl sm:text-4xl text-foreground/90 mb-2 tracking-tight">
                Insights
              </h1>
              <p className="text-sm text-foreground/38 font-light max-w-lg">
                Market updates, investment guidance, design inspiration, and real estate tips — curated by AK Group.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={[
                  "text-[9px] tracking-[0.28em] uppercase px-3.5 py-1.5 border transition-all font-light",
                  category === cat
                    ? "border-primary/60 text-primary bg-primary/8"
                    : "border-white/[0.08] text-foreground/40 hover:border-white/18 hover:text-foreground/65",
                ].join(" ")}
              >
                {cat}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-24">
              <div className="w-6 h-6 border border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <p className="text-foreground/30 text-sm font-light">No articles in this category yet.</p>
              <button
                onClick={() => setCategory("All")}
                className="text-primary text-xs tracking-widest uppercase underline underline-offset-4 font-light"
              >
                View all
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Featured first article */}
              {featured && (
                <ArticleCard post={featured} index={0} featured />
              )}

              {/* Rest in grid */}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
                  {rest.map((p, i) => (
                    <ArticleCard key={p.id} post={p} index={i + 1} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
