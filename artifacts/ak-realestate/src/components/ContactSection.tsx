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
      toast({ title: "Something went wrong", description: "Try again or reach us on WhatsApp.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-24 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 sm:mb-16"
        >
          <p className="text-[10px] tracking-[0.38em] text-primary/65 uppercase mb-4 font-light">Get in Touch</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold tracking-tight">Connect With Us</h2>
          <div className="mt-4 w-10 h-px bg-primary/55" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-sm text-foreground/50 mb-10 max-w-sm leading-relaxed font-light">
              Schedule a private viewing or consultation. Our team responds within 24 hours.
            </p>
            <div className="space-y-7 mb-10">
              {contactInfo.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-5">
                  <div className="w-8 h-8 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="text-primary/70" size={13} />
                  </div>
                  <div>
                    <p className="text-[9px] tracking-[0.28em] text-foreground/35 uppercase mb-1 font-light">{label}</p>
                    {href
                      ? <a href={href} className="text-sm text-foreground/70 hover:text-foreground/90 transition-colors font-light">{value}</a>
                      : <p className="text-sm text-foreground/70 font-light">{value}</p>
                    }
                  </div>
                </div>
              ))}
            </div>
            <a
              href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 h-11 px-6 border border-[#25D366]/35 text-[#25D366]/80 hover:text-[#25D366] hover:border-[#25D366]/55 transition-all duration-300 text-[11px] tracking-[0.18em] font-light uppercase"
            >
              <MessageCircle size={14} /> Chat on WhatsApp
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="border border-white/[0.07] bg-[#0d0d0d] p-7 sm:p-10">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center gap-5"
                >
                  <div className="w-12 h-12 border border-primary/30 flex items-center justify-center">
                    <Mail className="text-primary" size={20} />
                  </div>
                  <p className="font-serif text-xl text-foreground/85">Message Received</p>
                  <p className="text-sm text-foreground/45 font-light">Our team will reach out within 24 hours.</p>
                </motion.div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[{ key: "first_name", label: "First Name" }, { key: "last_name", label: "Last Name" }].map(({ key, label }) => (
                      <div key={key} className="space-y-2">
                        <label className="text-[9px] tracking-[0.28em] text-foreground/35 uppercase font-light">{label}</label>
                        <Input
                          value={form[key as keyof typeof form]}
                          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                          required
                          className="bg-white/[0.03] border-white/[0.07] focus-visible:ring-primary/40 h-11 rounded-none text-sm font-light"
                        />
                      </div>
                    ))}
                  </div>
                  {[{ key: "email", label: "Email", type: "email" }, { key: "phone", label: "Phone", type: "tel" }].map(({ key, label, type }) => (
                    <div key={key} className="space-y-2">
                      <label className="text-[9px] tracking-[0.28em] text-foreground/35 uppercase font-light">{label}</label>
                      <Input
                        type={type}
                        value={form[key as keyof typeof form]}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        required={key === "email"}
                        className="bg-white/[0.03] border-white/[0.07] focus-visible:ring-primary/40 h-11 rounded-none text-sm font-light"
                      />
                    </div>
                  ))}
                  <div className="space-y-2">
                    <label className="text-[9px] tracking-[0.28em] text-foreground/35 uppercase font-light">Message</label>
                    <Textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                      className="bg-white/[0.03] border-white/[0.07] focus-visible:ring-primary/40 min-h-[90px] rounded-none resize-none text-sm font-light"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={sending}
                    className="w-full h-12 bg-primary text-black font-medium tracking-[0.2em] text-[11px] rounded-none border-0 transition-colors hover:bg-amber-400 disabled:opacity-50 uppercase"
                  >
                    {sending ? "Sending…" : "Send Message"}
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
