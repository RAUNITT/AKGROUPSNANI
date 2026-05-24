import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { value: 500, suffix: "+", label: "Projects Delivered" },
  { value: 12, suffix: "+", label: "Years of Trust" },
  { value: 4, suffix: "", label: "Cities" },
  { value: 10000, suffix: "+", label: "Happy Families" },
];

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
    const duration = 2000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [end, isInView]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export function AboutSection() {
  return (
    <section id="about" className="py-16 sm:py-24 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-[10px] tracking-[0.38em] text-primary/65 uppercase mb-4 font-light"
        >
          Our Story
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20 mb-16 sm:mb-20 items-start">
          <div className="grid grid-cols-2 gap-8 sm:gap-12">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.09, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col gap-2 border-l border-white/[0.07] pl-5"
                data-testid={`stat-${stat.label.toLowerCase().replace(/\s/g, "-")}`}
              >
                <span className="text-3xl sm:text-4xl md:text-5xl font-serif text-primary font-medium">
                  <Counter end={stat.value} suffix={stat.suffix} />
                </span>
                <span className="text-[9px] tracking-[0.22em] text-foreground/40 uppercase font-light">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col justify-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="text-2xl sm:text-3xl md:text-4xl font-serif font-medium leading-relaxed text-foreground/80 mb-6"
            >
              Building Tamil Nadu's future landmarks with trust, elegance, and long-term value.
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="w-10 h-px bg-primary/50 origin-left"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/[0.05]">
          {pillars.map((pillar, idx) => (
            <motion.div
              key={pillar.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.2 + idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="relative p-8 sm:p-10 bg-[#0a0a0a] group hover:bg-[#0d0d0d] transition-colors duration-400"
            >
              <div className="w-8 h-px bg-primary/50 mb-6" />
              <h3 className="font-serif text-lg sm:text-xl tracking-[0.08em] text-foreground/85 mb-3">
                {pillar.name}
              </h3>
              <p className="text-sm text-foreground/45 leading-relaxed font-light">
                {pillar.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
