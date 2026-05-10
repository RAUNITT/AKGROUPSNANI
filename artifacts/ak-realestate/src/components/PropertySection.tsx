import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import prop1 from "@/assets/images/prop1.png";
import prop2 from "@/assets/images/prop2.png";
import prop3 from "@/assets/images/prop3.png";
import prop4 from "@/assets/images/prop4.png";
import prop5 from "@/assets/images/prop5.png";
import prop6 from "@/assets/images/prop6.png";

const properties = [
  {
    id: 1,
    title: "The Prestige Towers",
    location: "Chennai",
    price: "₹8.5 Cr",
    sqft: "4500",
    status: "AVAILABLE",
    statusColor: "text-green-400 border-green-400/50 shadow-[0_0_10px_rgba(74,222,128,0.2)]",
    image: prop1
  },
  {
    id: 2,
    title: "Skyline Residences",
    location: "Coimbatore",
    price: "₹4.2 Cr",
    sqft: "3200",
    status: "LAUNCHING SOON",
    statusColor: "text-primary border-primary/50 shadow-[0_0_10px_rgba(255,140,0,0.2)]",
    image: prop2
  },
  {
    id: 3,
    title: "Heritage Villas",
    location: "Madurai",
    price: "₹3.8 Cr",
    sqft: "4000",
    status: "AVAILABLE",
    statusColor: "text-green-400 border-green-400/50 shadow-[0_0_10px_rgba(74,222,128,0.2)]",
    image: prop3
  },
  {
    id: 4,
    title: "Oceanfront Estates",
    location: "Pondicherry",
    price: "₹6.5 Cr",
    sqft: "3800",
    status: "SOLD OUT",
    statusColor: "text-muted-foreground border-muted-foreground/50",
    image: prop6
  },
  {
    id: 5,
    title: "The Summit",
    location: "Trichy",
    price: "₹1.8 Cr",
    sqft: "1800",
    status: "LAUNCHING SOON",
    statusColor: "text-primary border-primary/50 shadow-[0_0_10px_rgba(255,140,0,0.2)]",
    image: prop4
  },
  {
    id: 6,
    title: "Highland Retreat",
    location: "Ooty",
    price: "₹5.2 Cr",
    sqft: "2800",
    status: "AVAILABLE",
    statusColor: "text-green-400 border-green-400/50 shadow-[0_0_10px_rgba(74,222,128,0.2)]",
    image: prop5
  }
];

export function PropertySection() {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" });

  return (
    <section id="properties" className="py-24 bg-[#0a0a0a] border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block relative"
        >
          <h2 className="text-3xl md:text-5xl font-serif tracking-widest font-bold text-foreground">
            SIGNATURE PROPERTIES
          </h2>
          <div className="absolute -bottom-4 left-0 w-full h-[1px] bg-gradient-to-r from-primary/80 to-transparent shadow-[0_0_10px_rgba(255,140,0,0.5)]" />
        </motion.div>
      </div>

      <div className="max-w-[90rem] mx-auto px-6 cursor-grab active:cursor-grabbing">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-4">
            {properties.map((prop, idx) => (
              <motion.div
                key={prop.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="flex-none pl-4 w-full sm:w-1/2 lg:w-1/3"
              >
                <Card className="group relative overflow-hidden bg-white/5 border-white/10 backdrop-blur-md rounded-none transition-all duration-500 hover:-translate-y-2 hover:border-primary/50 hover:shadow-[0_10px_30px_rgba(255,140,0,0.15)]">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img 
                      src={prop.image} 
                      alt={prop.title} 
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                    <div className="absolute top-4 right-4">
                      <Badge variant="outline" className={`bg-black/50 backdrop-blur-sm ${prop.statusColor}`}>
                        {prop.status}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-serif tracking-wide mb-2 text-foreground/90 group-hover:text-primary transition-colors">
                      {prop.title}
                    </h3>
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <p className="text-sm tracking-widest text-muted-foreground uppercase">
                          {prop.location}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {prop.sqft} SQFT
                        </p>
                      </div>
                      <p className="text-lg font-medium text-foreground">
                        {prop.price}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
