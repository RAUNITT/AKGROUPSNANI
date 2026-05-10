import { motion } from "framer-motion";
import { useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useListFeaturedProperties } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

export function PropertySection() {
  const { data: properties, isLoading } = useListFeaturedProperties();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "text-emerald-400 border-emerald-400/40 bg-emerald-400/10";
      case "LAUNCHING SOON":
        return "text-primary border-primary/40 bg-primary/10";
      case "SOLD OUT":
        return "text-foreground/40 border-foreground/20 bg-foreground/5";
      default:
        return "";
    }
  };

  return (
    <section
      id="properties"
      className="py-16 sm:py-24 bg-[#0a0a0a] relative overflow-hidden"
    >
      {/* Ambient */}
      <div className="absolute top-1/2 left-0 w-[40vw] h-[60vh] bg-primary/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-10 sm:mb-14 flex items-end justify-between">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <p className="text-[10px] sm:text-xs tracking-[0.3em] text-primary/70 uppercase mb-3">
            Our Portfolio
          </p>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground tracking-wide">
            Signature Properties
          </h2>
          <div className="mt-4 w-12 h-px bg-gradient-to-r from-primary/80 to-transparent shadow-[0_0_8px_rgba(255,140,0,0.4)]" />
        </motion.div>

        {/* Arrow controls — desktop */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={scrollPrev}
            className="w-10 h-10 border border-white/10 bg-white/5 hover:border-primary/50 hover:bg-primary/10 flex items-center justify-center text-foreground/60 hover:text-primary transition-all duration-300"
            data-testid="button-prev-property"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={scrollNext}
            className="w-10 h-10 border border-white/10 bg-white/5 hover:border-primary/50 hover:bg-primary/10 flex items-center justify-center text-foreground/60 hover:text-primary transition-all duration-300"
            data-testid="button-next-property"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div
        className="overflow-hidden cursor-grab active:cursor-grabbing"
        ref={emblaRef}
      >
        <div className="flex">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex-none pl-4 sm:pl-6 w-[85vw] sm:w-[50vw] lg:w-[33.333vw] xl:w-[28vw]">
                <Skeleton className="aspect-[4/3] w-full bg-white/5" />
                <div className="mt-4 space-y-2">
                  <Skeleton className="h-6 w-3/4 bg-white/5" />
                  <Skeleton className="h-4 w-1/2 bg-white/5" />
                </div>
              </div>
            ))
          ) : (
            properties?.map((prop, idx) => (
              <motion.div
                key={prop.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  delay: Math.min(idx * 0.08, 0.3),
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex-none pl-4 sm:pl-6 w-[85vw] sm:w-[50vw] lg:w-[33.333vw] xl:w-[28vw]"
                data-testid={`card-property-${prop.id}`}
              >
                <div className="group relative overflow-hidden bg-white/[0.04] border border-white/8 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_12px_40px_rgba(255,140,0,0.12)] h-full">
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={prop.image}
                      alt={prop.title}
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105 brightness-75 group-hover:brightness-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent" />
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                      <Badge
                        variant="outline"
                        className={`text-[9px] sm:text-[10px] tracking-widest backdrop-blur-sm px-2 py-0.5 ${getStatusColor(prop.status)}`}
                      >
                        {prop.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-serif tracking-wide mb-3 text-foreground/90 group-hover:text-primary transition-colors duration-300">
                      {prop.title}
                    </h3>
                    <div className="flex items-end justify-between">
                      <div className="space-y-1">
                        <p className="text-[10px] sm:text-xs tracking-[0.2em] text-muted-foreground uppercase">
                          {prop.location}
                        </p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground/60">
                          {prop.sqft} sq.ft
                        </p>
                      </div>
                      <p className="text-sm sm:text-base font-semibold text-foreground/90 group-hover:text-primary transition-colors">
                        {prop.price}
                      </p>
                    </div>
                  </div>

                  {/* Hover glow edge */}
                  <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Mobile arrows */}
      <div className="flex sm:hidden items-center justify-center gap-4 mt-6 px-6">
        <button
          onClick={scrollPrev}
          className="w-10 h-10 border border-white/10 bg-white/5 flex items-center justify-center text-foreground/60"
          data-testid="button-prev-property-mobile"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={scrollNext}
          className="w-10 h-10 border border-white/10 bg-white/5 flex items-center justify-center text-foreground/60"
          data-testid="button-next-property-mobile"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </section>
  );
}
