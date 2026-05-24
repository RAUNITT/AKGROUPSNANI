import { useState } from "react";
import { createProperty, updateProperty } from "@/lib/supabase";
import type { Property, PropertyAttribute } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Trash2, GripVertical, Video, ExternalLink, Copy, Check } from "lucide-react";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
}

function detectVideoProvider(url: string): string | null {
  if (!url.trim()) return null;
  if (/youtube\.com|youtu\.be/.test(url)) return "YouTube";
  if (/vimeo\.com/.test(url)) return "Vimeo";
  if (/cloudinary\.com/.test(url)) return "Cloudinary";
  if (/\.(mp4|webm|mov|m4v|ogg)(\?|$)/i.test(url)) return "Direct Video";
  return null;
}

type FormData = {
  title: string; slug: string; location: string; price: string; status: string;
  description: string; is_featured: boolean; display_order: number;
  images: string[]; youtube_url: string; attributes: PropertyAttribute[];
};

const STATUS_SUGGESTIONS = ["Available", "For Sale", "Launching Soon", "Pre-Launch", "High Demand", "Under Construction", "Ready to Move", "Sold Out"];

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
  const [slugCopied, setSlugCopied] = useState(false);

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

  const copySlug = () => {
    const url = `${window.location.origin}/property/${form.slug}`;
    navigator.clipboard.writeText(url).then(() => {
      setSlugCopied(true);
      setTimeout(() => setSlugCopied(false), 2000);
    });
  };

  // Images
  const setImage = (i: number, val: string) => {
    const imgs = [...form.images]; imgs[i] = val; set("images", imgs);
  };
  const addImage = () => set("images", [...form.images, ""]);
  const removeImage = (i: number) => set("images", form.images.filter((_, j) => j !== i));
  const moveImage = (from: number, to: number) => {
    const imgs = [...form.images];
    const [moved] = imgs.splice(from, 1);
    imgs.splice(to, 0, moved);
    set("images", imgs);
  };

  // Attributes
  const setAttr = (i: number, key: keyof PropertyAttribute, val: string) => {
    const attrs = [...form.attributes]; attrs[i] = { ...attrs[i], [key]: val }; set("attributes", attrs);
  };
  const addAttr = () => set("attributes", [...form.attributes, { label: "", value: "" }]);
  const removeAttr = (i: number) => set("attributes", form.attributes.filter((_, j) => j !== i));

  const field = (label: string, children: React.ReactNode, hint?: string) => (
    <div className="space-y-1.5">
      <Label className="text-[10px] tracking-widest uppercase text-muted-foreground/60">{label}</Label>
      {children}
      {hint && <p className="text-[10px] text-muted-foreground/35">{hint}</p>}
    </div>
  );

  const inp = "bg-white/5 border-white/10 focus-visible:ring-primary rounded-none text-sm h-10";
  const videoProvider = detectVideoProvider(form.youtube_url);

  return (
    <form onSubmit={handleSubmit} className="space-y-5 pb-2">
      {/* Title + Slug */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {field("Title *",
          <Input value={form.title} required className={inp}
            onChange={(e) => { set("title", e.target.value); if (!initial) set("slug", slugify(e.target.value)); }} />
        )}
        {field("URL Slug *",
          <div className="flex gap-2">
            <Input value={form.slug} required className={`${inp} flex-1`}
              onChange={(e) => set("slug", e.target.value)} />
            {form.slug && (
              <Button type="button" variant="ghost" size="icon" className="h-10 w-10 shrink-0 text-muted-foreground/40 hover:text-primary" title="Copy property URL" onClick={copySlug}>
                {slugCopied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              </Button>
            )}
          </div>,
          form.slug ? `/property/${form.slug}` : "Auto-generated from title"
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

      {/* Status + Display Order + Featured */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {field("Status *",
          <div className="space-y-1">
            <Input value={form.status} required className={inp} list="status-suggestions"
              onChange={(e) => set("status", e.target.value)} />
            <datalist id="status-suggestions">
              {STATUS_SUGGESTIONS.map((s) => <option key={s} value={s} />)}
            </datalist>
          </div>,
          "Free text — type any label"
        )}
        {field("Display Order",
          <Input type="number" value={form.display_order} className={inp} min={0}
            onChange={(e) => set("display_order", parseInt(e.target.value) || 0)} />,
          "Lower = shown first"
        )}
        <div className="space-y-1.5 flex flex-col justify-center">
          <Label className="text-[10px] tracking-widest uppercase text-muted-foreground/60">Featured</Label>
          <div className="flex items-center gap-3 h-10">
            <Switch
              checked={form.is_featured}
              onCheckedChange={(v) => set("is_featured", v)}
              className="data-[state=checked]:bg-primary"
            />
            <span className="text-xs text-muted-foreground/50">{form.is_featured ? "Shown on homepage" : "Hidden from homepage"}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      {field("Description",
        <Textarea value={form.description} rows={4}
          className="bg-white/5 border-white/10 focus-visible:ring-primary rounded-none text-sm resize-none"
          placeholder="A brief description of the property…"
          onChange={(e) => set("description", e.target.value)} />
      )}

      {/* Images */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-[10px] tracking-widest uppercase text-muted-foreground/60">Images (URLs)</Label>
          <span className="text-[10px] text-muted-foreground/35">Drag to reorder</span>
        </div>
        {form.images.map((url, i) => (
          <div key={i} className="flex gap-2 items-center">
            <div className="flex flex-col gap-0.5 shrink-0">
              <button type="button" disabled={i === 0} onClick={() => moveImage(i, i - 1)}
                className="text-muted-foreground/25 hover:text-muted-foreground/60 disabled:opacity-20 text-[10px] leading-none px-0.5">▲</button>
              <button type="button" disabled={i === form.images.length - 1} onClick={() => moveImage(i, i + 1)}
                className="text-muted-foreground/25 hover:text-muted-foreground/60 disabled:opacity-20 text-[10px] leading-none px-0.5">▼</button>
            </div>
            <span className="text-[10px] text-muted-foreground/30 w-4 text-center shrink-0">{i + 1}</span>
            <Input
              value={url}
              placeholder={`https://… image ${i + 1}`}
              className={`${inp} flex-1`}
              onChange={(e) => setImage(i, e.target.value)}
            />
            {url && (
              <img src={url} className="w-10 h-10 object-cover border border-white/10 shrink-0" onError={(e) => (e.currentTarget.style.display = "none")} alt="" />
            )}
            {url && (
              <a href={url} target="_blank" rel="noopener noreferrer" className="shrink-0 text-muted-foreground/30 hover:text-primary transition-colors">
                <ExternalLink size={12} />
              </a>
            )}
            {form.images.length > 1 && (
              <Button type="button" variant="ghost" size="icon" className="shrink-0 h-10 w-10 text-red-400/50 hover:text-red-400 hover:bg-red-400/10" onClick={() => removeImage(i)}>
                <Trash2 size={12} />
              </Button>
            )}
          </div>
        ))}
        <Button type="button" variant="ghost" size="sm" className="text-muted-foreground/50 hover:text-primary text-xs gap-1.5 px-0" onClick={addImage}>
          <Plus size={12} /> Add image URL
        </Button>
      </div>

      {/* Video URL */}
      {field("Video URL",
        <div className="space-y-1.5">
          <div className="relative">
            <Video size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
            <Input value={form.youtube_url} className={`${inp} pl-8`}
              placeholder="YouTube, Vimeo, Cloudinary, or direct .mp4 URL"
              onChange={(e) => set("youtube_url", e.target.value)} />
            {videoProvider && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] tracking-widest text-primary/70 uppercase">
                {videoProvider}
              </span>
            )}
          </div>
          {form.youtube_url && !videoProvider && (
            <p className="text-[10px] text-amber-400/70">Unsupported format — accepts YouTube, Vimeo, Cloudinary, or .mp4/.webm URLs</p>
          )}
        </div>,
        "Shown as last slide in property gallery"
      )}

      {/* Attributes */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-[10px] tracking-widest uppercase text-muted-foreground/60">Property Attributes</Label>
          <Button type="button" variant="ghost" size="sm" className="text-muted-foreground/50 hover:text-primary text-xs gap-1.5 h-7 px-2" onClick={addAttr}>
            <Plus size={12} /> Add field
          </Button>
        </div>
        {form.attributes.length === 0 && (
          <p className="text-[11px] text-muted-foreground/35 py-2">
            No attributes yet. Add fields like "Bedrooms", "Land Size", "Type", "BHK", etc.
          </p>
        )}
        {form.attributes.map((attr, i) => (
          <div key={i} className="flex gap-2 items-center">
            <GripVertical size={13} className="text-muted-foreground/15 shrink-0" />
            <Input
              value={attr.label}
              placeholder="Label (e.g. Bedrooms)"
              className={`${inp} flex-1`}
              onChange={(e) => setAttr(i, "label", e.target.value)}
            />
            <Input
              value={attr.value}
              placeholder="Value (e.g. 4 BHK)"
              className={`${inp} flex-1`}
              onChange={(e) => setAttr(i, "value", e.target.value)}
            />
            <Button type="button" variant="ghost" size="icon" className="shrink-0 h-10 w-10 text-red-400/50 hover:text-red-400 hover:bg-red-400/10" onClick={() => removeAttr(i)}>
              <Trash2 size={12} />
            </Button>
          </div>
        ))}
      </div>

      {error && <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 px-3 py-2">{error}</p>}

      <div className="flex gap-3 pt-2 border-t border-white/[0.06]">
        <Button type="button" variant="ghost" onClick={onCancel} className="text-muted-foreground/50 text-xs">
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
