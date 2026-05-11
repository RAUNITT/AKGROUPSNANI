import { useState } from "react";
import { createProperty, updateProperty } from "@/lib/supabase";
import type { Property, PropertyAttribute } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Trash2, GripVertical, Youtube } from "lucide-react";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
}

type FormData = {
  title: string; slug: string; location: string; price: string; status: string;
  description: string; is_featured: boolean; display_order: number;
  images: string[]; youtube_url: string; attributes: PropertyAttribute[];
};

const STATUS_SUGGESTIONS = ["Available", "For Sale", "Launching Soon", "High Demand", "Sold Out", "Under Construction"];

export function PropertyForm({
  initial, onSave, onCancel,
}: {
  initial: Property | null;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<FormData>({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    location: initial?.location ?? "",
    price: initial?.price ?? "",
    status: initial?.status ?? "Available",
    description: initial?.description ?? "",
    is_featured: initial?.is_featured ?? true,
    display_order: initial?.display_order ?? 0,
    images: initial?.images?.length ? initial.images : [""],
    youtube_url: initial?.youtube_url ?? "",
    attributes: initial?.attributes?.length ? initial.attributes : [],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof FormData, val: unknown) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = {
        ...form,
        images: form.images.filter((u) => u.trim()),
        youtube_url: form.youtube_url.trim() || null,
        attributes: form.attributes.filter((a) => a.label.trim() && a.value.trim()),
      };
      if (initial) await updateProperty(initial.id, payload);
      else await createProperty(payload);
      onSave();
    } catch (err: any) {
      setError(err?.message ?? "Save failed. Check all required fields.");
    } finally {
      setSaving(false);
    }
  };

  // Images
  const setImage = (i: number, val: string) => {
    const imgs = [...form.images];
    imgs[i] = val;
    set("images", imgs);
  };
  const addImage = () => set("images", [...form.images, ""]);
  const removeImage = (i: number) => set("images", form.images.filter((_, j) => j !== i));

  // Attributes
  const setAttr = (i: number, key: keyof PropertyAttribute, val: string) => {
    const attrs = [...form.attributes];
    attrs[i] = { ...attrs[i], [key]: val };
    set("attributes", attrs);
  };
  const addAttr = () => set("attributes", [...form.attributes, { label: "", value: "" }]);
  const removeAttr = (i: number) => set("attributes", form.attributes.filter((_, j) => j !== i));

  const field = (label: string, children: React.ReactNode, hint?: string) => (
    <div className="space-y-1.5">
      <Label className="text-[10px] tracking-widest uppercase text-muted-foreground/60">{label}</Label>
      {children}
      {hint && <p className="text-[10px] text-muted-foreground/40">{hint}</p>}
    </div>
  );

  const inp = "bg-white/5 border-white/10 focus-visible:ring-primary rounded-none text-sm h-10";

  return (
    <form onSubmit={handleSubmit} className="space-y-5 pb-2">
      {/* Title + Slug */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field("Title *",
          <Input value={form.title} required className={inp}
            onChange={(e) => { set("title", e.target.value); if (!initial) set("slug", slugify(e.target.value)); }} />
        )}
        {field("URL Slug *",
          <Input value={form.slug} required className={inp}
            onChange={(e) => set("slug", e.target.value)} />,
          "e.g. zenith-residences → /property/zenith-residences"
        )}
      </div>

      {/* Location + Price */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field("Location *",
          <Input value={form.location} required className={inp} placeholder="Chennai, Tamil Nadu"
            onChange={(e) => set("location", e.target.value)} />
        )}
        {field("Price *",
          <Input value={form.price} required className={inp} placeholder="₹4.2 Cr onwards"
            onChange={(e) => set("price", e.target.value)} />
        )}
      </div>

      {/* Status + Display Order */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {field("Status *",
          <div className="space-y-1">
            <Input value={form.status} required className={inp} list="status-suggestions"
              onChange={(e) => set("status", e.target.value)} />
            <datalist id="status-suggestions">
              {STATUS_SUGGESTIONS.map((s) => <option key={s} value={s} />)}
            </datalist>
          </div>,
          "Free text — type any status"
        )}
        {field("Display Order",
          <Input type="number" value={form.display_order} className={inp} min={0}
            onChange={(e) => set("display_order", parseInt(e.target.value) || 0)} />,
          "Lower = shown first"
        )}
        <div className="space-y-1.5 flex flex-col justify-center">
          <Label className="text-[10px] tracking-widest uppercase text-muted-foreground/60">Featured on Homepage</Label>
          <div className="flex items-center gap-3 h-10">
            <Switch
              checked={form.is_featured}
              onCheckedChange={(v) => set("is_featured", v)}
              className="data-[state=checked]:bg-primary"
            />
            <span className="text-xs text-muted-foreground/60">{form.is_featured ? "Yes" : "No"}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      {field("Description",
        <Textarea value={form.description} rows={3}
          className="bg-white/5 border-white/10 focus-visible:ring-primary rounded-none text-sm resize-none"
          placeholder="A brief description of the property…"
          onChange={(e) => set("description", e.target.value)} />
      )}

      {/* Images */}
      <div className="space-y-2">
        <Label className="text-[10px] tracking-widest uppercase text-muted-foreground/60">Images (URLs)</Label>
        {form.images.map((url, i) => (
          <div key={i} className="flex gap-2">
            <Input
              value={url}
              placeholder={`https://… image ${i + 1}`}
              className={`${inp} flex-1`}
              onChange={(e) => setImage(i, e.target.value)}
            />
            {url && (
              <img src={url} className="w-10 h-10 object-cover border border-white/10 shrink-0" onError={(e) => (e.currentTarget.style.display = "none")} alt="" />
            )}
            {form.images.length > 1 && (
              <Button type="button" variant="ghost" size="icon" className="shrink-0 h-10 w-10 text-red-400/60 hover:text-red-400 hover:bg-red-400/10" onClick={() => removeImage(i)}>
                <Trash2 size={13} />
              </Button>
            )}
          </div>
        ))}
        <Button type="button" variant="ghost" size="sm" className="text-muted-foreground/60 hover:text-primary text-xs gap-1.5 px-0" onClick={addImage}>
          <Plus size={13} /> Add another image
        </Button>
      </div>

      {/* YouTube */}
      {field("YouTube Video URL",
        <div className="relative">
          <Youtube size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500/60" />
          <Input value={form.youtube_url} className={`${inp} pl-8`} placeholder="https://youtube.com/watch?v=..."
            onChange={(e) => set("youtube_url", e.target.value)} />
        </div>,
        "Appears as last slide in the property gallery"
      )}

      {/* Attributes */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-[10px] tracking-widest uppercase text-muted-foreground/60">Property Attributes</Label>
          <Button type="button" variant="ghost" size="sm" className="text-muted-foreground/60 hover:text-primary text-xs gap-1.5 h-7 px-2" onClick={addAttr}>
            <Plus size={12} /> Add field
          </Button>
        </div>
        {form.attributes.length === 0 && (
          <p className="text-[11px] text-muted-foreground/40 py-2">No attributes yet. Add fields like "Land Size", "Bedrooms", "Type", etc.</p>
        )}
        {form.attributes.map((attr, i) => (
          <div key={i} className="flex gap-2 items-center">
            <GripVertical size={14} className="text-muted-foreground/20 shrink-0" />
            <Input
              value={attr.label}
              placeholder="Label (e.g. Land Size)"
              className={`${inp} flex-1`}
              onChange={(e) => setAttr(i, "label", e.target.value)}
            />
            <Input
              value={attr.value}
              placeholder="Value (e.g. 5,000 sq.ft)"
              className={`${inp} flex-1`}
              onChange={(e) => setAttr(i, "value", e.target.value)}
            />
            <Button type="button" variant="ghost" size="icon" className="shrink-0 h-10 w-10 text-red-400/60 hover:text-red-400 hover:bg-red-400/10" onClick={() => removeAttr(i)}>
              <Trash2 size={13} />
            </Button>
          </div>
        ))}
      </div>

      {error && <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 px-3 py-2">{error}</p>}

      <div className="flex gap-3 pt-2 border-t border-white/[0.07]">
        <Button type="button" variant="ghost" onClick={onCancel} className="text-muted-foreground text-xs">
          Cancel
        </Button>
        <Button type="submit" disabled={saving} className="bg-primary text-black hover:bg-amber-400 rounded-none text-xs tracking-wider flex-1">
          {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
          {saving ? "Saving…" : initial ? "Update Property" : "Create Property"}
        </Button>
      </div>
    </form>
  );
}
