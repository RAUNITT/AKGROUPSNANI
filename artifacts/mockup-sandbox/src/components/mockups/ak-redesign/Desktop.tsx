import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MapPin, ArrowRight, Phone, Mail, MessageSquare, Instagram, Twitter, Linkedin, ChevronDown } from "lucide-react";

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
};

const STAGGER = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const PARTICLES = Array.from({ length: 36 }, (_, i) => ({
  left: ((i * 2.78 + 7) % 100) + "%",
  width: ((i % 3) + 1.5) + "px",
  height: ((i % 3) + 1.5) + "px",
  animationDuration: ((i % 10) + 12) + "s",
  animationDelay: "-" + ((i * 1.7) % 22) + "s",
  opacity: 0.12 + (i % 5) * 0.04,
}));

const PROPERTIES = [
  { name: "AK Grandeur Villas", loc: "ECR, Chennai", price: "₹12 Cr Onwards", status: "Ready to Move", hue: "135deg, #1a0a00 0%, #2a1200 50%, #0a0a0a 100%" },
  { name: "AK Sky Residences", loc: "OMR, Chennai", price: "₹4.5 Cr Onwards", status: "Under Construction", hue: "135deg, #0a0f1a 0%, #0f1a2a 50%, #0a0a0a 100%" },
  { name: "AK Skyline Towers", loc: "Coimbatore", price: "₹3 Cr Onwards", status: "Pre-Launch", hue: "135deg, #1a0a00 0%, #1f0f00 50%, #0a0a0a 100%" },
  { name: "AK Golden Estates", loc: "Madurai", price: "₹2.8 Cr Onwards", status: "Ready to Move", hue: "135deg, #1a1500 0%, #2a2000 50%, #0a0a0a 100%" },
  { name: "AK Heritage Park", loc: "Trichy", price: "₹1.5 Cr Onwards", status: "Just Launched", hue: "135deg, #0a1a0a 0%, #0f2a10 50%, #0a0a0a 100%" },
];

const PILLARS = [
  { title: "TRUST", desc: "Built on a foundation of transparency, every AK property is a testament to unshakeable reliability." },
  { title: "ELEGANCE", desc: "Meticulous attention to detail and world-class design philosophies shape our architectural marvels." },
  { title: "LEGACY", desc: "We don't just build homes; we craft generational wealth and landmarks that stand the test of time." },
];

