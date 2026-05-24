import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const PAGE_LINKS = [
  { label: "Properties", href: "/properties" },
  { label: "Insights", href: "/insights" },
];
const HASH_LINKS = [
  { label: "About", hash: "#about" },
  { label: "Contact", hash: "#contact" },
];

export function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  const isHome = location === "/" || location === "";
  const isAdmin = location.startsWith("/admin");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleHash = (hash: string) => {
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
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className={[
          "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 sm:px-8 md:px-10 h-[61px] transition-all duration-500",
          scrolled
            ? "bg-[#070707]/95 backdrop-blur-md border-b border-primary/25 shadow-[0_1px_40px_rgba(255,140,0,0.09)]"
            : "bg-[#0a0a0a]/75 backdrop-blur-sm border-b border-white/[0.06]",
        ].join(" ")}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group" onClick={() => setMenuOpen(false)}>
          <img
            src="/ak-logo.png"
            alt="AK Group of Real Estate"
            className="h-10 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.04]"
          />
          <div className="hidden sm:flex flex-col leading-none gap-[3px] pl-0.5">
            <span className="text-[9px] tracking-[0.36em] text-foreground/55 uppercase font-light">Group</span>
            <span className="text-[7.5px] tracking-[0.26em] text-foreground/28 uppercase font-light">of Real Estate</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {PAGE_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={[
                "text-[10px] tracking-[0.28em] uppercase font-light transition-colors duration-200",
                location.startsWith(link.href)
                  ? "text-primary"
                  : "text-foreground/48 hover:text-foreground/85",
              ].join(" ")}
            >
              {link.label}
            </Link>
          ))}
          {HASH_LINKS.map((link) => (
            <button
              key={link.hash}
              onClick={() => handleHash(link.hash)}
              className="text-[10px] tracking-[0.28em] uppercase font-light text-foreground/48 hover:text-foreground/85 transition-colors duration-200"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => handleHash("#contact")}
            className="ml-1 px-5 py-2 border border-primary/50 text-primary text-[9px] tracking-[0.3em] uppercase font-light hover:bg-primary hover:text-black transition-all duration-300"
          >
            Enquire
          </button>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden text-foreground/60 hover:text-foreground transition-colors p-1"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-40 bg-[#060606]/98 backdrop-blur-xl flex flex-col items-center justify-center gap-9 md:hidden"
          >
            <img src="/ak-logo.png" alt="AK Group" className="h-16 w-auto object-contain mb-2 opacity-80" />
            {PAGE_LINKS.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.3 }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={[
                    "text-base tracking-[0.32em] uppercase font-light transition-colors",
                    location.startsWith(link.href) ? "text-primary" : "text-foreground/65 hover:text-foreground",
                  ].join(" ")}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            {HASH_LINKS.map((link, i) => (
              <motion.button
                key={link.hash}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (i + PAGE_LINKS.length) * 0.06, duration: 0.3 }}
                onClick={() => handleHash(link.hash)}
                className="text-base tracking-[0.32em] uppercase font-light text-foreground/65 hover:text-foreground transition-colors"
              >
                {link.label}
              </motion.button>
            ))}
            <div className="w-8 h-px bg-primary/30" />
            <button
              onClick={() => handleHash("#contact")}
              className="px-9 py-3 border border-primary/50 text-primary text-[10px] tracking-[0.35em] uppercase hover:bg-primary hover:text-black transition-all"
            >
              Enquire Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
