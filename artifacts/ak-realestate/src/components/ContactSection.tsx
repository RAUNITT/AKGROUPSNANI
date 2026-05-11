import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getSettings, submitContact } from "@/lib/supabase";
import type { SiteSettings } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export function ContactSection() {
  const { toast } = useToast();
  const { data: settings } = useQuery<SiteSettings | null>({
    queryKey: ["site-settings"],
    queryFn: getSettings,
  });

  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const phone = settings?.phone ?? "+91 98765 43210";
  const email = settings?.email ?? "luxury@akgroup.com";
  const address = settings?.office_address ?? "Chennai, Tamil Nadu";
  const whatsapp = settings?.whatsapp ?? "919876543210";

  const contactInfo = [
    { icon: MapPin, label: "Corporate Office", value: address },
    { icon: Phone, label: "Phone", value: phone, href: `tel:${phone.replace(/\s/g, "")}` },
    { icon: Mail, label: "Email", value: email, href: `mailto:${email}` },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await submitContact(form);
      setSubmitted(true);
      setForm({ first_name: "", last_name: "", email: "", phone: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    } catch {
      toast({ title: "Something went wrong", description: "Try again or contact us on WhatsApp.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-24 bg-[#0a0a0a] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[50vh] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="mb-10 sm:mb-14">
          <p className="text-[10px] sm:text-xs tracking-[0.3em] text-primary/70 uppercase mb-3">Get in Touch</p>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold tracking-wide">Connect With Us</h2>
          <div className="mt-4 w-12 h-px bg-gradient-to-r from-primary/80 to-transparent shadow-[0_0_8px_rgba(255,140,0,0.4)]" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16">
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
            <p className="text-sm sm:text-base text-muted-foreground/70 mb-8 max-w-sm leading-relaxed">
              Schedule a private viewing or consultation with our team.
            </p>
            <div className="space-y-6 mb-8">
              {contactInfo.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-9 h-9 border border-primary/30 bg-primary/5 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="text-primary" size={15} />
                  </div>
                  <div>
                    <p className="text-[10px] tracking-[0.2em] text-muted-foreground/60 uppercase mb-1">{label}</p>
                    {href
                      ? <a href={href} className="text-sm text-foreground/80 hover:text-primary transition-colors">{value}</a>
                      : <p className="text-sm text-foreground/80">{value}</p>
                    }
                  </div>
                </div>
              ))}
            </div>
            <a
              href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 h-12 px-6 border border-[#25D366]/40 bg-[#25D366]/8 text-[#25D366] hover:bg-[#25D366]/15 hover:border-[#25D366]/60 transition-all duration-300 text-sm tracking-wider font-medium"
            >
              <MessageCircle size={18} /> Chat on WhatsApp
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}>
            <div className="border border-white/[0.07] bg-white/[0.03] backdrop-blur-md p-6 sm:p-8 relative">
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              {submitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-16 text-center gap-4">
                  <div className="w-14 h-14 border border-primary/40 bg-primary/10 flex items-center justify-center">
                    <Mail className="text-primary" size={24} />
                  </div>
                  <p className="font-serif text-xl text-foreground/90">Message Received</p>
                  <p className="text-sm text-muted-foreground/70">Our team will reach out within 24 hours.</p>
                </motion.div>
              ) : (
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { key: "first_name", label: "First Name" },
                      { key: "last_name", label: "Last Name" },
                    ].map(({ key, label }) => (
                      <div key={key} className="space-y-1.5">
                        <label className="text-[10px] tracking-[0.2em] text-muted-foreground/60 uppercase">{label}</label>
                        <Input
                          value={form[key as keyof typeof form]}
                          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                          required
                          className="bg-white/[0.04] border-white/[0.08] focus-visible:ring-primary h-11 rounded-none text-sm"
                        />
                      </div>
                    ))}
                  </div>
                  {[
                    { key: "email", label: "Email", type: "email" },
                    { key: "phone", label: "Phone", type: "tel" },
                  ].map(({ key, label, type }) => (
                    <div key={key} className="space-y-1.5">
                      <label className="text-[10px] tracking-[0.2em] text-muted-foreground/60 uppercase">{label}</label>
                      <Input
                        type={type}
                        value={form[key as keyof typeof form]}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        required={key === "email"}
                        className="bg-white/[0.04] border-white/[0.08] focus-visible:ring-primary h-11 rounded-none text-sm"
                      />
                    </div>
                  ))}
                  <div className="space-y-1.5">
                    <label className="text-[10px] tracking-[0.2em] text-muted-foreground/60 uppercase">Message</label>
                    <Textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                      className="bg-white/[0.04] border-white/[0.08] focus-visible:ring-primary min-h-[100px] rounded-none resize-none text-sm"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={sending}
                    className="w-full h-12 sm:h-14 bg-gradient-to-r from-primary to-amber-500 hover:from-amber-400 hover:to-primary text-black font-bold tracking-[0.15em] text-xs sm:text-sm rounded-none border-0 transition-all hover:shadow-[0_0_28px_rgba(255,140,0,0.35)] disabled:opacity-50"
                  >
                    {sending ? "SENDING…" : "SEND MESSAGE"}
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
