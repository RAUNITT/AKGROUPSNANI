import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import prop1 from "@/assets/images/prop1.png";
import prop2 from "@/assets/images/prop2.png";
import prop3 from "@/assets/images/prop3.png";

const cities = [
  {
    id: "chennai",
    name: "Chennai",
    x: "75%",
    y: "20%",
    property: { title: "The Prestige Towers", image: prop1, price: "₹8.5 Cr" }
  },
  {
    id: "coimbatore",
    name: "Coimbatore",
    x: "30%",
    y: "50%",
    property: { title: "Skyline Residences", image: prop2, price: "₹4.2 Cr" }
  },
  {
    id: "trichy",
    name: "Trichy",
    x: "55%",
    y: "45%",
    property: { title: "The Summit", image: prop3, price: "₹1.8 Cr" }
  },
  {
    id: "madurai",
    name: "Madurai",
    x: "45%",
    y: "70%",
    property: { title: "Heritage Villas", image: prop3, price: "₹3.8 Cr" }
  }
];

export function MapSection() {
  const [activeCity, setActiveCity] = useState(cities[0]);

  return (
    <section id="map" className="py-24 bg-[#0a0a0a] relative overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_10%,transparent_100%)]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 text-center md:text-left"
        >
          <h2 className="text-3xl md:text-4xl font-serif tracking-widest font-bold text-foreground inline-block relative">
            OUR PRESENCE ACROSS TAMIL NADU
            <div className="absolute -bottom-4 left-0 md:left-0 w-1/2 h-[1px] bg-primary/80 shadow-[0_0_10px_rgba(255,140,0,0.5)]" />
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-square max-w-md mx-auto w-full border border-white/10 bg-white/5 rounded-3xl p-8 shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-sm">
            {/* SVG Map Outline (Simplified conceptual shape for TN) */}
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(255,140,0,0.2)] opacity-30">
              <path d="M70,10 L80,20 L75,35 L60,40 L50,60 L40,80 L20,70 L25,50 L35,45 L40,30 L55,15 Z" fill="none" stroke="#ff8c00" strokeWidth="0.5" />
            </svg>
            
            {cities.map((city) => (
              <div
                key={city.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                style={{ left: city.x, top: city.y }}
                onClick={() => setActiveCity(city)}
              >
                <div className={`w-3 h-3 rounded-full transition-all duration-300 ${activeCity.id === city.id ? 'bg-primary scale-150 shadow-[0_0_20px_rgba(255,140,0,0.8)]' : 'bg-primary/50 hover:bg-primary/80 group-hover:scale-125 group-hover:shadow-[0_0_10px_rgba(255,140,0,0.5)]'}`} />
                <span className={`absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap text-sm tracking-wider transition-all duration-300 ${activeCity.id === city.id ? 'text-primary font-bold opacity-100' : 'text-muted-foreground opacity-70 group-hover:opacity-100'}`}>
                  {city.name}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col justify-center h-full min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCity.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="w-full"
              >
                <p className="text-primary tracking-widest text-sm mb-4 font-semibold">SELECTED REGION: {activeCity.name.toUpperCase()}</p>
                <Card className="bg-white/5 border-white/10 backdrop-blur-md rounded-none overflow-hidden">
                  <div className="relative aspect-video">
                    <img src={activeCity.property.image} alt={activeCity.property.title} className="object-cover w-full h-full opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
                  </div>
                  <CardContent className="p-6 relative z-10 -mt-16">
                    <h3 className="text-2xl font-serif tracking-wide text-white mb-2 drop-shadow-md">
                      {activeCity.property.title}
                    </h3>
                    <p className="text-primary font-medium tracking-wider">
                      Starting from {activeCity.property.price}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
