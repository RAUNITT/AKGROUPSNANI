import { motion } from "framer-motion";
import { ParticleCanvas } from "./ParticleCanvas";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* Background & Particles */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] to-[#111111] z-0" />
      <ParticleCanvas />
      
      {/* Radial Glow at bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80vw] h-[40vh] bg-primary/20 blur-[120px] rounded-full pointer-events-none z-0" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <img 
            src="/ak-logo.png" 
            alt="AK Logo" 
            className="w-32 md:w-48 h-auto drop-shadow-[0_0_30px_rgba(255,140,0,0.5)]"
          />
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.08,
                delayChildren: 0.5
              }
            }
          }}
          className="mb-6 flex flex-wrap justify-center overflow-hidden"
        >
          {"AK GROUP OF REAL ESTATE".split(" ").map((word, wordIdx) => (
            <span key={wordIdx} className="flex mr-[0.3em]">
              {word.split("").map((char, charIdx) => (
                <motion.span
                  key={`${wordIdx}-${charIdx}`}
                  variants={{
                    hidden: { y: 100, opacity: 0 },
                    visible: { y: 0, opacity: 1, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }
                  }}
                  className="font-serif text-4xl md:text-6xl lg:text-8xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-primary to-amber-200 inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </span>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-lg md:text-xl font-light tracking-[0.3em] text-foreground/80 mb-12"
        >
          FROM LAND TO LEGACY
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row gap-6"
        >
          <Button 
            className="h-14 px-8 bg-gradient-to-r from-primary to-amber-500 hover:from-amber-500 hover:to-primary text-black font-semibold tracking-wider transition-all duration-500 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,140,0,0.4)] border-0"
          >
            Explore Properties
          </Button>
          <Button 
            variant="outline"
            className="h-14 px-8 border-primary/40 bg-white/5 backdrop-blur-md text-foreground hover:bg-primary/10 hover:border-primary font-medium tracking-wider transition-all duration-500 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,140,0,0.2)]"
          >
            Contact Us
          </Button>
        </motion.div>
      </div>

      {/* Subtle Skyline */}
      <div className="absolute bottom-0 w-full h-32 opacity-20 pointer-events-none mix-blend-screen bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxwYXRoIGQ9Ik0wLDYwaDIwdjIwaDMwdi00MGg0MHY2MGgyMHYtMzBoMzB2NTBoNTB2LThwaDQwdjlwaDB2MGwzMC0yMGw0MCw1MGwzMC0xMGwyMCwyMEgxMDBWNjB6IiBmaWxsPSIjZmY4YzAwIi8+PC9zdmc+')] bg-repeat-x bg-bottom" />
    </section>
  );
}
