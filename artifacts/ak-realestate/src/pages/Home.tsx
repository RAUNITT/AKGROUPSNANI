import { NavBar } from "@/components/NavBar";
import { HeroSection } from "@/components/HeroSection";
import { PropertySection } from "@/components/PropertySection";
import { MapSection } from "@/components/MapSection";
import { AboutSection } from "@/components/AboutSection";
import { LogoShowcase } from "@/components/LogoShowcase";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-[100dvh] w-full bg-[#0a0a0a] text-foreground selection:bg-primary/30">
      <NavBar />
      <HeroSection />
      <PropertySection />
      <MapSection />
      <AboutSection />
      <LogoShowcase />
      <ContactSection />
      <Footer />
    </div>
  );
}
