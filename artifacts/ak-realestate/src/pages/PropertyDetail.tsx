import { useEffect, useState, useCallback } from "react";
import { useRoute, Link } from "wouter";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, MapPin, Tag, ArrowLeft, MessageCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getPropertyBySlug, getSettings } from "@/lib/supabase";
import type { Property, SiteSettings } from "@/lib/types";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";

// ── Video URL parsers ─────────────────────────────────────────────────────────

type VideoSlide =
  | { type: "image"; src: string }
  | { type: "youtube"; embedUrl: string }
  | { type: "vimeo"; embedUrl: string }
  | { type: "video"; src: string };

function parseVideoUrl(url: string): Exclude<VideoSlide, { type: "image" }> | null {
  if (!url || !url.trim()) return null;
  const u = url.trim();

  // YouTube
  const ytPatterns = [/[?&]v=([^&#]+)/, /youtu\.be\/([^?&#]+)/, /\/embed\/([^?&#]+)/];
  for (const p of ytPatterns) {
    const m = u.match(p);
    if (m) return { type: "youtube", embedUrl: `https://www.youtube-nocookie.com/embed/${m[1]}?rel=0&modestbranding=1` };
  }

  // Vimeo
  const vimeoMatch = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) return { type: "vimeo", embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?dnt=1&title=0&byline=0&portrait=0` };

  // Cloudinary video or direct video file
  const isCloudinary = u.includes("cloudinary.com") && u.includes("/video/");
  const isDirectFile = /\.(mp4|webm|mov|m4v|ogg)(\?|$)/i.test(u);
  if (isCloudinary || isDirectFile) return { type: "video", src: u };

  return null;
}

// ── Media Slider ──────────────────────────────────────────────────────────────

function MediaSlider({ images, videoUrl }: { images: string[]; videoUrl: string | null }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selected, setSelected] = useState(0);

  const videoSlide = videoUrl ? parseVideoUrl(videoUrl) : null;

  const slides: VideoSlide[] = [
    ...images.map((src): VideoSlide => ({ type: "image", src })),
    ...(videoSlide ? [videoSlide] : []),
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
                <img src={slide.src} alt="" className="w-full h-full object-cover brightness-85" />
              ) : slide.type === "youtube" || slide.type === "vimeo" ? (
                <iframe
                  src={slide.embedUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Property video"
                />
              ) : (
                <video
                  src={slide.src}
                  className="w-full h-full object-cover"
                  controls
                  playsInline
                  preload="metadata"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]/50 pointer-events-none" />

      {slides.length > 1 && (
        <>
          <button onClick={scrollPrev} className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 bg-black/50 border border-white/12 flex items-center justify-center text-white/65 hover:text-white hover:border-white/25 transition-all backdrop-blur-sm z-10">
            <ChevronLeft size={16} />
          </button>
          <button onClick={scrollNext} className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 bg-black/50 border border-white/12 flex items-center justify-center text-white/65 hover:text-white hover:border-white/25 transition-all backdrop-blur-sm z-10">
            <ChevronRight size={16} />
          </button>
        </>
      )}

      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`h-px rounded-none transition-all duration-300 ${i === selected ? "w-8 bg-primary" : "w-3 bg-white/30"}`}
            />
          ))}
        </div>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 hidden sm:flex gap-1.5 px-4 pb-4 justify-end z-10">
          {slides.map((slide, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`w-14 h-9 overflow-hidden border transition-all duration-200 shrink-0 ${i === selected ? "border-primary" : "border-white/10 opacity-50 hover:opacity-80"}`}
            >
              {slide.type === "image" ? (
                <img src={slide.src} className="w-full h-full object-cover" alt="" />
              ) : (
                <div className="w-full h-full bg-black flex items-center justify-center text-[7px] text-white/50 uppercase tracking-wider">
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

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PropertyDetail() {
  const [, params] = useRoute("/property/:slug");
  const slug = params?.slug ?? "";
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const { data: settings } = useQuery<SiteSettings | null>({
    queryKey: ["site-settings"],
    queryFn: getSettings,
  });
  const whatsapp = settings?.whatsapp ?? "919876543210";

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
          <div className="w-6 h-6 border border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : notFound || !property ? (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <p className="text-foreground/40 text-sm font-light">Property not found.</p>
          <Link href="/" className="text-primary text-sm hover:underline font-light">← Back to home</Link>
        </div>
      ) : (
        <>
          <div className="pt-[61px]">
            <MediaSlider images={property.images ?? []} videoUrl={property.youtube_url} />
          </div>

          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-16">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[10px] tracking-[0.28em] text-foreground/35 hover:text-foreground/65 transition-colors mb-10 uppercase font-light"
            >
              <ArrowLeft size={12} /> Back to listings
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 sm:gap-16">
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="inline-block text-[9px] tracking-[0.32em] uppercase px-3 py-1.5 border border-primary/35 text-primary/80 mb-5 font-light">
                    {property.status}
                  </span>

                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-semibold text-foreground/90 mb-3 leading-tight tracking-tight">
                    {property.title}
                  </h1>

                  <div className="flex items-center gap-2 text-sm text-foreground/45 mb-6 font-light">
                    <MapPin size={12} className="text-primary/50 shrink-0" />
                    {property.location}
                  </div>

                  <div className="w-8 h-px bg-primary/45 mb-8" />

                  {property.description && (
                    <p className="text-sm sm:text-base text-foreground/55 leading-relaxed mb-10 font-light">
                      {property.description}
                    </p>
                  )}

                  {property.attributes && property.attributes.length > 0 && (
                    <div className="mb-10">
                      <p className="text-[9px] tracking-[0.32em] uppercase text-primary/60 mb-5 font-light">
                        Property Details
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/[0.04] border border-white/[0.06]">
                        {property.attributes.map((attr) => (
                          <div key={attr.label} className="flex items-start gap-3 px-5 py-4 bg-[#0a0a0a] hover:bg-[#0d0d0d] transition-colors">
                            <Tag size={10} className="text-primary/40 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-[9px] tracking-[0.2em] text-foreground/35 uppercase mb-0.5 font-light">
                                {attr.label}
                              </p>
                              <p className="text-sm text-foreground/80 font-light">
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

              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-1"
              >
                <div className="sticky top-24 border border-white/[0.07] bg-[#0d0d0d] p-7 sm:p-8">
                  <div className="absolute top-0 left-0 right-0 h-px bg-primary/20" />
                  <p className="text-[9px] tracking-[0.28em] text-foreground/35 uppercase mb-2 font-light">Starting From</p>
                  <p className="font-serif text-2xl sm:text-3xl font-semibold text-primary mb-1">
                    {property.price}
                  </p>
                  <p className="text-[10px] text-foreground/30 mb-7 font-light">Prices may vary by unit</p>

                  <a
                    href="/#contact"
                    className="flex items-center justify-center w-full h-12 bg-primary text-black font-medium tracking-[0.18em] text-[11px] transition-colors hover:bg-amber-400 mb-3 uppercase"
                  >
                    Enquire Now
                  </a>
                  <a
                    href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full h-10 border border-[#25D366]/30 text-[#25D366]/70 text-[11px] tracking-[0.18em] hover:border-[#25D366]/50 hover:text-[#25D366] transition-all uppercase font-light"
                  >
                    <MessageCircle size={13} /> WhatsApp Us
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
