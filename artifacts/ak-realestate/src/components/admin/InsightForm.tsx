import { useState } from "react";
import { createInsight, uploadInsightImage } from "@/lib/supabase";
import type { Insight } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Image as ImageIcon } from "lucide-react";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
}

export function InsightForm({ onSave, onCancel }: { onSave: () => void; onCancel: () => void; }) {
  const [form, setForm] = useState({
    title: "", slug: "", category: "Market Trends", excerpt: "", content: "", image_url: ""
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await createInsight({
        ...form,
        published_at: new Date().toISOString()
      });
      onSave();
    } catch (err: any) {
      setError(err?.message ?? "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadInsightImage(file);
      setForm((f) => ({ ...f, image_url: url }));
    } catch (err: any) {
      setError("Image upload failed: " + (err?.message || ""));
    } finally {
      setUploading(false);
    }
  };

  const inp = "bg-white/5 border-white/10 focus-visible:ring-primary rounded-none text-sm";
  const label = "text-[10px] tracking-widest uppercase text-muted-foreground/60";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className={label}>Title</Label>
          <Input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value, slug: slugify(e.target.value) })} className={inp} />
        </div>
        <div>
          <Label className={label}>Slug</Label>
          <Input required value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className={inp} />
        </div>
      </div>
      <div>
        <Label className={label}>Category</Label>
        <Input required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={inp} />
      </div>
      <div>
        <Label className={label}>Excerpt</Label>
        <Textarea value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} className={`${inp} resize-none h-16`} />
      </div>
      <div>
        <Label className={label}>Content</Label>
        <Textarea required value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className={`${inp} resize-none h-40`} />
      </div>
      <div>
        <Label className={label}>Image URL</Label>
        <div className="flex gap-2 items-center">
          <Input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} className={inp} />
          <div className="relative">
            <Button type="button" variant="outline" disabled={uploading} className="border-white/10 bg-white/5 h-10 w-10 p-0">
              {uploading ? <Loader2 className="animate-spin" size={14} /> : <ImageIcon size={14} />}
            </Button>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
          </div>
        </div>
        {form.image_url && <img src={form.image_url} alt="" className="mt-2 h-20 object-cover border border-white/10" />}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} className="text-xs">Cancel</Button>
        <Button type="submit" disabled={saving || uploading} className="bg-primary text-black text-xs">
          {saving ? "Saving..." : "Add Insight"}
        </Button>
      </div>
    </form>
  );
}