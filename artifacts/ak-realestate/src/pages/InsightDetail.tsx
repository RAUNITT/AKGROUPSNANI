import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Tag, User } from "lucide-react";
import { getPostBySlug } from "@/lib/supabase";
import type { BlogPost } from "@/lib/types";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

function ArticleBody({ content }: { content: string }) {
  const paragraphs = content.split(/\n\n+/).filter(Boolean);
  return (
    <div className="space-y-5">
      {paragraphs.map((para, i) => (
        <p key={i} className="text-base text-foreground/58 font-light leading-[1.85]">
          {para.trim()}
        </p>
      ))}
    </div>
  );
}

export default function InsightDetail() {
  const [, params] = useRoute("/insights/:slug");
  const slug = params?.slug ?? "";
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getPostBySlug(slug)
      .then((p) => {
        if (!p) setNotFound(true);
        else setPost(p as BlogPost);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <NavBar />

      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-6 h-6 border border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : notFound || !post ? (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <p className="text-foreground/35 text-sm font-light">Article not found.</p>
          <Link href="/insights" className="text-primary text-sm hover:underline font-light">← Back to Insights</Link>
        </div>
      ) : (
        <>
          {/* Hero image */}
          {post.image_url && (
            <div className="pt-[61px]">
              <div className="w-full aspect-[21/9] overflow-hidden bg-[#080808]">
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-full object-cover brightness-[0.6]"
                />
              </div>
            </div>
          )}

          <div className={post.image_url ? "" : "pt-[61px]"}>
            <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              >
                <Link
                  href="/insights"
                  className="inline-flex items-center gap-2 text-[10px] tracking-[0.28em] text-foreground/30 hover:text-foreground/60 transition-colors mb-8 uppercase font-light"
                >
                  <ArrowLeft size={11} /> Back to Insights
                </Link>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <span className="flex items-center gap-1.5 text-[9px] tracking-[0.28em] text-primary/70 uppercase font-light">
                    <Tag size={9} />
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1.5 text-[9px] tracking-[0.18em] text-foreground/35 font-light">
                    <Calendar size={9} />
                    {formatDate(post.created_at)}
                  </span>
                  {post.author && (
                    <span className="flex items-center gap-1.5 text-[9px] tracking-[0.18em] text-foreground/35 font-light">
                      <User size={9} />
                      {post.author}
                    </span>
                  )}
                </div>

                <h1 className="font-serif font-semibold text-2xl sm:text-3xl md:text-4xl text-foreground/90 leading-tight tracking-tight mb-4">
                  {post.title}
                </h1>

                {post.excerpt && (
                  <p className="text-lg text-foreground/45 font-light leading-relaxed mb-8 border-l-2 border-primary/35 pl-5 italic font-serif">
                    {post.excerpt}
                  </p>
                )}

                <div className="w-10 h-px bg-primary/40 mb-8" />

                {post.content ? (
                  <ArticleBody content={post.content} />
                ) : (
                  <p className="text-foreground/35 text-sm font-light italic">No content available.</p>
                )}

                <div className="mt-12 pt-8 border-t border-white/[0.07]">
                  <Link
                    href="/insights"
                    className="inline-flex items-center gap-2 text-[10px] tracking-[0.28em] text-primary/55 hover:text-primary transition-colors uppercase font-light"
                  >
                    <ArrowLeft size={11} /> More Insights
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>

          <Footer />
        </>
      )}
    </div>
  );
}
