import { motion } from 'framer-motion';
import { Menu, MapPin, Phone, Mail, ArrowRight, Instagram, Facebook, Twitter } from 'lucide-react';

const MOBILE_PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  left: ((i * 5.1 + 3) % 100) + "%",
  top: ((i * 7.3 + 11) % 100) + "%",
  animationDelay: ((i * 0.4) % 5) + "s",
  animationDuration: (5 + (i % 5)) + "s",
}));

const PROP_GRADIENTS = [
  "linear-gradient(135deg,rgba(120,60,0,0.4) 0%,rgba(10,10,10,1) 100%)",
  "linear-gradient(135deg,rgba(60,60,70,0.5) 0%,rgba(10,10,10,1) 100%)",
  "linear-gradient(135deg,rgba(100,70,0,0.35) 0%,rgba(10,10,10,1) 100%)",
];

const PROPS = [
  { name: "AK Grandeur Villas", loc: "ECR, Chennai", price: "₹12 Cr Onwards", status: "Ready to Move" },
  { name: "AK Sky Residences", loc: "OMR, Chennai", price: "₹4.5 Cr Onwards", status: "Under Construction" },
  { name: "AK Skyline Towers", loc: "Coimbatore", price: "₹3 Cr Onwards", status: "Pre-Launch" },
];

const STATS = [
  { num: "500+", label: "Projects" },
  { num: "10K+", label: "Families" },
  { num: "20+", label: "Years" },
  { num: "4", label: "Cities" },
];

const PILLARS = [
  { title: "TRUST", desc: "Built on transparency and uncompromising integrity." },
  { title: "ELEGANCE", desc: "Architectural mastery in every square foot." },
  { title: "LEGACY", desc: "Creating landmarks that stand the test of time." },
];

