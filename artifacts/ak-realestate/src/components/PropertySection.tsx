import { motion } from "framer-motion";
import { useCallback } from "react";
import { Link } from "wouter";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, ArrowRight, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { getFeaturedProperties } from "@/lib/supabase";
import type { Property } from "@/lib/types";

const STATUS_COLORS: Record<string, string> = {
  available: "text-emerald-400 border-emerald-400/35",
  "for sale": "text-sky-400 border-sky-400/35",
  "high demand": "text-amber-400 border-amber-400/35",
  "launching soon": "text-primary border-primary/35",
  "pre-launch": "text-primary border-primary/35",
  "sold out": "text-foreground/35 border-foreground/15",
  "under construction": "text-foreground/55 border-foreground/25",
};
function statusColor(status: string) {
  return STATUS_COLORS[status.toLowerCase()] ?? "text-primary border-primary/35";
}

export function PropertySection() {
  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: ["featured-properties"],
    queryFn: getFeaturedProperties,
  });

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start", slidesToScroll: 1 });
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section id="properties" className="py-16 sm:py-24 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 mb-10 sm:mb-14 flex items-end justify-between">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[10px] tracking-[0.38em] text-primary/65 uppercase mb-4 font-light">
            Our Portfolio
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold tracking-tight">
            Signature Properties
          </h2>
          <div className="mt-4 w-10 h-px bg-primary/55" />
        </motion.div>

        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={scrollPrev}
            className="w-10 h-10 border border-white/10 bg-transparent hover:border-white/25 flex items-center justify-center text-foreground/40 hover:text-foreground/75 transition-all duration-300"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={scrollNext}
            className="w-10 h-10 border border-white/10 bg-transparent hover:border-white/25 flex items-center justify-center text-foreground/40 hover:text-foreground/75 transition-all duration-300"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
        <div className="flex">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex-none pl-5 sm:pl-8 w-[85vw] sm:w-[50vw] lg:w-[33.333vw] xl:w-[28vw]">
                  <Skeleton className="aspect-[4/3] w-full bg-white/[0.04]" />
                  <div className="mt-4 space-y-2">
                    <Skeleton className="h-5 w-3/4 bg-white/[0.04]" />
                    <Skeleton className="h-4 w-1/2 bg-white/[0.04]" />
                  </div>
                </div>
              ))
            : (properties ?? []).map((prop, idx) => (
                <motion.div
                  key={prop.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: Math.min(idx * 0.07, 0.28), ease: [0.22, 1, 0.36, 1] }}
                  className="flex-none pl-5 sm:pl-8 w-[85vw] sm:w-[50vw] lg:w-[33.333vw] xl:w-[28vw]"
                >
                  <Link href={`/property/${prop.slug}`} className="block group">
                    <div className="relative border border-white/[0.07] bg-[#0d0d0d] transition-all duration-500 hover:border-white/[0.15] h-full cursor-pointer">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        {prop.images?.[0] ? (
                          <img
                            src={prop.images[0]}
                            alt={prop.title}
                            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-[1.04] brightness-80 group-hover:brightness-90"
                          />
                        ) : (
                          <div className="w-full h-full bg-white/[0.03] flex items-center justify-center text-foreground/20 text-xs tracking-widest uppercase">
                            No Image
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d]/70 via-transparent to-transparent" />

                        {(prop.images?.length ?? 0) > 1 && (
                          <div className="absolute bottom-3 right-3 text-[8px] tracking-[0.2em] bg-black/55 text-white/50 px-2 py-1 uppercase">
                            +{prop.images.length - 1} photos
                          </div>
                        )}

                        <div className="absolute top-3 left-3">
                          <span className={`text-[9px] tracking-[0.22em] uppercase px-2.5 py-1 border bg-black/50 backdrop-blur-sm font-light ${statusColor(prop.status)}`}>
                            {prop.status}
                          </span>
                        </div>
                      </div>

                      <div className="p-5 sm:p-6">
                        <h3 className="font-serif text-lg sm:text-xl tracking-tight mb-2 text-foreground/88 group-hover:text-primary transition-colors duration-400">
                          {prop.title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-[10px] tracking-[0.18em] text-foreground/40 uppercase mb-4">
                          <MapPin size={10} className="text-primary/50 shrink-0" />
                          {prop.location}
                        </div>
                        <div className="flex items-end justify-between">
                          <p className="font-serif text-base sm:text-lg font-medium text-foreground/80 group-hover:text-primary transition-colors">
                            {prop.price}
                          </p>
                          <span className="flex items-center gap-1 text-[9px] tracking-[0.25em] text-primary/60 group-hover:text-primary transition-colors uppercase font-light">
                            View <ArrowRight size={10} />
                          </span>
                        </div>
                      </div>

                      <div className="absolute inset-x-0 bottom-0 h-px bg-primary/0 group-hover:bg-primary/30 transition-colors duration-500" />
                    </div>
                  </Link>
                </motion.div>
              ))}
        </div>
      </div>

      <div className="flex sm:hidden items-center justify-center gap-3 mt-6 px-5">
        <button onClick={scrollPrev} className="w-10 h-10 border border-white/10 flex items-center justify-center text-foreground/40">
          <ChevronLeft size={15} />
        </button>
        <button onClick={scrollNext} className="w-10 h-10 border border-white/10 flex items-center justify-center text-foreground/40">
          <ChevronRight size={15} />
        </button>
      </div>
    </section>
  );
}
