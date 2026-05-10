import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

export function ContactSection() {
  return (
    <section id="contact" className="py-24 bg-[#0a0a0a] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16"
        >
          <div>
            <h2 className="text-3xl md:text-5xl font-serif tracking-widest font-bold text-foreground mb-4">
              CONNECT WITH US
            </h2>
            <p className="text-muted-foreground mb-12 max-w-md">
              Experience the pinnacle of luxury living. Reach out to schedule a private viewing or consultation.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <MapPin className="text-primary mt-1" size={24} />
                <div>
                  <h4 className="text-sm tracking-widest text-foreground uppercase mb-1">Corporate Office</h4>
                  <p className="text-muted-foreground">Level 42, The Summit Tower,<br/>Chennai, Tamil Nadu 600001</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="text-primary mt-1" size={24} />
                <div>
                  <h4 className="text-sm tracking-widest text-foreground uppercase mb-1">Phone</h4>
                  <p className="text-muted-foreground">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="text-primary mt-1" size={24} />
                <div>
                  <h4 className="text-sm tracking-widest text-foreground uppercase mb-1">Email</h4>
                  <p className="text-muted-foreground">luxury@akgroup.com</p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <Button 
                variant="outline" 
                className="gap-2 border-[#25D366]/50 text-[#25D366] hover:bg-[#25D366]/10 hover:text-[#25D366] h-12 px-6 shadow-[0_0_15px_rgba(37,211,102,0.15)]"
              >
                <SiWhatsapp size={20} />
                Chat on WhatsApp
              </Button>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-8 backdrop-blur-md">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs tracking-widest text-muted-foreground uppercase">First Name</label>
                  <Input className="bg-white/5 border-white/10 focus-visible:ring-primary h-12 rounded-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs tracking-widest text-muted-foreground uppercase">Last Name</label>
                  <Input className="bg-white/5 border-white/10 focus-visible:ring-primary h-12 rounded-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs tracking-widest text-muted-foreground uppercase">Email Address</label>
                <Input type="email" className="bg-white/5 border-white/10 focus-visible:ring-primary h-12 rounded-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs tracking-widest text-muted-foreground uppercase">Phone Number</label>
                <Input type="tel" className="bg-white/5 border-white/10 focus-visible:ring-primary h-12 rounded-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs tracking-widest text-muted-foreground uppercase">Message</label>
                <Textarea className="bg-white/5 border-white/10 focus-visible:ring-primary min-h-[120px] rounded-none resize-none" />
              </div>
              <Button className="w-full h-14 bg-gradient-to-r from-primary to-amber-500 hover:from-amber-500 hover:to-primary text-black font-bold tracking-widest rounded-none border-0 transition-all duration-300">
                SEND MESSAGE
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
