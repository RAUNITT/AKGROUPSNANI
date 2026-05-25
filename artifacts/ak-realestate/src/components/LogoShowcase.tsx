import { motion } from "framer-motion";

export function LogoShowcase() {
  return (
    <section className="py-24 sm:py-36 bg-[#0a0a0a] relative overflow-hidden flex flex-col items-center justify-center">
      {/* Multi-layer fog/glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[60vw] sm:w-[40vw] h-[60vw] sm:h-[40vw] bg-primary/8 rounded-full blur-[120px]"
          style={{ animation: "pulse 5s ease-in-out infinite" }}
        />
        <div className="absolute w-[35vw] sm:w-[22vw] h-[35vw] sm:h-[22vw] bg-amber-600/10 rounded-full blur-[80px]" />
        <div className="absolute w-[20vw] sm:w-[12vw] h-[20vw] sm:h-[12vw] bg-primary/12 rounded-full blur-[40px]" />
      </div>

      {/* Horizontal accent lines */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-y-20 pointer-events-none" />
      <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent translate-y-20 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.75, filter: "blur(16px)" }}
        whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center gap-8 sm:gap-10"
      >
        {/* Breathing logo */}
        <motion.div
          animate={{ scale: [1, 1.04, 1], filter: ["drop-shadow(0 0 30px rgba(255,140,0,0.5))", "drop-shadow(0 0 55px rgba(255,140,0,0.7))", "drop-shadow(0 0 30px rgba(255,140,0,0.5))"] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        >
          <img
            src="/ak-logo.png"
            alt="AK Group Logo"
            className="w-28 sm:w-44 md:w-56 h-auto"
          />
        </motion.div>

        {/* Brand name */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-2"
        >
          <p className="text-sm sm:text-lg md:text-2xl font-serif tracking-[0.3em] sm:tracking-[0.4em] text-foreground/75 text-center px-4">
            AK GROUP OF REAL ESTATE
          </p>
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
          <p className="text-[9px] sm:text-[10px] tracking-[0.35em] text-foreground/30 uppercase">
            From Land to Legacy
          </p>
        </motion.div>

        {/* Vertical line drop */}
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-px h-12 sm:h-16 bg-gradient-to-b from-primary/60 to-transparent origin-top"
        />
      </motion.div>
    </section>
  );
}
