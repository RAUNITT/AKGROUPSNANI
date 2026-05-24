import { SiInstagram, SiFacebook } from "react-icons/si";
import { Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative bg-[#080808] border-t border-white/[0.05]">
      {/* Floating line decoration */}
      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
        {/* Top: large logo mark */}
        <div className="flex flex-col items-center mb-12 sm:mb-16">
          <img
            src="/ak-logo.png"
            alt="AK Group of Real Estate"
            className="h-14 sm:h-18 w-auto object-contain opacity-60 hover:opacity-90 transition-opacity duration-500"
          />
          <div className="mt-4 flex items-center gap-2">
            <span className="text-[10px] tracking-[0.48em] text-foreground/25 uppercase font-light">Group</span>
            <span className="text-foreground/10">·</span>
            <span className="text-[10px] tracking-[0.48em] text-foreground/25 uppercase font-light">of Real Estate</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-[9px] tracking-[0.18em] text-foreground/20 uppercase text-center order-last sm:order-none font-light">
            © {new Date().getFullYear()} AK Group of Real Estate. All Rights Reserved.
          </p>

          <div className="flex items-center gap-6">
            <a href="#" aria-label="Instagram" className="text-foreground/20 hover:text-foreground/55 transition-colors duration-300">
              <SiInstagram size={15} />
            </a>
            <a href="#" aria-label="Facebook" className="text-foreground/20 hover:text-foreground/55 transition-colors duration-300">
              <SiFacebook size={15} />
            </a>
            <a href="#" aria-label="LinkedIn" className="text-foreground/20 hover:text-foreground/55 transition-colors duration-300">
              <Linkedin size={15} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
