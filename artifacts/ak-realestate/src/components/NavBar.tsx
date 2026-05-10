import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const NAV_LINKS = ["Properties", "About", "Contact"];

export function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-primary/15"
        style={{
          backgroundColor: "rgba(10, 10, 10, 0.75)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <img
              src="/ak-logo.png"
              alt="AK Group"
              className="h-9 sm:h-11 w-auto object-contain drop-shadow-[0_0_12px_rgba(255,140,0,0.4)]"
            />
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-[10px] tracking-[0.25em] text-primary/80 font-medium uppercase">
                AK Group
              </span>
              <span className="text-[9px] tracking-[0.15em] text-foreground/50 uppercase">
                of Real Estate
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-[11px] font-medium tracking-[0.2em] text-foreground/70 hover:text-primary transition-colors duration-300 uppercase"
              >
                {item}
              </a>
            ))}
            <a
              href="#contact"
              className="text-[11px] font-semibold tracking-[0.15em] px-5 py-2 border border-primary/50 text-primary hover:bg-primary hover:text-black transition-all duration-300 uppercase"
            >
              Enquire
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-foreground/80 hover:text-primary transition-colors p-1"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            data-testid="button-mobile-menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-[56px] left-0 right-0 z-40 border-b border-primary/15"
            style={{
              backgroundColor: "rgba(8, 8, 8, 0.95)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
            }}
          >
            <div className="flex flex-col px-6 py-6 gap-6">
              {NAV_LINKS.map((item, i) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                  className="text-sm tracking-[0.2em] text-foreground/80 hover:text-primary transition-colors uppercase"
                  onClick={() => setMenuOpen(false)}
                >
                  {item}
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.06, duration: 0.3 }}
                className="text-sm tracking-[0.15em] font-semibold px-5 py-3 border border-primary/50 text-primary text-center uppercase"
                onClick={() => setMenuOpen(false)}
              >
                Enquire Now
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
