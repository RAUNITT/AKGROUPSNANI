import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "wouter";
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
  const { scrollY } = useScroll();

  const logoY = useTransform(scrollY, [0, 500], [0, -80]);
  const titleY = useTransform(scrollY, [0, 500], [0, -120]);
  const subtitleY = useTransform(scrollY, [0, 500], [0, -140]);
  const opacityFade = useTransform(scrollY, [0, 400], [1, 0]);
  const skylineY = useTransform(scrollY, [0, 500], [0, 40]);

  return (
    <section
      id="home"
      className="relative w-full min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden z-[1]"
    >
      {/* Base gradient removed so global canvas shows through */}

      {/* Ambient glow — bottom center */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70vw] h-[45vh] bg-primary/15 blur-[140px] rounded-full pointer-events-none z-0" style={{ animation: "pulse-glow 4s infinite ease-in-out" }} />
      {/* Ambient glow — top right */}
      <div className="absolute top-0 right-0 w-[35vw] h-[35vh] bg-amber-700/10 blur-[100px] rounded-full pointer-events-none z-0" style={{ animation: "pulse-glow 6s infinite ease-in-out reverse" }} />

      {/* Content */}
      <motion.div style={{ opacity: opacityFade }} className="relative z-10 flex flex-col items-center text-center px-5 w-full max-w-5xl pt-20 sm:pt-24 pb-12 sm:pb-16">
        {/* Logo reveal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.75, filter: "blur(12px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ y: logoY }}
          className="mb-4 sm:mb-10"
        >
          <img
            src="/ak-logo.png"
            alt="AK Logo"
            className="w-12 sm:w-36 md:w-44 h-auto drop-shadow-[0_0_40px_rgba(255,140,0,0.55)]"
          />
        </motion.div>

        {/* Title — word-by-word, responsive sizes */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          style={{ y: titleY }}
          className="flex flex-wrap justify-center gap-x-1 sm:gap-x-3 gap-y-0 mb-3 sm:mb-6"
        >
          {titleWords.map((word) => (
            <motion.span
              key={word}
              variants={wordVariants}
              className="font-serif font-bold text-amber-300
                         text-[1.35rem] sm:text-5xl md:text-7xl lg:text-8xl
                         tracking-wider sm:tracking-widest
                         drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]"
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
          style={{ y: titleY }}
          className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent via-primary to-transparent mb-3 sm:mb-6"
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ y: subtitleY }}
          className="text-[9px] sm:text-sm md:text-base font-light tracking-[0.35em] text-amber-200/70 mb-6 sm:mb-12 uppercase"
        >
          From Land to Legacy
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.85, ease: [0.22, 1, 0.36, 1] }}
          style={{ y: subtitleY }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto flex-wrap justify-center px-4 sm:px-0"
        >
          <Button
            asChild
            className="h-12 sm:h-14 px-8 sm:px-10 glass-amber text-amber-300 font-semibold tracking-wider text-sm transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_0_32px_rgba(245,158,11,0.45)] hover:text-amber-200 rounded-sm border-0"
            data-testid="button-explore-properties"
          >
            <a href="#properties">Explore Properties</a>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-12 sm:h-14 px-8 sm:px-10 glass text-foreground/80 hover:text-foreground font-medium tracking-wider text-sm transition-all duration-500 hover:scale-[1.03] rounded-sm"
            data-testid="button-contact-us"
          >
            <a href="#contact">Contact Us</a>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-12 sm:h-14 px-8 sm:px-10 glass-amber text-amber-400 font-medium tracking-wider text-sm transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(245,158,11,0.25)] rounded-sm border-0"
            data-testid="button-explore-tools"
          >
            <Link href="/tools">Explore Tools</Link>
          </Button>
        </motion.div>
      </motion.div>

      {/* Skyline silhouette */}
      <motion.div style={{ y: skylineY }} className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 pointer-events-none z-[1] overflow-hidden">
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
      </motion.div>

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
