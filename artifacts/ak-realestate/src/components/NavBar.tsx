import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useRequestProperty } from "@/contexts/RequestPropertyContext";

const NAV_LINKS = [
  { label: "Properties", hash: "properties", isPage: true },
  { label: "Insights", hash: "insights", isPage: true },
  { label: "Tools", hash: "tools", isPage: true },
  { label: "About", hash: "#about", isPage: false },
  { label: "Contact", hash: "#contact", isPage: false },
];

export function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();
  const { openModal } = useRequestProperty();
  const isHome = location === "/" || location === "";
  const isAdmin = location.startsWith("/admin");

  const href = (hash: string) => (isHome ? hash : `/${hash}`);

  const handleNavClick = (hash: string, isPage: boolean) => {
    setMenuOpen(false);
    if (isPage) {
      window.location.href = `/${hash}`;
      return;
    }
    if (!isHome) {
      window.location.href = `/${hash}`;
    } else {
      document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (isAdmin) return null;

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 glass"
        style={{ borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <img
              src="/ak-logo.png"
              alt="AK Group"
              className="h-9 sm:h-11 w-auto object-contain drop-shadow-[0_0_12px_rgba(255,140,0,0.4)]"
            />
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-[10px] tracking-[0.25em] text-primary/80 font-medium uppercase">AK Group</span>
              <span className="text-[9px] tracking-[0.15em] text-foreground/50 uppercase">of Real Estate</span>
            </div>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            {NAV_LINKS.map(({ label, hash, isPage }) => (
              <button
                key={label}
                onClick={() => handleNavClick(hash, isPage)}
                className="text-[11px] font-medium tracking-[0.2em] text-foreground/70 hover:text-primary transition-colors duration-300 uppercase"
              >
                {label}
              </button>
            ))}
            <div className="flex items-center gap-3 border-l border-white/10 pl-6 lg:pl-8">
              <button
                onClick={() => openModal()}
                className="text-[11px] font-semibold tracking-[0.15em] px-5 py-2.5 glass-amber text-amber-300 hover:text-amber-200 hover:shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all duration-300 uppercase cursor-pointer"
              >
                Request Property
              </button>
              <button
                onClick={() => handleNavClick("#contact", false)}
                className="text-[11px] font-semibold tracking-[0.15em] px-5 py-2.5 glass text-foreground/80 hover:text-foreground hover:border-primary/40 transition-all duration-300 uppercase cursor-pointer"
              >
                Enquire
              </button>
            </div>
          </div>

          <button
            className="md:hidden text-foreground/80 hover:text-primary transition-colors p-1"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-[56px] left-0 right-0 z-40 border-b border-primary/15"
            style={{ backgroundColor: "rgba(8,8,8,0.96)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}
          >
            <div className="flex flex-col px-6 py-6 gap-6">
              {NAV_LINKS.map(({ label, hash, isPage }, i) => (
                <motion.button
                  key={label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                  className="text-sm tracking-[0.2em] text-foreground/80 hover:text-primary transition-colors uppercase text-left"
                  onClick={() => handleNavClick(hash, isPage)}
                >
                  {label}
                </motion.button>
              ))}
              <div className="flex flex-col gap-3 mt-4">
                <motion.button
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: NAV_LINKS.length * 0.06, duration: 0.3 }}
                  className="text-sm tracking-[0.15em] font-semibold px-5 py-3 bg-gradient-to-r from-primary to-amber-500 text-black text-center uppercase"
                  onClick={() => { setMenuOpen(false); openModal(); }}
                >
                  Request Property
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (NAV_LINKS.length + 1) * 0.06, duration: 0.3 }}
                  className="text-sm tracking-[0.15em] font-semibold px-5 py-3 border border-primary/50 text-primary text-center uppercase"
                  onClick={() => handleNavClick("#contact", false)}
                >
                  Enquire Now
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
