import { motion } from "framer-motion";
import { ParticleCanvas } from "./ParticleCanvas";
import { Button } from "@/components/ui/button";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18, delayChildren: 0.4 },
  },
};

const wordVariants = {
  hidden: { y: 40, opacity: 0, filter: "blur(8px)" },
  visible: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

export function HeroSection() {
  const titleWords = ["AK", "GROUP", "OF", "REAL", "ESTATE"];

  return (
    <section
      id="home"
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a]"
    >
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-[#0a0a0a] to-[#0f0f0f] z-0" />

      {/* Particles */}
      <ParticleCanvas />

      {/* Ambient glow — bottom center */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70vw] h-[45vh] bg-primary/15 blur-[140px] rounded-full pointer-events-none z-0" />
      {/* Ambient glow — top right */}
      <div className="absolute top-0 right-0 w-[35vw] h-[35vh] bg-amber-700/10 blur-[100px] rounded-full pointer-events-none z-0" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-5 w-full max-w-5xl pt-24 pb-16">
        {/* Logo reveal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.75, filter: "blur(12px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 sm:mb-10"
        >
          <img
            src="/ak-logo.png"
            alt="AK Logo"
            className="w-24 sm:w-36 md:w-44 h-auto drop-shadow-[0_0_40px_rgba(255,140,0,0.55)]"
          />
        </motion.div>

        {/* Title — word-by-word, responsive sizes */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-wrap justify-center gap-x-3 gap-y-0 mb-5 sm:mb-6"
        >
          {titleWords.map((word) => (
            <motion.span
              key={word}
              variants={wordVariants}
              className="font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-primary to-amber-600
                         text-3xl sm:text-5xl md:text-7xl lg:text-8xl
                         tracking-wider sm:tracking-widest"
            >
              {word}
            </motion.span>
          ))}
        </motion.div>

        {/* Divider line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent mb-5 sm:mb-6"
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-xs sm:text-sm md:text-base font-light tracking-[0.35em] text-foreground/60 mb-10 sm:mb-12 uppercase"
        >
          From Land to Legacy
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.85, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Button
            asChild
            className="h-12 sm:h-14 px-8 sm:px-10 bg-gradient-to-r from-primary to-amber-500 hover:from-amber-400 hover:to-primary text-black font-semibold tracking-wider text-sm transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_0_28px_rgba(255,140,0,0.45)] border-0 rounded-none"
            data-testid="button-explore-properties"
          >
            <a href="#properties">Explore Properties</a>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-12 sm:h-14 px-8 sm:px-10 border-primary/40 bg-white/[0.04] backdrop-blur-sm text-foreground hover:bg-primary/10 hover:border-primary text-sm tracking-wider transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(255,140,0,0.2)] rounded-none"
            data-testid="button-contact-us"
          >
            <a href="#contact">Contact Us</a>
          </Button>
        </motion.div>
      </div>

      {/* Skyline silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 pointer-events-none z-[1] overflow-hidden">
        <svg
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          className="w-full h-full opacity-[0.07]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 100V60h30V40h20V20h15V40h10V30h25V60h20V45h15V60h30V35h10V25h10V35h10V60h25V50h20V60h30V40h15V55h20V40h25V60h20V50h15V60h40V30h10V10h10V30h10V60h30V45h20V60h35V40h15V55h20V60h50V35h15V20h15V35h15V60h40V50h20V60h35V45h15V60h20V40h25V60h30V50h15V60H1440V100H0Z"
            fill="#ff8c00"
          />
        </svg>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-[9px] tracking-[0.3em] text-foreground/30 uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-primary/60 to-transparent"
        />
      </motion.div>
    </section>
  );
}
