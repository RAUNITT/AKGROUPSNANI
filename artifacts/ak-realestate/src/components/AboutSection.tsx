import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { value: 500, suffix: "+", label: "Projects" },
  { value: 12, suffix: "+", label: "Years" },
  { value: 4, suffix: "", label: "Cities" },
  { value: 10000, suffix: "+", label: "Happy Families" }
];

function Counter({ end, suffix }: { end: number, suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
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

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export function AboutSection() {
  const statement = "Building Tamil Nadu's future landmarks with trust, elegance, and long-term value.";
  const words = statement.split(" ");

  return (
    <section id="about" className="py-24 bg-[#0a0a0a] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20 items-center">
          <div className="grid grid-cols-2 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col"
              >
                <span className="text-4xl md:text-5xl font-serif text-primary mb-2 shadow-[0_0_15px_rgba(255,140,0,0.1)] inline-block w-fit">
                  <Counter end={stat.value} suffix={stat.suffix} />
                </span>
                <span className="text-sm tracking-widest text-muted-foreground uppercase">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>

          <div>
            <h2 className="text-2xl md:text-4xl font-serif font-medium leading-snug text-foreground/90">
              {words.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, filter: "blur(4px)" }}
                  whileInView={{ opacity: 1, filter: "blur(0px)" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-block mr-2"
                >
                  {word}
                </motion.span>
              ))}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {["Trust", "Elegance", "Legacy"].map((pillar, idx) => (
            <motion.div
              key={pillar}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 + (idx * 0.2), ease: [0.22, 1, 0.36, 1] }}
              className="relative p-8 border border-white/5 bg-white/5 backdrop-blur-sm group hover:border-primary/30 transition-colors duration-500"
            >
              <div className="absolute top-0 left-8 w-12 h-[2px] bg-primary group-hover:w-24 transition-all duration-500 shadow-[0_0_10px_rgba(255,140,0,0.5)]" />
              <h3 className="text-xl font-serif tracking-widest text-foreground mt-4">{pillar.toUpperCase()}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
