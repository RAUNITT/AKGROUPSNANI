import { motion } from "framer-motion";

export function LogoShowcase() {
  return (
    <section className="py-40 bg-[#0a0a0a] relative overflow-hidden flex flex-col items-center justify-center border-t border-white/5">
      {/* Fog / Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[40vw] h-[40vw] bg-primary/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute w-[20vw] h-[20vw] bg-amber-500/10 rounded-full blur-[60px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center"
      >
        <motion.img
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          src="/ak-logo.png"
          alt="AK Logo"
          className="w-48 md:w-64 h-auto drop-shadow-[0_0_40px_rgba(255,140,0,0.6)] mb-12"
        />
        <p className="text-xl md:text-3xl font-serif tracking-[0.4em] text-foreground/80">
          AK GROUP OF REAL ESTATE
        </p>
        <div className="mt-6 w-px h-16 bg-gradient-to-b from-primary/80 to-transparent" />
      </motion.div>
    </section>
  );
}
