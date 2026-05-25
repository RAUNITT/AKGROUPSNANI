import { useEffect, useState, useCallback } from "react";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, MapPin, Tag, ArrowLeft, MessageCircle } from "lucide-react";
import { getPropertyBySlug } from "@/lib/supabase";
import type { Property } from "@/lib/types";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";

function getYouTubeId(url: string): string | null {
  const patterns = [
    /[?&]v=([^&#]+)/,
    /youtu\.be\/([^?&#]+)/,
    /\/embed\/([^?&#]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function MediaSlider({ images, youtubeUrl }: { images: string[]; youtubeUrl: string | null }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selected, setSelected] = useState(0);
  const slides = [
    ...images.map((src) => ({ type: "image" as const, src })),
    ...(youtubeUrl ? [{ type: "youtube" as const, id: getYouTubeId(youtubeUrl) }] : []),
  ];

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", () => setSelected(emblaApi.selectedScrollSnap()));
  }, [emblaApi]);

  if (slides.length === 0) return null;

  return (
    <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] bg-[#080808] overflow-hidden">
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide, i) => (
            <div key={i} className="flex-none w-full h-full relative">
              {slide.type === "image" ? (
                <img
                  src={slide.src}
                  alt=""
                  className="w-full h-full object-cover brightness-85"
                />
              ) : (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${slide.id}?autoplay=0&rel=0&modestbranding=1`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Property video"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]/60 pointer-events-none" />

      {/* Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 bg-black/50 border border-white/15 flex items-center justify-center text-white/80 hover:bg-primary/20 hover:border-primary/50 hover:text-primary transition-all duration-300 backdrop-blur-sm z-10"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 bg-black/50 border border-white/15 flex items-center justify-center text-white/80 hover:bg-primary/20 hover:border-primary/50 hover:text-primary transition-all duration-300 backdrop-blur-sm z-10"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === selected ? "w-6 bg-primary" : "w-2 bg-white/30"
              }`}
            />
          ))}
        </div>
      )}

      {/* Thumbnail strip — desktop */}
      {images.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 hidden sm:flex gap-1.5 px-4 pb-4 justify-end z-10">
          {slides.map((slide, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`w-14 h-10 overflow-hidden border transition-all duration-200 shrink-0 ${
                i === selected ? "border-primary" : "border-white/10 opacity-60 hover:opacity-90"
              }`}
            >
              {slide.type === "image" ? (
                <img src={slide.src} className="w-full h-full object-cover" alt="" />
              ) : (
                <div className="w-full h-full bg-black flex items-center justify-center text-[8px] text-white/60 uppercase tracking-wider">
                  Video
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PropertyDetail() {
  const [, params] = useRoute("/property/:slug");
  const slug = params?.slug ?? "";
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getPropertyBySlug(slug)
      .then((p) => setProperty(p as Property))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <NavBar />

      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : notFound || !property ? (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <p className="text-foreground/50 text-sm">Property not found.</p>
          <Link href="/" className="text-primary text-sm hover:underline">← Back to home</Link>
        </div>
      ) : (
        <>
          {/* Slider */}
          <div className="pt-[60px]">
            <MediaSlider images={property.images ?? []} youtubeUrl={property.youtube_url} />
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
            {/* Back */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs tracking-widest text-muted-foreground/60 hover:text-primary transition-colors mb-8 uppercase"
            >
              <ArrowLeft size={13} /> Back to listings
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 sm:gap-14">
              {/* Main info */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Status badge */}
                  <span className="inline-block text-[10px] tracking-[0.25em] uppercase px-3 py-1 border border-primary/40 text-primary bg-primary/10 mb-4">
                    {property.status}
                  </span>

                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-foreground mb-3 leading-snug">
                    {property.title}
                  </h1>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground/70 mb-6">
                    <MapPin size={13} className="text-primary/60" />
                    {property.location}
                  </div>

                  <div className="w-10 h-px bg-gradient-to-r from-primary/70 to-transparent mb-8" />

                  {property.description && (
                    <p className="text-sm sm:text-base text-foreground/70 leading-relaxed mb-10">
                      {property.description}
                    </p>
                  )}

                  {/* Attributes */}
                  {property.attributes && property.attributes.length > 0 && (
                    <div className="mb-10">
                      <p className="text-[10px] tracking-[0.25em] uppercase text-primary/70 mb-4">
                        Property Details
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/[0.05] border border-white/[0.07]">
                        {property.attributes.map((attr) => (
                          <div key={attr.label} className="flex items-start gap-3 px-4 sm:px-5 py-3 sm:py-4 bg-[#0a0a0a] hover:bg-white/[0.02] transition-colors">
                            <Tag size={11} className="text-primary/50 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-[9px] sm:text-[10px] tracking-[0.15em] text-muted-foreground/50 uppercase mb-0.5">
                                {attr.label}
                              </p>
                              <p className="text-xs sm:text-sm text-foreground/85 font-medium">
                                {attr.value}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-1"
              >
                <div className="sticky top-24 border border-white/[0.07] bg-white/[0.03] p-6 sm:p-8">
                  <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                  <p className="text-[10px] tracking-[0.2em] text-muted-foreground/50 uppercase mb-2">Starting From</p>
                  <p className="text-2xl sm:text-3xl font-serif font-bold text-primary mb-1">
                    {property.price}
                  </p>
                  <p className="text-xs text-muted-foreground/50 mb-6">(Prices may vary by unit)</p>

                  <a
                    href="/#contact"
                    className="flex items-center justify-center gap-2 w-full h-12 bg-gradient-to-r from-primary to-amber-500 text-black font-bold tracking-[0.12em] text-xs transition-all hover:shadow-[0_0_24px_rgba(255,140,0,0.35)] mb-3"
                  >
                    ENQUIRE NOW
                  </a>
                  <a
                    href={`https://wa.me/${("919876543210")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full h-11 border border-[#25D366]/40 text-[#25D366] text-xs tracking-wider hover:bg-[#25D366]/10 transition-all"
                  >
                    <MessageCircle size={14} /> WhatsApp Us
                  </a>
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
