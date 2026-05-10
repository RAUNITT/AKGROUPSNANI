import { NavBar } from "@/components/NavBar";
import { HeroSection } from "@/components/HeroSection";
import { PropertySection } from "@/components/PropertySection";
import { AboutSection } from "@/components/AboutSection";
import { LogoShowcase } from "@/components/LogoShowcase";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { SectionDivider } from "@/components/SectionDivider";

export default function Home() {
  return (
    <div className="min-h-[100dvh] w-full bg-[#0a0a0a] text-foreground selection:bg-primary/30">
      <NavBar />
      <HeroSection />
      <SectionDivider accentLine />
      <PropertySection />
      <SectionDivider />
      <AboutSection />
      <SectionDivider accentLine />
      <LogoShowcase />
      <SectionDivider />
      <ContactSection />
      <Footer />
    </div>
  );
}
