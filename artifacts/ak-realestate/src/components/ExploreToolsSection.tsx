import { motion } from "framer-motion";
import { Link } from "wouter";
import { Calculator, Maximize, Search, LineChart, ArrowRight } from "lucide-react";
import { useRequestProperty } from "@/contexts/RequestPropertyContext";

export function ExploreToolsSection() {
  const { openModal } = useRequestProperty();

  const tools = [
    {
      icon: Calculator,
      title: "ROI Calculator",
      desc: "Calculate real-time returns on any property",
      link: "/tools",
      isModal: false,
    },
    {
      icon: Maximize,
      title: "Size Converter",
      desc: "Convert between sq.ft, sq.m, grounds, cents, acres",
      link: "/tools",
      isModal: false,
    },
    {
      icon: Search,
      title: "Property Match",
      desc: "Tell us what you need, we find it",
      link: "#",
      isModal: true,
    },
    {
      icon: LineChart,
      title: "Market Insights",
      desc: "News and analysis from our experts",
      link: "/insights",
      isModal: false,
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#0a0a0a] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12 sm:mb-16"
        >
          <p className="text-[10px] sm:text-xs tracking-[0.3em] text-primary/70 uppercase mb-3">Investor Utilities</p>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-display tracking-wide text-foreground">Explore Real Estate Tools</h2>
          <div className="mx-auto mt-4 w-12 h-px bg-gradient-to-r from-transparent via-primary/80 to-transparent" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {tools.map((tool, idx) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {tool.isModal ? (
                <button
                  onClick={(e) => { e.preventDefault(); openModal(); }}
                  className="w-full text-left group glass p-8 h-full hover:-translate-y-2 hover:shadow-[0_8px_32px_rgba(245,158,11,0.15)] transition-all duration-500"
                  data-testid={`tool-card-${tool.title.toLowerCase().replace(/ /g, "-")}`}
                >
                  <tool.icon className="w-10 h-10 text-primary mb-6 group-hover:scale-110 transition-transform duration-500" />
                  <h3 className="font-serif text-xl tracking-wider text-foreground mb-3">{tool.title}</h3>
                  <p className="text-sm text-muted-foreground/70 leading-relaxed mb-6">{tool.desc}</p>
                  <span className="inline-flex items-center text-xs tracking-widest text-primary/70 group-hover:text-primary uppercase">
                    Use Tool <ArrowRight size={12} className="ml-2" />
                  </span>
                </button>
              ) : (
                <Link
                  href={tool.link}
                  className="block group glass p-8 h-full hover:-translate-y-2 hover:shadow-[0_8px_32px_rgba(245,158,11,0.15)] transition-all duration-500"
                  data-testid={`tool-card-${tool.title.toLowerCase().replace(/ /g, "-")}`}
                >
                  <tool.icon className="w-10 h-10 text-primary mb-6 group-hover:scale-110 transition-transform duration-500" />
                  <h3 className="font-serif text-xl tracking-wider text-foreground mb-3">{tool.title}</h3>
                  <p className="text-sm text-muted-foreground/70 leading-relaxed mb-6">{tool.desc}</p>
                  <span className="inline-flex items-center text-xs tracking-widest text-primary/70 group-hover:text-primary uppercase">
                    Use Tool <ArrowRight size={12} className="ml-2" />
                  </span>
                </Link>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center"
        >
          <Link
            href="/tools"
            className="inline-flex items-center gap-3 h-14 px-10 border-2 border-primary text-primary hover:bg-primary hover:text-black font-bold tracking-[0.15em] text-sm uppercase transition-all duration-300"
            data-testid="button-all-tools"
          >
            EXPLORE ALL TOOLS <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
