import { NavBar } from "@/components/NavBar";
import { HeroSection } from "@/components/HeroSection";
import { PropertySection } from "@/components/PropertySection";
import { AboutSection } from "@/components/AboutSection";
import { LogoShowcase } from "@/components/LogoShowcase";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { WebGLBackground } from "@/components/WebGLBackground";
import { FloatingElements } from "@/components/FloatingElements";

export default function Home() {
  return (
    <div className="min-h-[100dvh] w-full text-foreground selection:bg-primary/30 relative">
      {/* WebGL shader background — fixed, covers entire page */}
      <WebGLBackground />

      {/* Floating parallax geometric elements */}
      <FloatingElements />

      {/* All content sits above the WebGL canvas */}
      <div className="relative z-10">
        <NavBar />
        <HeroSection />
        <PropertySection />
        <AboutSection />
        <LogoShowcase />
        <ContactSection />
        <Footer />
      </div>
    </div>
  );
}
