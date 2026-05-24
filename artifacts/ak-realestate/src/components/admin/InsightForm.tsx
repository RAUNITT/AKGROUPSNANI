import { useState } from "react";
import { createPost, updatePost } from "@/lib/supabase";
import type { BlogPost } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, ExternalLink } from "lucide-react";

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
}

const CATEGORIES = ["Market Update", "Tips & Advice", "Investment", "Design", "News"];

type FormData = {
  title: string; slug: string; excerpt: string; content: string;
  image_url: string; category: string; author: string; is_published: boolean;
};

export function InsightForm({
  initial, onSave, onCancel,
}: {
  initial: BlogPost | null;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<FormData>({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    excerpt: initial?.excerpt ?? "",
    content: initial?.content ?? "",
    image_url: initial?.image_url ?? "",
    category: initial?.category ?? "News",
    author: initial?.author ?? "AK Group Editorial",
    is_published: initial?.is_published ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof FormData, val: unknown) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = { ...form, image_url: form.image_url.trim() || null, excerpt: form.excerpt.trim() || null, content: form.content.trim() || null };
      if (initial) await updatePost(initial.id, payload);
      else await createPost(payload);
      onSave();
    } catch (err: any) {
      setError(err?.message ?? "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const inp = "bg-white/5 border-white/10 focus-visible:ring-primary rounded-none text-sm h-10";

  const field = (label: string, children: React.ReactNode, hint?: string) => (
    <div className="space-y-1.5">
      <Label className="text-[10px] tracking-widest uppercase text-muted-foreground/60">{label}</Label>
      {children}
      {hint && <p className="text-[10px] text-muted-foreground/35">{hint}</p>}
    </div>
  );

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
          form.slug ? `/insights/${form.slug}` : "Auto-generated from title"
        )}
      </div>

      {/* Category + Author */}
      <div className="grid grid-cols-2 gap-4">
        {field("Category",
          <div className="space-y-1">
            <Input value={form.category} className={inp} list="category-list"
              onChange={(e) => set("category", e.target.value)} />
            <datalist id="category-list">
              {CATEGORIES.map((c) => <option key={c} value={c} />)}
            </datalist>
          </div>
        )}
        {field("Author",
          <Input value={form.author} className={inp}
            onChange={(e) => set("author", e.target.value)} />
        )}
      </div>

      {/* Cover image URL */}
      {field("Cover Image URL",
        <div className="flex gap-2 items-center">
          <Input value={form.image_url} className={`${inp} flex-1`} placeholder="https://…"
            onChange={(e) => set("image_url", e.target.value)} />
          {form.image_url && (
            <>
              <img src={form.image_url} className="w-10 h-10 object-cover border border-white/10 shrink-0"
                onError={(e) => (e.currentTarget.style.display = "none")} alt="" />
              <a href={form.image_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground/30 hover:text-primary transition-colors shrink-0">
                <ExternalLink size={12} />
              </a>
            </>
          )}
        </div>
      )}

      {/* Excerpt */}
      {field("Excerpt",
        <Textarea value={form.excerpt} rows={2}
          className="bg-white/5 border-white/10 focus-visible:ring-primary rounded-none text-sm resize-none"
          placeholder="A one-sentence summary shown in the article listing…"
          onChange={(e) => set("excerpt", e.target.value)} />,
        "Shown on the Insights listing page"
      )}

      {/* Content */}
      {field("Article Content",
        <Textarea value={form.content} rows={12}
          className="bg-white/5 border-white/10 focus-visible:ring-primary rounded-none text-sm resize-y"
          placeholder="Write the full article here. Separate paragraphs with a blank line."
          onChange={(e) => set("content", e.target.value)} />,
        "Separate paragraphs with a blank line (double newline)"
      )}

      {/* Published toggle */}
      <div className="flex items-center gap-3 pt-1">
        <Switch
          checked={form.is_published}
          onCheckedChange={(v) => set("is_published", v)}
          className="data-[state=checked]:bg-primary"
        />
        <span className="text-xs text-muted-foreground/50">
          {form.is_published ? "Published — visible on Insights page" : "Draft — hidden from public"}
        </span>
      </div>

      {error && <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 px-3 py-2">{error}</p>}

      <div className="flex gap-3 pt-2 border-t border-white/[0.06]">
        <Button type="button" variant="ghost" onClick={onCancel} className="text-muted-foreground/50 text-xs">Cancel</Button>
        <Button type="submit" disabled={saving} className="bg-primary text-black hover:bg-amber-400 rounded-none text-xs tracking-wider flex-1">
          {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
          {saving ? "Saving…" : initial ? "Update Article" : "Publish Article"}
        </Button>
      </div>
    </form>
  );
}
