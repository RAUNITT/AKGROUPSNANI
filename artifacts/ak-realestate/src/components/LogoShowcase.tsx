import { motion } from "framer-motion";

export function LogoShowcase() {
  return (
    <section className="py-20 sm:py-32 bg-[#080808] border-y border-white/[0.05] flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center gap-6 text-center px-6"
      >
        <span className="text-[9px] tracking-[0.52em] text-primary/55 uppercase font-light">
          Established · Tamil Nadu
        </span>

        <h2 className="font-serif font-semibold text-3xl sm:text-5xl md:text-6xl text-foreground/85 tracking-tight leading-tight max-w-2xl">
          AK Group of Real Estate
        </h2>

        <div className="w-10 h-px bg-primary/45" />

        <p className="font-serif italic text-base sm:text-lg text-foreground/38 max-w-md">
          From Land to Legacy
        </p>
      </motion.div>
    </section>
  );
}
