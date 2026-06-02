import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getSettings } from "@/lib/supabase";

const pillars = [
  { name: "Trust", desc: "Every project built on transparency and integrity." },
  { name: "Elegance", desc: "Architecture that stands apart from the ordinary." },
  { name: "Legacy", desc: "Investments designed to endure for generations." },
];

function Counter({ end, suffix }: { end: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2200;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, isInView]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export function AboutSection() {
  const { data: settings } = useQuery({ queryKey: ["site-settings"], queryFn: getSettings });
  const stats = [
    { value: settings?.stat_projects ?? 500, suffix: "+", label: "Projects Delivered" },
    { value: settings?.stat_years ?? 20, suffix: "+", label: "Years of Trust" },
    { value: settings?.stat_cities ?? 4, suffix: "", label: "Cities" },
    { value: settings?.stat_families ?? 10000, suffix: "+", label: "Happy Families" },
  ];

  const statement =
    "Building Tamil Nadu's future landmarks with trust, elegance, and long-term value.";
  const words = statement.split(" ");

  return (
    <section id="about" className="py-16 sm:py-24 bg-[#0a0a0a] relative overflow-hidden">
      {/* Ambient */}
      <div className="absolute bottom-0 right-0 w-[50vw] h-[60vh] bg-amber-900/8 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section label */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-[10px] sm:text-xs tracking-[0.3em] text-primary/70 uppercase mb-3 sm:mb-4"
        >
          Our Story
        </motion.p>

        {/* Stats + Statement grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 mb-16 sm:mb-20 items-start">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-6 sm:gap-10">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  delay: idx * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex flex-col gap-1"
                data-testid={`stat-${stat.label.toLowerCase().replace(/\s/g, "-")}`}
              >
                <span className="text-3xl sm:text-4xl md:text-5xl font-serif text-primary drop-shadow-[0_0_20px_rgba(255,140,0,0.3)]">
                  <Counter end={stat.value} suffix={stat.suffix} />
                </span>
                <span className="text-[10px] sm:text-xs tracking-[0.18em] text-muted-foreground uppercase">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Brand statement */}
          <div className="flex flex-col justify-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-medium leading-relaxed text-foreground/85">
              {words.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, filter: "blur(6px)", y: 8 }}
                  whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.7,
                    delay: i * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="inline-block mr-[0.3em]"
                >
                  {word}
                </motion.span>
              ))}
            </h2>
          </div>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {pillars.map((pillar, idx) => (
            <motion.div
              key={pillar.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.9,
                delay: 0.3 + idx * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative p-6 sm:p-8 border border-white/[0.07] bg-white/[0.03] group hover:border-primary/30 hover:bg-white/[0.05] transition-all duration-500"
            >
              <div className="absolute top-0 left-6 w-10 h-[2px] bg-gradient-to-r from-primary to-amber-400 group-hover:w-20 transition-all duration-500 shadow-[0_0_8px_rgba(255,140,0,0.4)]" />
              <h3 className="text-base sm:text-lg font-serif tracking-[0.15em] text-foreground mt-5 mb-2">
                {pillar.name.toUpperCase()}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground/70 leading-relaxed">
                {pillar.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
