import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRequestProperty } from "@/contexts/RequestPropertyContext";
import { submitPropertyRequest } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export function RequestPropertyModal() {
  const { isOpen, setIsOpen } = useRequestProperty();
  const { toast } = useToast();
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    property_type: "Apartment",
    location_preference: "",
    budget_min: "50L",
    budget_max: "1Cr",
    bedrooms: "3BHK",
    purpose: "Investment",
    additional_notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await submitPropertyRequest(form);
      toast({ title: "Request received", description: "Our team will contact you shortly." });
      setIsOpen(false);
      setForm({
        name: "", phone: "", email: "", property_type: "Apartment",
        location_preference: "", budget_min: "50L", budget_max: "1Cr",
        bedrooms: "3BHK", purpose: "Investment", additional_notes: ""
      });
    } catch {
      toast({ title: "Submission failed", description: "Please try again later.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const inp = "bg-white/[0.04] border-white/[0.08] focus-visible:ring-primary h-11 rounded-none text-sm";
  const label = "text-[10px] tracking-[0.2em] text-muted-foreground/60 uppercase mb-1.5 block";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-[#0a0a0a] border-white/10 text-white max-w-lg w-[95vw] max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-none">
        <DialogHeader className="mb-6">
          <DialogTitle className="font-serif text-2xl tracking-wide text-primary">Request a Property</DialogTitle>
          <DialogDescription className="text-muted-foreground/70 text-sm">
            Tell us what you're looking for, and our experts will curate a selection of premium properties.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={label}>Name *</label>
                <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inp} data-testid="input-name" />
              </div>
              <div>
                <label className={label}>Phone *</label>
                <Input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inp} data-testid="input-phone" />
              </div>
            </div>

            <div>
              <label className={label}>Email *</label>
              <Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inp} data-testid="input-email" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={label}>Property Type</label>
                <Select value={form.property_type} onValueChange={(v) => setForm({ ...form, property_type: v })}>
                  <SelectTrigger className={inp} data-testid="select-type"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#0f0f0f] border-white/10 text-white">
                    {["Apartment", "Villa", "Plot", "Commercial", "Any"].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className={label}>Location Preference</label>
                <Input value={form.location_preference} onChange={(e) => setForm({ ...form, location_preference: e.target.value })} className={inp} placeholder="e.g. Chennai South" data-testid="input-location" />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
              <div>
                <label className={label}>Min Budget</label>
                <Select value={form.budget_min} onValueChange={(v) => setForm({ ...form, budget_min: v })}>
                  <SelectTrigger className={inp} data-testid="select-min-budget"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#0f0f0f] border-white/10 text-white">
                    {["50L", "1Cr", "2Cr", "5Cr", "10Cr+"].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className={label}>Max Budget</label>
                <Select value={form.budget_max} onValueChange={(v) => setForm({ ...form, budget_max: v })}>
                  <SelectTrigger className={inp} data-testid="select-max-budget"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#0f0f0f] border-white/10 text-white">
                    {["50L", "1Cr", "2Cr", "5Cr", "10Cr+"].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={label}>Bedrooms</label>
                <Select value={form.bedrooms} onValueChange={(v) => setForm({ ...form, bedrooms: v })}>
                  <SelectTrigger className={inp} data-testid="select-bedrooms"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#0f0f0f] border-white/10 text-white">
                    {["1BHK", "2BHK", "3BHK", "4BHK+", "Not Applicable"].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className={label}>Purpose</label>
                <Select value={form.purpose} onValueChange={(v) => setForm({ ...form, purpose: v })}>
                  <SelectTrigger className={inp} data-testid="select-purpose"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#0f0f0f] border-white/10 text-white">
                    {["Self Use", "Investment", "Both"].map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className={label}>Additional Notes</label>
              <Textarea value={form.additional_notes} onChange={(e) => setForm({ ...form, additional_notes: e.target.value })} className={`${inp} h-24 resize-none`} placeholder="Any specific requirements..." data-testid="input-notes" />
            </div>
          </div>

          <Button type="submit" disabled={sending} className="w-full h-14 bg-gradient-to-r from-primary to-amber-500 hover:from-amber-400 hover:to-primary text-black font-bold tracking-[0.15em] text-sm rounded-none transition-all hover:shadow-[0_0_24px_rgba(255,140,0,0.3)]" data-testid="button-submit-request">
            {sending ? <Loader2 className="animate-spin" size={18} /> : "SUBMIT REQUEST"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
