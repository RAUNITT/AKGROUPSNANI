import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { useSubmitContact, useGetSettings } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

export function ContactSection() {
  const { toast } = useToast();
  const { data: settings } = useGetSettings();
  const submitContact = useSubmitContact();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const contactInfo = [
    {
      icon: MapPin,
      label: "Corporate Office",
      value: settings?.officeAddress ?? "Level 42, The Summit Tower, Chennai, Tamil Nadu 600001",
    },
    {
      icon: Phone,
      label: "Phone",
      value: settings?.phone ?? "+91 98765 43210",
      href: `tel:${(settings?.phone ?? "+919876543210").replace(/\s/g, "")}`,
    },
    {
      icon: Mail,
      label: "Email",
      value: settings?.email ?? "luxury@akgroup.com",
      href: `mailto:${settings?.email ?? "luxury@akgroup.com"}`,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitContact.mutate(
      { data: form },
      {
        onSuccess: () => {
          setSubmitted(true);
          setForm({ firstName: "", lastName: "", email: "", phone: "", message: "" });
          setTimeout(() => setSubmitted(false), 5000);
        },
        onError: () => {
          toast({
            title: "Something went wrong",
            description: "Please try again or contact us via WhatsApp.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const whatsappHref = `https://wa.me/${(settings?.whatsappNumber ?? "+919876543210").replace(/[^0-9]/g, "")}`;

  return (
    <section
      id="contact"
      className="py-16 sm:py-24 bg-[#0a0a0a] relative overflow-hidden"
    >
      {/* Ambient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[50vh] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 sm:mb-14"
        >
          <p className="text-[10px] sm:text-xs tracking-[0.3em] text-primary/70 uppercase mb-3">
            Get in Touch
          </p>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground tracking-wide">
            Connect With Us
          </h2>
          <div className="mt-4 w-12 h-px bg-gradient-to-r from-primary/80 to-transparent shadow-[0_0_8px_rgba(255,140,0,0.4)]" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16">
          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-sm sm:text-base text-muted-foreground/70 mb-8 sm:mb-10 max-w-sm leading-relaxed">
              Experience the pinnacle of luxury living. Reach out to schedule a
              private viewing or consultation with our team.
            </p>

            <div className="space-y-6 sm:space-y-8 mb-8 sm:mb-10">
              {contactInfo.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-9 h-9 border border-primary/30 bg-primary/5 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="text-primary" size={15} />
                  </div>
                  <div>
                    <p className="text-[10px] tracking-[0.2em] text-muted-foreground/60 uppercase mb-1">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        className="text-sm text-foreground/80 hover:text-primary transition-colors"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm text-foreground/80">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp */}
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="button-whatsapp"
              className="inline-flex items-center gap-3 h-12 px-6 border border-[#25D366]/40 bg-[#25D366]/8 text-[#25D366] hover:bg-[#25D366]/15 hover:border-[#25D366]/60 transition-all duration-300 text-sm tracking-wider font-medium shadow-[0_0_20px_rgba(37,211,102,0.1)] hover:shadow-[0_0_24px_rgba(37,211,102,0.2)]"
            >
              <MessageCircle size={18} />
              Chat on WhatsApp
            </a>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="border border-white/[0.07] bg-white/[0.03] backdrop-blur-md p-6 sm:p-8 relative">
              {/* Top glow line */}
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center gap-4"
                >
                  <div className="w-14 h-14 border border-primary/40 bg-primary/10 flex items-center justify-center">
                    <Mail className="text-primary" size={24} />
                  </div>
                  <p className="font-serif text-xl text-foreground/90">
                    Message Received
                  </p>
                  <p className="text-sm text-muted-foreground/70">
                    Our team will reach out within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] tracking-[0.2em] text-muted-foreground/60 uppercase">
                        First Name
                      </label>
                      <Input
                        value={form.firstName}
                        onChange={(e) =>
                          setForm({ ...form, firstName: e.target.value })
                        }
                        required
                        className="bg-white/[0.04] border-white/[0.08] focus-visible:ring-primary focus-visible:border-primary/50 h-11 rounded-none text-sm"
                        data-testid="input-first-name"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] tracking-[0.2em] text-muted-foreground/60 uppercase">
                        Last Name
                      </label>
                      <Input
                        value={form.lastName}
                        onChange={(e) =>
                          setForm({ ...form, lastName: e.target.value })
                        }
                        required
                        className="bg-white/[0.04] border-white/[0.08] focus-visible:ring-primary focus-visible:border-primary/50 h-11 rounded-none text-sm"
                        data-testid="input-last-name"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] tracking-[0.2em] text-muted-foreground/60 uppercase">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      required
                      className="bg-white/[0.04] border-white/[0.08] focus-visible:ring-primary focus-visible:border-primary/50 h-11 rounded-none text-sm"
                      data-testid="input-email"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] tracking-[0.2em] text-muted-foreground/60 uppercase">
                      Phone
                    </label>
                    <Input
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      className="bg-white/[0.04] border-white/[0.08] focus-visible:ring-primary focus-visible:border-primary/50 h-11 rounded-none text-sm"
                      data-testid="input-phone"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] tracking-[0.2em] text-muted-foreground/60 uppercase">
                      Message
                    </label>
                    <Textarea
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      required
                      className="bg-white/[0.04] border-white/[0.08] focus-visible:ring-primary focus-visible:border-primary/50 min-h-[100px] rounded-none resize-none text-sm"
                      data-testid="input-message"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={submitContact.isPending}
                    className="w-full h-12 sm:h-14 bg-gradient-to-r from-primary to-amber-500 hover:from-amber-400 hover:to-primary text-black font-bold tracking-[0.15em] text-xs sm:text-sm rounded-none border-0 transition-all duration-400 hover:shadow-[0_0_28px_rgba(255,140,0,0.35)] disabled:opacity-50"
                    data-testid="button-send-message"
                  >
                    {submitContact.isPending ? "SENDING…" : "SEND MESSAGE"}
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
