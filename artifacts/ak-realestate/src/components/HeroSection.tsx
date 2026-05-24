import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();

  // Scroll-driven parallax + motion blur + fade
  const y = useTransform(scrollY, [0, 700], [0, -120]);
  const opacity = useTransform(scrollY, [0, 450], [1, 0]);
  const blurPx = useTransform(scrollY, [0, 500], [0, 8]);
  const filter = useTransform(blurPx, (v) => `blur(${v.toFixed(2)}px)`);
  const scale = useTransform(scrollY, [0, 600], [1, 0.95]);

  // Subtle logo rotation on scroll
  const logoRotate = useTransform(scrollY, [0, 600], [0, 5]);
  const logoScale = useTransform(scrollY, [0, 600], [1, 0.85]);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative w-full min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Warm bottom vignette for depth */}
      <div className="absolute bottom-0 left-0 right-0 h-60 bg-gradient-to-t from-[#060606]/90 via-transparent to-transparent pointer-events-none z-[2]" />

      {/* Scroll-driven content */}
      <motion.div
        style={{ y, opacity, filter, scale }}
        className="relative z-10 flex flex-col items-center text-center px-5 w-full max-w-5xl pt-24 pb-16"
      >
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="text-[9px] sm:text-[10px] tracking-[0.52em] text-primary/60 uppercase mb-10 sm:mb-12 font-light"
        >
          Tamil Nadu&apos;s Premier Luxury Developer
        </motion.p>

        {/* Logo mark above heading — floats and rotates subtly on scroll */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.28, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          style={{ rotate: logoRotate, scale: logoScale }}
          className="mb-8 sm:mb-10"
        >
          <img
            src="/ak-logo.png"
            alt="AK Group"
            className="h-20 sm:h-28 md:h-36 w-auto object-contain drop-shadow-[0_0_60px_rgba(255,140,0,0.15)]"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.42, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="font-serif font-bold text-foreground tracking-tight leading-[0.85] mb-3"
          style={{ fontSize: "clamp(52px, 12vw, 128px)" }}
        >
          AK GROUP
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.62, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="text-[10px] sm:text-sm tracking-[0.55em] text-foreground/28 uppercase font-light mb-10"
        >
          of Real Estate
        </motion.p>

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.82, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="w-16 h-px bg-primary/50 mb-9 origin-center"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.05, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="font-serif italic text-base sm:text-lg text-foreground/32 mb-12 sm:mb-14"
        >
          From Land to Legacy
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.35, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
        >
          <a
            href="/properties"
            className="h-12 sm:h-13 px-10 bg-primary text-black font-medium tracking-[0.2em] text-[11px] uppercase flex items-center justify-center transition-colors duration-300 hover:bg-amber-400"
          >
            Explore Properties
          </a>
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }); }}
            className="h-12 sm:h-13 px-10 border border-white/15 text-foreground/55 hover:text-foreground/90 hover:border-white/30 font-light tracking-[0.2em] text-[11px] uppercase flex items-center justify-center transition-all duration-300"
          >
            Contact Us
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 1 }}
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[5]"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          className="w-px h-10 bg-gradient-to-b from-primary/50 to-transparent mx-auto"
        />
      </motion.div>
    </section>
  );
}