export function Desktop() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 800], [0, 240]);
  const opacityHero = useTransform(scrollY, [0, 700], [1, 0]);

  useEffect(() => {
    const el = document.getElementById("ak-scroll-root");
    if (!el) return;
    const handler = () => setScrolled(el.scrollTop > 50);
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, []);

  const navBase = "fixed top-0 w-full z-50 transition-all duration-500";
  const navScrolled = "bg-black/70 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_40px_rgba(0,0,0,0.6)]";
  const navClear = "bg-transparent border-b border-transparent";

  return (
    <div
      id="ak-scroll-root"
      className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] overflow-y-auto overflow-x-hidden selection:bg-[#ff7a00]/30"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Inter:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;0,700;0,800;1,400&display=swap');
        .fp{font-family:'Playfair Display',serif}
        .fc{font-family:'Cormorant Garamond',serif}
        .fi{font-family:'Inter',sans-serif}
        .shimmer{
          background:linear-gradient(90deg,#f5f5f5 0%,#ff7a00 50%,#f5f5f5 100%);
          background-size:200% auto;
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          background-clip:text;
          animation:shimmer 4s linear infinite;
        }
        .gold-text{
          background:linear-gradient(to right,#c8962e,#f2d480,#c8962e);
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          background-clip:text;
        }
        @keyframes shimmer{to{background-position:200% center}}
        @keyframes drift{
          0%{transform:translateY(100vh) scale(0.6);opacity:0}
          8%{opacity:1}
          92%{opacity:0.6}
          100%{transform:translateY(-8vh) scale(1.3);opacity:0}
        }
        .ptcl{position:absolute;background:white;border-radius:50%;animation:drift linear infinite}
        .hide-sb::-webkit-scrollbar{display:none}
        .hide-sb{-ms-overflow-style:none;scrollbar-width:none}
        .card-glow:hover{box-shadow:0 0 0 1px rgba(255,122,0,0.4),0 20px 60px rgba(255,122,0,0.12)}
        .prop-img{position:relative;overflow:hidden}
        .prop-img::after{content:'';position:absolute;inset:0;background:radial-gradient(circle at 50% 80%,rgba(255,122,0,0.18) 0%,transparent 65%);opacity:0;transition:opacity 0.5s}
        .prop-img:hover::after{opacity:1}
        .glass{background:rgba(255,255,255,0.04);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.06)}
      `}</style>

      {/* ── Navbar ── */}
      <nav className={navBase + " " + (scrolled ? navScrolled : navClear)}>
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="fp text-[28px] font-bold text-[#ff7a00]">AK</span>
            <span className="fi font-light tracking-[0.28em] text-[9px] text-white/60 border-l border-white/20 pl-4 leading-tight">
              GROUP OF<br />REAL ESTATE
            </span>
          </div>
          <div className="hidden md:flex items-center gap-12 fi font-light tracking-[0.22em] text-[11px] text-white/70">
            {["PROPERTIES", "ABOUT", "CONTACT"].map(l => (
              <a key={l} href={"#" + l.toLowerCase()} className="hover:text-[#ff7a00] transition-colors duration-300">{l}</a>
            ))}
          </div>
          <button className="hidden md:block px-7 py-3 text-[10px] fi font-medium tracking-[0.22em] border border-[#ff7a00]/50 text-white hover:bg-[#ff7a00] hover:text-black hover:border-[#ff7a00] hover:shadow-[0_0_24px_rgba(255,122,0,0.35)] transition-all duration-300">
            ENQUIRE
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#0a0a0a]" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 55%, rgba(255,122,0,0.13) 0%, rgba(10,10,10,1) 65%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 40% 40% at 50% 80%, rgba(200,150,46,0.07) 0%, transparent 60%)" }} />

        {/* Particles */}
        {PARTICLES.map((s, i) => (
          <div key={i} className="ptcl" style={s} />
        ))}

        {/* City silhouette */}
        <div className="absolute bottom-0 left-0 right-0 h-[28vh] pointer-events-none opacity-30"
          style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(255,122,0,0.04) 40%, #0a0a0a 100%)" }}>
          <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className="w-full h-full" style={{ fill: "rgba(255,255,255,0.06)" }}>
            <path d="M0,200 L0,160 L40,160 L40,100 L80,100 L80,140 L120,140 L120,70 L160,70 L160,150 L200,150 L200,90 L240,90 L240,170 L280,170 L280,50 L320,50 L320,130 L360,130 L360,80 L400,80 L400,160 L440,160 L440,30 L480,30 L480,140 L520,140 L520,70 L560,70 L560,150 L600,150 L600,110 L640,110 L640,160 L680,160 L680,60 L720,60 L720,140 L760,140 L760,100 L800,100 L800,170 L840,170 L840,80 L880,80 L880,130 L920,130 L920,50 L960,50 L960,160 L1000,160 L1000,90 L1040,90 L1040,150 L1080,150 L1080,110 L1120,110 L1120,170 L1160,170 L1160,70 L1200,70 L1200,140 L1240,140 L1240,100 L1280,100 L1280,160 L1320,160 L1320,80 L1360,80 L1360,150 L1440,150 L1440,200 Z" />
          </svg>
        </div>

        <motion.div
          className="relative z-10 text-center flex flex-col items-center px-4"
          style={{ y: yHero, opacity: opacityHero }}
        >
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}
            className="fi text-[9px] tracking-[0.45em] text-[#c8962e] mb-8 font-medium">
            TAMIL NADU'S PREMIER LUXURY DEVELOPER
          </motion.p>

          <motion.h1 initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.5 }}
            className="fp font-bold leading-[0.88] tracking-tighter mb-8 flex flex-col items-center select-none">
            <span className="text-white/90" style={{ fontSize: "clamp(72px,11vw,140px)" }}>AK</span>
            <span className="shimmer" style={{ fontSize: "clamp(80px,12.5vw,158px)" }}>GROUP</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.1 }}
            className="fc italic text-white/55 mb-10" style={{ fontSize: "clamp(20px,2.5vw,36px)" }}>
            From Land to Legacy
          </motion.p>

          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.4, delay: 1.4 }}
            className="w-20 h-px mb-12 origin-center"
            style={{ background: "linear-gradient(to right,transparent,#c8962e,transparent)" }} />

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 1.7 }}
            className="flex flex-col sm:flex-row gap-5">
            <button className="px-10 py-4 bg-[#ff7a00] text-black fi text-[10px] tracking-[0.22em] font-semibold hover:bg-[#ff9030] hover:shadow-[0_0_32px_rgba(255,122,0,0.45)] transition-all duration-300">
              EXPLORE PROPERTIES
            </button>
            <button className="px-10 py-4 border border-white/25 text-white fi text-[10px] tracking-[0.22em] font-medium hover:bg-white hover:text-black transition-all duration-300">
              LEARN MORE
            </button>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 2.8 }}
          className="absolute bottom-10 flex flex-col items-center gap-2">
          <span className="fi text-[9px] tracking-[0.35em] text-white/35 uppercase">Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <ChevronDown className="w-4 h-4 text-white/35" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Properties ── */}
      <section id="properties" className="py-28 bg-[#0a0a0a]">
        <div className="max-w-[1400px] mx-auto px-8 mb-16 flex items-end justify-between">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={FADE_UP}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-px bg-[#ff7a00]" />
              <span className="fi text-[9px] tracking-[0.35em] text-[#ff7a00] uppercase">Signature Properties</span>
            </div>
            <p className="fc text-3xl text-white/55 max-w-lg">A curated collection of Tamil Nadu's most exclusive addresses.</p>
          </motion.div>
          <div className="hidden md:flex gap-3">
            {[true, false].map((rot, i) => (
              <button key={i} className="w-11 h-11 rounded-full border border-white/12 flex items-center justify-center text-white/50 hover:border-[#ff7a00] hover:text-[#ff7a00] transition-colors">
                <ArrowRight className={"w-4 h-4" + (rot ? " rotate-180" : "")} />
              </button>
            ))}
          </div>
        </div>

        <div className="flex overflow-x-auto hide-sb px-8 gap-7 pb-10 snap-x snap-mandatory">
          {PROPERTIES.map((p, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: i * 0.08 }}
              className="group min-w-[340px] snap-center cursor-pointer shrink-0"
            >
              <div className="prop-img card-glow w-full aspect-[4/5] mb-5 transition-all duration-500"
                style={{ background: "linear-gradient(" + p.hue + ")", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="absolute top-4 left-4 px-3 py-1.5 glass text-[8px] fi tracking-[0.22em] uppercase text-[#c8962e]">
                  {p.status}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1/2"
                  style={{ background: "linear-gradient(to top,rgba(0,0,0,0.7),transparent)" }} />
              </div>
              <h3 className="fp text-[22px] mb-2 group-hover:text-[#ff7a00] transition-colors duration-300">{p.name}</h3>
              <div className="flex items-center gap-2 text-white/45 fi text-[13px] mb-2">
                <MapPin className="w-3.5 h-3.5" />{p.loc}
              </div>
              <div className="fc text-[20px] gold-text">{p.price}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Stats Bento ── */}
      <section className="py-20 px-8 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto grid grid-cols-3 auto-rows-[220px] gap-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={FADE_UP}
            className="col-span-2 row-span-2 glass relative p-10 flex flex-col justify-end overflow-hidden group cursor-pointer">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{ background: "radial-gradient(circle at 30% 70%,rgba(255,122,0,0.09),transparent 70%)" }} />
            <div className="relative z-10">
              <div className="fi text-[9px] tracking-[0.35em] text-[#ff7a00] mb-6">OUR PROMISE</div>
              <h2 className="fp leading-tight font-medium text-white/90" style={{ fontSize: "clamp(28px,3.5vw,52px)" }}>
                Redefining the skyline of Tamil Nadu with uncompromising luxury and timeless architecture.
              </h2>
            </div>
          </motion.div>

          {[
            { val: "500+", label: "Projects Delivered" },
            { val: "10K+", label: "Families Housed" },
            { val: "20+", label: "Years of Excellence" },
            { val: "4", label: "Major Cities" },
          ].map((s, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.1 }}
              className="glass flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-white/8 transition-colors duration-500">
              <div className="fp text-5xl text-[#ff7a00] mb-3 group-hover:scale-110 transition-transform duration-400">{s.val}</div>
              <div className="fi text-[9px] tracking-[0.3em] text-white/60 uppercase">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="py-32">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative flex justify-center">
            <span className="fp font-bold text-white/[0.04] select-none leading-none" style={{ fontSize: "clamp(160px,22vw,280px)" }}>20</span>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="fi text-[18px] tracking-[0.5em] text-[#c8962e]">YEARS</span>
            </div>
            <motion.div initial={{ height: 0 }} whileInView={{ height: "100%" }} viewport={{ once: true }}
              transition={{ duration: 1.6, ease: "easeOut" }}
              className="absolute left-0 top-0 w-[2px] origin-top hidden lg:block"
              style={{ background: "linear-gradient(to bottom,#ff7a00,transparent)" }} />
          </div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={STAGGER} className="space-y-12">
            {PILLARS.map((p, i) => (
              <motion.div key={i} variants={FADE_UP}>
                <div className="flex items-center gap-5 mb-3">
                  <div className="w-8 h-px bg-[#c8962e]" />
                  <h4 className="fi tracking-[0.22em] text-white text-sm">{p.title}</h4>
                </div>
                <p className="fi font-light text-white/45 leading-relaxed pl-[52px] text-[14px]">{p.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="py-32 bg-[#0d0d0d] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={FADE_UP}
            className="text-center mb-20">
            <p className="fi text-[9px] tracking-[0.4em] text-[#ff7a00] mb-4">GET IN TOUCH</p>
            <h2 className="fp text-5xl md:text-6xl font-bold mb-5">Begin Your Journey</h2>
            <p className="fi font-light text-white/45 max-w-lg mx-auto text-sm">Connect with our luxury property advisors to discover your next signature address.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.8 }} className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                {["FIRST NAME", "LAST NAME"].map(ph => (
                  <input key={ph} type="text" placeholder={ph}
                    className="w-full bg-transparent border-b border-white/18 pb-4 fi text-[11px] tracking-[0.12em] text-white placeholder-white/30 focus:outline-none focus:border-[#ff7a00] transition-colors" />
                ))}
              </div>
              {["EMAIL ADDRESS", "PHONE NUMBER"].map(ph => (
                <input key={ph} type="text" placeholder={ph}
                  className="w-full bg-transparent border-b border-white/18 pb-4 fi text-[11px] tracking-[0.12em] text-white placeholder-white/30 focus:outline-none focus:border-[#ff7a00] transition-colors" />
              ))}
              <textarea placeholder="YOUR MESSAGE" rows={3}
                className="w-full bg-transparent border-b border-white/18 pb-4 fi text-[11px] tracking-[0.12em] text-white placeholder-white/30 focus:outline-none focus:border-[#ff7a00] transition-colors resize-none" />
              <button className="w-full py-5 bg-[#ff7a00] text-black fi text-[10px] tracking-[0.22em] font-semibold hover:bg-[#ff9030] hover:shadow-[0_0_32px_rgba(255,122,0,0.4)] transition-all duration-300 mt-4">
                SUBMIT INQUIRY
              </button>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:pl-12 border-l border-white/8 space-y-12 flex flex-col justify-center">
              {[
                { Icon: Phone, label: "CALL US", val: "+91 98765 43210" },
                { Icon: Mail, label: "EMAIL", val: "concierge@akgroup.in" },
                { Icon: MapPin, label: "HEADQUARTERS", val: "AK Towers, Mount Road, Chennai, TN 600002" },
              ].map(({ Icon, label, val }) => (
                <div key={label} className="flex items-start gap-5">
                  <div className="w-11 h-11 rounded-full border border-white/18 flex items-center justify-center text-[#ff7a00] shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="fi text-[9px] tracking-[0.24em] text-white/45 mb-2">{label}</div>
                    <div className="fc text-[22px] text-white">{val}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* WhatsApp FAB */}
        <button className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_24px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform duration-300"
          style={{ background: "#25D366" }}>
          <MessageSquare className="w-5 h-5 text-white" />
        </button>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 border-t border-white/8 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <span className="fp text-[24px] font-bold text-white/75">AK</span>
            <span className="fi font-light tracking-[0.22em] text-[8px] text-white/35 border-l border-white/18 pl-4 leading-snug">
              GROUP OF<br />REAL ESTATE
            </span>
          </div>
          <div className="fi text-[10px] text-white/35 tracking-widest">
            &copy; {new Date().getFullYear()} AK GROUP. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-5">
            <Instagram className="w-4 h-4 text-white/35 hover:text-white cursor-pointer transition-colors" />
            <Twitter className="w-4 h-4 text-white/35 hover:text-white cursor-pointer transition-colors" />
            <Linkedin className="w-4 h-4 text-white/35 hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>
      </footer>
    </div>
  );
}
