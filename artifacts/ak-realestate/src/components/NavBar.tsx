import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Properties", hash: "#properties" },
  { label: "About", hash: "#about" },
  { label: "Contact", hash: "#contact" },
];

function AKWordmark({ size = "md" }: { size?: "sm" | "md" }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="font-serif font-bold text-primary leading-none tracking-tight"
        style={{ fontSize: size === "sm" ? 22 : 28 }}
      >
        AK
      </span>
      <div className="w-px h-6 bg-white/15" />
      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] tracking-[0.35em] text-foreground/65 uppercase font-light leading-none">
          Group
        </span>
        <span className="text-[8px] tracking-[0.25em] text-foreground/35 uppercase font-light leading-none">
          of Real Estate
        </span>
      </div>
    </div>
  );
}

export function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();
  const isHome = location === "/" || location === "";
  const isAdmin = location.startsWith("/admin");

  const handleNavClick = (hash: string) => {
    setMenuOpen(false);
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
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.07]"
        style={{
          backgroundColor: "rgba(10, 10, 10, 0.88)",
          backdropFilter: "blur(24px) saturate(160%)",
          WebkitBackdropFilter: "blur(24px) saturate(160%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
          <Link href="/">
            <AKWordmark />
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map(({ label, hash }) => (
              <button
                key={label}
                onClick={() => handleNavClick(hash)}
                className="text-[11px] font-normal tracking-[0.22em] text-foreground/55 hover:text-foreground/90 transition-colors duration-300 uppercase"
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => handleNavClick("#contact")}
              className="text-[11px] font-medium tracking-[0.18em] px-6 py-2.5 border border-primary/50 text-primary hover:bg-primary hover:text-black transition-all duration-300 uppercase"
            >
              Enquire
            </button>
          </div>

          <button
            className="md:hidden text-foreground/60 hover:text-foreground/90 transition-colors p-1"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-[61px] left-0 right-0 z-40 border-b border-white/[0.07]"
            style={{ backgroundColor: "rgba(8,8,8,0.97)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}
          >
            <div className="flex flex-col px-6 py-7 gap-6">
              {NAV_LINKS.map(({ label, hash }, i) => (
                <motion.button
                  key={label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.25 }}
                  className="text-sm tracking-[0.22em] text-foreground/65 hover:text-foreground/90 transition-colors uppercase text-left font-light"
                  onClick={() => handleNavClick(hash)}
                >
                  {label}
                </motion.button>
              ))}
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.05, duration: 0.25 }}
                className="text-sm tracking-[0.18em] font-medium px-5 py-3 border border-primary/50 text-primary text-center uppercase"
                onClick={() => handleNavClick("#contact")}
              >
                Enquire Now
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
