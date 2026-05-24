import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

function FloatingLine({
  className,
  scrollRange,
  yRange,
  opacityRange,
}: {
  className: string;
  scrollRange: [number, number];
  yRange: [number, number];
  opacityRange: [number, number];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, scrollRange, yRange);
  const opacity = useTransform(scrollYProgress, scrollRange, opacityRange);

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity }}
      className={className}
    />
  );
}

function FloatingCircle({
  className,
  scrollRange,
  yRange,
  scaleRange,
}: {
  className: string;
  scrollRange: [number, number];
  yRange: [number, number];
  scaleRange: [number, number];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, scrollRange, yRange);
  const scale = useTransform(scrollYProgress, scrollRange, scaleRange);

  return (
    <motion.div
      ref={ref}
      style={{ y, scale }}
      className={className}
    />
  );
}

export function FloatingElements() {
  return (
    <>
      {/* Hero area floating ring */}
      <FloatingCircle
        className="fixed top-[15vh] right-[8vw] w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full border border-primary/[0.08] pointer-events-none z-[1]"
        scrollRange={[0, 0.3]}
        yRange={[-40, 80]}
        scaleRange={[0.85, 1.15]}
      />
      <FloatingCircle
        className="fixed top-[25vh] right-[12vw] w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full border border-white/[0.04] pointer-events-none z-[1]"
        scrollRange={[0, 0.35]}
        yRange={[-20, 60]}
        scaleRange={[0.9, 1.1]}
      />

      {/* Left side vertical line */}
      <FloatingLine
        className="fixed top-[40vh] left-[5vw] w-px h-24 sm:h-32 bg-gradient-to-b from-transparent via-primary/20 to-transparent pointer-events-none z-[1]"
        scrollRange={[0, 0.4]}
        yRange={[-60, 120]}
        opacityRange={[0, 0.6]}
      />

      {/* Property section floating element */}
      <FloatingCircle
        className="fixed top-[70vh] left-[3vw] w-16 h-16 sm:w-24 sm:h-24 rounded-full border border-primary/[0.06] pointer-events-none z-[1]"
        scrollRange={[0.2, 0.6]}
        yRange={[-30, 100]}
        scaleRange={[0.8, 1.2]}
      />

      {/* About section diagonal line */}
      <FloatingLine
        className="fixed top-[110vh] right-[7vw] w-px h-20 sm:h-28 bg-gradient-to-b from-transparent via-white/10 to-transparent pointer-events-none z-[1] rotate-12"
        scrollRange={[0.4, 0.8]}
        yRange={[-40, 80]}
        opacityRange={[0, 0.4]}
      />

      {/* Logo showcase area large ring */}
      <FloatingCircle
        className="fixed top-[140vh] left-[50%] -translate-x-1/2 w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72 rounded-full border border-primary/[0.05] pointer-events-none z-[1]"
        scrollRange={[0.5, 0.9]}
        yRange={[-50, 100]}
        scaleRange={[0.7, 1.1]}
      />

      {/* Contact section small accents */}
      <FloatingLine
        className="fixed top-[180vh] right-[10vw] w-px h-16 bg-gradient-to-b from-transparent via-primary/15 to-transparent pointer-events-none z-[1]"
        scrollRange={[0.7, 1]}
        yRange={[-20, 60]}
        opacityRange={[0, 0.5]}
      />

      {/* Bottom-right accent circle */}
      <FloatingCircle
        className="fixed top-[200vh] right-[5vw] w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-white/[0.05] pointer-events-none z-[1]"
        scrollRange={[0.8, 1]}
        yRange={[-10, 40]}
        scaleRange={[0.9, 1.05]}
      />
    </>
  );
}
