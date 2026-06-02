import { NavBar } from "@/components/NavBar";
import { HeroSection } from "@/components/HeroSection";
import { PropertySection } from "@/components/PropertySection";
import { ExploreToolsSection } from "@/components/ExploreToolsSection";
import { InsightsTeaser } from "@/components/InsightsTeaser";
import { AboutSection } from "@/components/AboutSection";
import { LogoShowcase } from "@/components/LogoShowcase";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { SectionDivider } from "@/components/SectionDivider";

export default function Home() {
  return (
    <div className="page-content bg-transparent text-foreground selection:bg-primary/30">
      <NavBar />
      <HeroSection />
      <SectionDivider accentLine />
      <PropertySection />
      <SectionDivider />
      <ExploreToolsSection />
      <SectionDivider accentLine />
      <AboutSection />
      <SectionDivider />
      <InsightsTeaser />
      <SectionDivider accentLine />
      <LogoShowcase />
      <SectionDivider />
      <ContactSection />
      <Footer />
    </div>
  );
}
