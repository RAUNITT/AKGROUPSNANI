import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function LogoShowcase() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rotate = useTransform(scrollYProgress, [0, 1], [-3, 3]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={ref}
      className="py-24 sm:py-36 relative overflow-hidden flex flex-col items-center justify-center"
    >
      {/* Large background watermark logo — parallax */}
      <motion.div
        style={{ rotate, scale, opacity: useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.03, 0.06, 0.06, 0.03]) }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <img
          src="/ak-logo.png"
          alt=""
          className="w-[50vw] sm:w-[35vw] max-w-lg h-auto object-contain opacity-100"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="relative z-10 flex flex-col items-center gap-6 text-center px-6"
      >
        <span className="text-[9px] tracking-[0.52em] text-primary/50 uppercase font-light">
          Established · Tamil Nadu
        </span>

        <motion.h2
          style={{ rotate: useTransform(scrollYProgress, [0, 1], [1, -1]) }}
          className="font-serif font-semibold text-3xl sm:text-5xl md:text-6xl text-foreground/85 tracking-tight leading-tight max-w-2xl"
        >
          AK Group of Real Estate
        </motion.h2>

        <div className="w-10 h-px bg-primary/40" />

        <p className="font-serif italic text-base sm:text-lg text-foreground/32 max-w-md">
          From Land to Legacy
        </p>
      </motion.div>
    </section>
  );
}
