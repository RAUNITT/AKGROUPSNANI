import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Calculator, ArrowRight, Expand, Activity, Home, Map, Maximize } from "lucide-react";

// TN Market Data
const TN_MARKET_DATA: Record<string, { app_pa: number, yield: number }> = {
  "Chennai": { app_pa: 10, yield: 3.5 },
  "Coimbatore": { app_pa: 12, yield: 4.0 },
  "Madurai": { app_pa: 8, yield: 4.5 },
  "Trichy": { app_pa: 7.5, yield: 4.5 },
  "Salem": { app_pa: 7, yield: 5.0 },
  "Other": { app_pa: 8, yield: 4.0 },
};

export default function Tools() {
  // ROI Calc State
  const [location, setLocation] = useState("Chennai");
  const [propType, setPropType] = useState("Apartment");
  const [value, setValue] = useState(10000000); // 1 Cr
  const [rent, setRent] = useState(29166); // auto
  const [rentOverridden, setRentOverridden] = useState(false);
  const [years, setYears] = useState([5]);
  const [maintenance, setMaintenance] = useState("1");

  // Auto update rent when location/value changes IF not overridden
  useEffect(() => {
    if (!rentOverridden) {
      const y = TN_MARKET_DATA[location].yield / 100;
      setRent(Math.round((value * y) / 12));
    }
  }, [value, location, rentOverridden]);

  const handleRentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRentOverridden(true);
    setRent(Number(e.target.value) || 0);
  };

  // ROI Math
  const annualRent = rent * 12;
  const grossYield = value > 0 ? (annualRent / value) * 100 : 0;
  const annualMaintCost = value * (Number(maintenance) / 100);
  const netAnnualRent = annualRent - annualMaintCost;
  const netYield = value > 0 ? (netAnnualRent / value) * 100 : 0;

  const appRate = TN_MARKET_DATA[location].app_pa / 100;
  const futureValue = value * Math.pow(1 + appRate, years[0]);
  const capitalGain = futureValue - value;
  
  const totalRentEarned = netAnnualRent * years[0];
  const totalRoiAbs = capitalGain + totalRentEarned;
  const totalRoiPct = value > 0 ? (totalRoiAbs / value) * 100 : 0;

  const formatINR = (num: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
  };

  // Size Converter State
  const [szVal, setSzVal] = useState("1000");
  const [szUnit, setSzUnit] = useState("sq ft");

  const convertToSqFt = (val: number, unit: string) => {
    switch (unit) {
      case "sq ft": return val;
      case "sq meters": return val * 10.7639;
      case "sq yards": return val * 9;
      case "acres": return val * 43560;
      case "grounds": return val * 2400;
      case "cents": return val * 435.6;
      case "guntas": return val * 1089;
      case "marla": return val * 272.25;
      default: return val;
    }
  };

  const sqFtVal = convertToSqFt(Number(szVal) || 0, szUnit);
  
  const conversions = [
    { u: "sq ft", v: sqFtVal },
    { u: "sq meters", v: sqFtVal / 10.7639 },
    { u: "sq yards", v: sqFtVal / 9 },
    { u: "acres", v: sqFtVal / 43560 },
    { u: "grounds", v: sqFtVal / 2400 },
    { u: "cents", v: sqFtVal / 435.6 },
    { u: "guntas", v: sqFtVal / 1089 },
    { u: "marla", v: sqFtVal / 272.25 },
  ];

  const upcomingTools = [
    { title: "EMI Calculator", desc: "Plan your home loan payments." },
    { title: "Stamp Duty Calculator", desc: "Estimate registration costs." },
    { title: "Property Tax Estimator", desc: "Calculate municipal taxes." },
    { title: "Vastu Directions Guide", desc: "Check property compliance." },
  ];

  const inp = "bg-white/[0.04] border-white/[0.08] focus-visible:ring-primary rounded-none text-sm";
  const label = "text-[10px] tracking-[0.2em] text-muted-foreground/60 uppercase mb-2 block";

  return (
    <div className="page-content bg-transparent text-white">
      <NavBar />
      
      <div className="bg-[#0a0a0a]/90 min-h-screen pt-16">
        {/* Hero */}
        <div className="pt-16 pb-16 px-4 sm:px-6 relative overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-display tracking-wide mb-4">REAL ESTATE TOOLS</h1>
            <p className="text-muted-foreground/70 text-sm sm:text-base max-w-2xl mx-auto uppercase tracking-widest">
              Professional utilities for smart investments
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        
        {/* Top Two Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* ROI Calculator */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="lg:col-span-7 border border-white/[0.07] bg-white/[0.02] overflow-hidden flex flex-col"
          >
            <div className="p-6 sm:p-8 border-b border-white/[0.05] bg-[#0d0d0d] flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                <Calculator className="text-primary" size={24} />
              </div>
              <div>
                <h2 className="font-serif text-2xl text-foreground">ROI Calculator</h2>
                <p className="text-xs text-muted-foreground/60 uppercase tracking-wider mt-1">Tamil Nadu Market Data Integrated</p>
              </div>
            </div>
            
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
              {/* Inputs */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={label}>Location</label>
                    <Select value={location} onValueChange={setLocation}>
                      <SelectTrigger className={inp}><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-[#0f0f0f] border-white/10 text-white">
                        {Object.keys(TN_MARKET_DATA).map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className={label}>Type</label>
                    <Select value={propType} onValueChange={setPropType}>
                      <SelectTrigger className={inp}><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-[#0f0f0f] border-white/10 text-white">
                        {["Apartment", "Villa", "Plot", "Commercial"].map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-[10px] tracking-[0.2em] text-muted-foreground/60 uppercase">Property Value</label>
                    <span className="text-primary text-sm font-semibold">{formatINR(value)}</span>
                  </div>
                  <Slider value={[value]} max={100000000} min={1000000} step={100000} onValueChange={(v) => setValue(v[0])} className="py-4" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={label}>Monthly Rent (₹)</label>
                    <Input type="number" value={rent} onChange={handleRentChange} className={inp} />
                  </div>
                  <div>
                    <label className={label}>Maintenance (%)</label>
                    <Input type="number" value={maintenance} onChange={(e) => setMaintenance(e.target.value)} className={inp} step="0.1" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-[10px] tracking-[0.2em] text-muted-foreground/60 uppercase">Holding Period</label>
                    <span className="text-primary text-sm font-semibold">{years[0]} Years</span>
                  </div>
                  <Slider value={years} max={15} min={1} step={1} onValueChange={setYears} className="py-4" />
                </div>
              </div>

              {/* Results */}
              <div className="bg-[#050505] border border-white/[0.05] p-6 space-y-6">
                <h3 className="text-sm font-semibold tracking-widest uppercase text-foreground/80 border-b border-white/10 pb-3">Projection for {years[0]} Years</h3>
                
                <div className="grid grid-cols-2 gap-y-6">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 mb-1">Gross Yield</p>
                    <p className="text-lg font-bold">{grossYield.toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 mb-1">Net Yield</p>
                    <p className="text-lg font-bold text-emerald-400">{netYield.toFixed(2)}%</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 mb-1">Est. Future Value</p>
                    <p className="text-2xl font-serif text-primary">{formatINR(futureValue)}</p>
                    <p className="text-xs text-muted-foreground/40 mt-1">at {TN_MARKET_DATA[location].app_pa}% p.a. appreciation</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs uppercase tracking-widest text-muted-foreground/70">Total ROI</span>
                    <span className="text-3xl font-bold text-amber-400">+{totalRoiPct.toFixed(1)}%</span>
                  </div>
                  <p className="text-right text-xs text-muted-foreground/50">Gain: {formatINR(totalRoiAbs)}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Size Converter */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="lg:col-span-5 border border-white/[0.07] bg-white/[0.02] flex flex-col"
          >
            <div className="p-6 sm:p-8 border-b border-white/[0.05] bg-[#0d0d0d] flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                <Maximize className="text-primary" size={24} />
              </div>
              <div>
                <h2 className="font-serif text-2xl text-foreground">Size Converter</h2>
              </div>
            </div>

            <div className="p-6 sm:p-8 flex-grow flex flex-col">
              <div className="flex gap-2 mb-8">
                <Input type="number" value={szVal} onChange={(e) => setSzVal(e.target.value)} className={`${inp} flex-1 text-lg font-bold`} />
                <Select value={szUnit} onValueChange={setSzUnit}>
                  <SelectTrigger className={`${inp} w-[120px]`}><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#0f0f0f] border-white/10 text-white">
                    {conversions.map(c => <SelectItem key={c.u} value={c.u}>{c.u}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-px bg-white/10 border border-white/10 flex-grow">
                {conversions.filter(c => c.u !== szUnit).map((c) => (
                  <div key={c.u} className="bg-[#0a0a0a] p-4 flex flex-col justify-center">
                    <span className="text-[10px] tracking-widest uppercase text-muted-foreground/50 mb-1">{c.u}</span>
                    <span className="text-sm font-semibold text-foreground/90 break-words">
                      {c.v.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Coming Soon */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <h3 className="text-sm tracking-[0.3em] text-primary/70 uppercase mb-6 text-center">More Utilities Coming Soon</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {upcomingTools.map((t, i) => (
              <div key={i} className="border border-white/[0.05] bg-white/[0.01] p-6 opacity-60">
                <h4 className="font-serif text-lg mb-2">{t.title}</h4>
                <p className="text-xs text-muted-foreground/60">{t.desc}</p>
                <div className="mt-4 text-[9px] uppercase tracking-widest text-primary/50 border border-primary/20 bg-primary/5 inline-block px-2 py-0.5">Coming Soon</div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
      </div>
      <Footer />
    </div>
  );
}
