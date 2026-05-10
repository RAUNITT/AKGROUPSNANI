import { Link } from "wouter";
import { motion, useScroll, useTransform } from "framer-motion";

export function NavBar() {
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 100], [0, 0.8]);
  const blur = useTransform(scrollY, [0, 100], [0, 8]);

  return (
    <motion.nav
      style={{
        backgroundColor: `rgba(13, 13, 13, ${bgOpacity})`,
        backdropFilter: `blur(${blur}px)`,
      }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 border-b border-primary/20 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <img src="/ak-logo.png" alt="AK Group" className="h-12 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,140,0,0.3)]" />
        </Link>
        <div className="hidden md:flex items-center space-x-12">
          {["Properties", "Map", "About", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium tracking-widest text-foreground/80 hover:text-primary transition-colors duration-300"
            >
              {item.toUpperCase()}
            </a>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
