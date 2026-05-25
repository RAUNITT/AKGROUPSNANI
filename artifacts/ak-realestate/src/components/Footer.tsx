import { SiInstagram, SiFacebook } from "react-icons/si";
import { Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-primary/15 py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6">
          {/* Logo + name */}
          <div className="flex items-center gap-3">
            <img
              src="/ak-logo.png"
              alt="AK Group"
              className="h-7 sm:h-8 w-auto opacity-75"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-[9px] sm:text-[10px] tracking-[0.2em] text-primary/60 uppercase">
                AK Group
              </span>
              <span className="text-[8px] sm:text-[9px] tracking-[0.12em] text-foreground/30 uppercase">
                of Real Estate
              </span>
            </div>
          </div>

          <p className="text-[9px] sm:text-[10px] tracking-[0.15em] text-muted-foreground/40 uppercase text-center order-last sm:order-none">
            © 2025 AK Group of Real Estate. All Rights Reserved.
          </p>

          {/* Social */}
          <div className="flex items-center gap-5">
            <a
              href="#"
              aria-label="Instagram"
              className="text-muted-foreground/40 hover:text-primary transition-colors duration-300"
            >
              <SiInstagram size={16} />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="text-muted-foreground/40 hover:text-primary transition-colors duration-300"
            >
              <SiFacebook size={16} />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="text-muted-foreground/40 hover:text-primary transition-colors duration-300"
            >
              <Linkedin size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