export function Mobile() {
  return (
    <>
      <style>{`
        .fp2{font-family:'Playfair Display',serif}
        .fi2{font-family:'Inter',sans-serif}
        @keyframes mptcl{
          0%{transform:translateY(0) translateX(0);opacity:0}
          50%{opacity:0.45}
          100%{transform:translateY(-90px) translateX(18px);opacity:0}
        }
        .mptcl{position:absolute;width:2px;height:2px;background:#ff7a00;border-radius:50%;animation:mptcl linear infinite}
        .hide-sb2::-webkit-scrollbar{display:none}
        .hide-sb2{-ms-overflow-style:none;scrollbar-width:none}
      `}</style>

      <div className="min-h-screen bg-[#0a0a0a] text-white flex justify-center" style={{ fontFamily: "'Inter',sans-serif" }}>
        <div className="w-full max-w-[390px] relative bg-[#0a0a0a]">

          {/* ── Navbar ── */}
          <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
            <div className="w-full max-w-[390px] h-[60px] flex items-center justify-between px-6 pointer-events-auto"
              style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <span className="fp2 font-bold text-xl" style={{ color: "#ff7a00" }}>AK</span>
              <span className="fi2 font-light text-[10px] tracking-[0.32em] text-white" style={{ opacity: 0.75 }}>AK GROUP</span>
              <button>
                <Menu size={22} color="#ff7a00" strokeWidth={1.5} />
              </button>
            </div>
          </nav>

          {/* ── Hero ── */}
          <section className="relative flex flex-col items-center justify-center px-6 overflow-hidden" style={{ height: "100svh" }}>
            <div className="absolute inset-0" style={{ background: "#0a0a0a" }} />
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 55% at 50% 50%,rgba(255,122,0,0.16) 0%,rgba(10,10,10,1) 65%)" }} />

            {/* Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {MOBILE_PARTICLES.map((s, i) => (
                <div key={i} className="mptcl" style={s} />
              ))}
            </div>

            <div className="relative z-10 flex flex-col items-center text-center mt-14 w-full">
              <motion.span
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.2 }}
                className="fi2 text-[9px] tracking-[0.42em] mb-7 font-medium uppercase"
                style={{ color: "#c8962e" }}>
                Premium Real Estate · Tamil Nadu
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.1, delay: 0.5 }}
                className="fp2 font-bold mb-4 tracking-tight leading-none select-none"
                style={{ fontSize: "clamp(56px,15vw,80px)", background: "linear-gradient(160deg,#ffffff 40%,rgba(255,255,255,0.55) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                AK<br />
                <span style={{ background: "linear-gradient(to right,#ff7a00,#ffaa40,#ff7a00)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  GROUP
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.9 }}
                className="fp2 italic text-lg mb-8" style={{ color: "rgba(255,255,255,0.5)" }}>
                From Land to Legacy
              </motion.p>

              <motion.div
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, delay: 1.1 }}
                className="mb-10 origin-center"
                style={{ width: 44, height: 1, background: "linear-gradient(to right,transparent,#c8962e,transparent)" }} />

              <motion.div
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                className="w-full flex flex-col gap-4">
                <button className="w-full h-14 fi2 text-[11px] tracking-[0.22em] font-semibold uppercase"
                  style={{ background: "#ff7a00", color: "#000" }}>
                  EXPLORE PROPERTIES
                </button>
                <button className="w-full h-14 fi2 text-[11px] tracking-[0.22em] font-medium uppercase"
                  style={{ border: "1px solid rgba(255,255,255,0.2)", color: "#fff", background: "transparent" }}>
                  LEARN MORE
                </button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 2.2, duration: 1 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
              <div className="w-px h-10" style={{ background: "linear-gradient(to bottom,#ff7a00,transparent)" }} />
              <span className="fi2 text-[8px] tracking-[0.3em] uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>Scroll</span>
            </motion.div>
          </section>

          {/* ── Properties ── */}
          <section className="py-20 px-5 bg-[#0a0a0a]">
            <div className="flex flex-col items-center mb-12 text-center">
              <span className="fi2 text-[9px] tracking-[0.35em] mb-3 uppercase" style={{ color: "#ff7a00" }}>Signature Properties</span>
              <h2 className="fp2 text-[28px] text-white">Curated For You</h2>
            </div>

            <div className="flex flex-col gap-6">
              {PROPS.map((p, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, delay: i * 0.1 }}
                  className="relative w-full overflow-hidden cursor-pointer"
                  style={{ height: 360, background: PROP_GRADIENTS[i], border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(0,0,0,0.85) 0%,rgba(0,0,0,0.2) 55%,transparent 100%)" }} />
                  <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 40%,rgba(255,122,0,0.08),transparent 65%)" }} />

                  <div className="absolute top-4 right-4 px-3 py-1.5 fi2 text-[8px] tracking-[0.2em] uppercase"
                    style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.1)", color: "#c8962e" }}>
                    {p.status}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="fp2 text-[22px] text-white mb-1">{p.name}</h3>
                    <div className="flex items-center gap-2 mb-3 fi2 text-[12px]" style={{ color: "rgba(255,255,255,0.55)" }}>
                      <MapPin size={11} color="#ff7a00" />{p.loc}
                    </div>
                    <div className="w-6 h-px mb-3" style={{ background: "#ff7a00" }} />
                    <span className="fp2 text-[17px]" style={{ color: "#c8962e" }}>{p.price}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <button className="fi2 inline-flex items-center gap-2 text-[9px] tracking-[0.3em] uppercase" style={{ color: "rgba(255,255,255,0.6)" }}>
                VIEW ALL PROPERTIES <ArrowRight size={12} />
              </button>
            </div>
          </section>

          {/* ── Stats ── */}
          <section className="py-18 border-y" style={{ borderColor: "rgba(255,255,255,0.06)", background: "#0d0d0d", paddingTop: 64, paddingBottom: 64 }}>
            <div className="grid grid-cols-2 gap-x-6 gap-y-10 px-6">
              {STATS.map((s, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, scale: 0.88 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.09 }}
                  className="flex flex-col items-center text-center gap-2">
                  <span className="fp2 font-bold text-[40px]" style={{ color: "#ff7a00" }}>{s.num}</span>
                  <span className="fi2 text-[9px] tracking-[0.3em] uppercase" style={{ color: "rgba(255,255,255,0.45)" }}>{s.label}</span>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── About Teaser ── */}
          <section className="py-20 px-6 text-center">
            <span className="fi2 text-[9px] tracking-[0.38em] uppercase mb-4 block" style={{ color: "#ff7a00" }}>Our Story</span>
            <h2 className="fp2 text-[26px] text-white mb-12">20 Years of Excellence</h2>

            <div className="flex flex-col gap-10">
              {PILLARS.map((p, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.18 }}
                  className="flex flex-col items-center gap-2">
                  <h3 className="fi2 text-[10px] tracking-[0.28em] uppercase" style={{ color: "#ff7a00" }}>{p.title}</h3>
                  <p className="fi2 font-light text-[13px] max-w-[220px]" style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>{p.desc}</p>
                </motion.div>
              ))}
            </div>

            <div className="w-10 h-px mx-auto mt-12" style={{ background: "#ff7a00" }} />
          </section>

          {/* ── Contact ── */}
          <section className="py-20 px-6 relative border-t" style={{ borderColor: "rgba(255,255,255,0.06)", background: "linear-gradient(to bottom,#0a0a0a,#0d0d0d)" }}>
            <div className="text-center mb-10">
              <span className="fi2 text-[9px] tracking-[0.35em] uppercase mb-3 block" style={{ color: "#ff7a00" }}>Get In Touch</span>
              <h2 className="fp2 text-[28px] text-white">Let's Connect</h2>
            </div>

            <div className="flex flex-col gap-7 max-w-[320px] mx-auto">
              {["YOUR NAME", "EMAIL ADDRESS", "PHONE NUMBER"].map(ph => (
                <input key={ph} type="text" placeholder={ph}
                  className="w-full pb-3 fi2 text-sm text-white focus:outline-none transition-colors"
                  style={{ background: "transparent", borderBottom: "1px solid rgba(255,255,255,0.18)", color: "#fff" }} />
              ))}
              <button className="w-full h-14 fi2 text-[11px] tracking-[0.22em] font-semibold uppercase mt-2"
                style={{ background: "#ff7a00", color: "#000" }}>
                ENQUIRE NOW
              </button>
            </div>

            <div className="mt-12 flex flex-col items-center gap-5 fi2 text-[13px] font-light" style={{ color: "rgba(255,255,255,0.55)" }}>
              <a href="tel:+919876543210" className="flex items-center gap-3">
                <Phone size={14} color="#ff7a00" /> +91 98765 43210
              </a>
              <a href="mailto:info@akgroup.com" className="flex items-center gap-3">
                <Mail size={14} color="#ff7a00" /> info@akgroup.com
              </a>
            </div>

            {/* WhatsApp FAB */}
            <a href="https://wa.me/919876543210"
              className="absolute bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center z-20"
              style={{ background: "#25D366", boxShadow: "0 0 20px rgba(37,211,102,0.35)" }}>
              <Phone size={20} className="text-white" />
            </a>
          </section>

          {/* ── Footer ── */}
          <footer className="py-12 px-6 flex flex-col items-center gap-7 border-t" style={{ borderColor: "rgba(255,255,255,0.08)", background: "#050505" }}>
            <span className="fp2 font-bold text-2xl" style={{ color: "#ff7a00" }}>AK</span>
            <div className="flex gap-6" style={{ color: "rgba(255,255,255,0.35)" }}>
              <Instagram size={18} />
              <Facebook size={18} />
              <Twitter size={18} />
            </div>
            <div className="fi2 text-[9px] tracking-widest uppercase text-center" style={{ color: "rgba(255,255,255,0.28)" }}>
              © {new Date().getFullYear()} AK Group Real Estate · All Rights Reserved
            </div>
          </footer>

        </div>
      </div>
    </>
  );
}
