import { SiInstagram, SiFacebook } from "react-icons/si";
import { Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-primary/20 py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img src="/ak-logo.png" alt="AK Group" className="h-8 w-auto opacity-80" />
        </div>
        
        <p className="text-xs tracking-widest text-muted-foreground/60 uppercase text-center">
          © 2025 AK Group of Real Estate. All Rights Reserved.
        </p>

        <div className="flex items-center gap-6">
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
            <SiInstagram size={18} />
          </a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
            <SiFacebook size={18} />
          </a>
          <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
            <Linkedin size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
