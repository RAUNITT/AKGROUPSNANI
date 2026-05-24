import { SiInstagram, SiFacebook } from "react-icons/si";
import { Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#080808] border-t border-white/[0.06] py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <span className="font-serif font-bold text-primary text-xl leading-none tracking-tight">AK</span>
            <div className="w-px h-5 bg-white/12" />
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] tracking-[0.35em] text-foreground/40 uppercase font-light leading-none">Group</span>
              <span className="text-[8px] tracking-[0.22em] text-foreground/22 uppercase font-light leading-none">of Real Estate</span>
            </div>
          </div>

          <p className="text-[9px] tracking-[0.18em] text-foreground/25 uppercase text-center order-last sm:order-none font-light">
            © {new Date().getFullYear()} AK Group of Real Estate. All Rights Reserved.
          </p>

          <div className="flex items-center gap-5">
            <a href="#" aria-label="Instagram" className="text-foreground/25 hover:text-foreground/55 transition-colors duration-300">
              <SiInstagram size={15} />
            </a>
            <a href="#" aria-label="Facebook" className="text-foreground/25 hover:text-foreground/55 transition-colors duration-300">
              <SiFacebook size={15} />
            </a>
            <a href="#" aria-label="LinkedIn" className="text-foreground/25 hover:text-foreground/55 transition-colors duration-300">
              <Linkedin size={15} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
