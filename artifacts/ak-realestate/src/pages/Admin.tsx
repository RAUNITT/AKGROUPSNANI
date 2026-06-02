import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { supabase, getAllProperties, deleteProperty, getContacts, getSettings, updateSettings, getInsights, deleteInsight, uploadInsightImage, createInsight, updateInsight, getPropertyRequests } from "@/lib/supabase";
import type { Property, SiteSettings, Insight, PropertyRequest } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, Pencil, ArrowLeft, LogOut } from "lucide-react";
import { PropertyForm } from "@/components/admin/PropertyForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InsightForm } from "@/components/admin/InsightForm";

export default function Admin() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Auth guard
  const [authChecked, setAuthChecked] = useState(false);
  const [session, setSession] = useState<any>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate("/admin/login");
      else { setSession(data.session); setAuthChecked(true); }
    });
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  // Properties
  const [properties, setProperties] = useState<Property[]>([]);
  const [loadingProps, setLoadingProps] = useState(true);
  const loadProperties = () => {
    setLoadingProps(true);
    getAllProperties().then(setProperties).finally(() => setLoadingProps(false));
  };
  useEffect(() => { if (authChecked) loadProperties(); }, [authChecked]);

  // Form dialog
  const [formOpen, setFormOpen] = useState(false);
  const [editProp, setEditProp] = useState<Property | null>(null);
  const openCreate = () => { setEditProp(null); setFormOpen(true); };
  const openEdit = (p: Property) => { setEditProp(p); setFormOpen(true); };
  const onFormSave = () => { setFormOpen(false); loadProperties(); toast({ title: editProp ? "Property updated" : "Property created" }); };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await deleteProperty(id);
      toast({ title: "Property deleted" });
      loadProperties();
    } catch { toast({ title: "Delete failed", variant: "destructive" }); }
  };

  // Insights
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const loadInsights = () => {
    setLoadingInsights(true);
    getInsights().then(setInsights).finally(() => setLoadingInsights(false));
  };

  const [insightFormOpen, setInsightFormOpen] = useState(false);
  const [editInsight, setInsightProp] = useState<Insight | null>(null);

  const openInsightCreate = () => { setInsightProp(null); setInsightFormOpen(true); };
  const openInsightEdit = (i: Insight) => { setInsightProp(i); setInsightFormOpen(true); };

  const handleInsightDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await deleteInsight(id);
      toast({ title: "Insight deleted" });
      loadInsights();
    } catch { toast({ title: "Delete failed", variant: "destructive" }); }
  };

  // Property Requests
  const [requests, setRequests] = useState<PropertyRequest[]>([]);
  const [loadingReqs, setLoadingReqs] = useState(false);
  const loadRequests = () => {
    setLoadingReqs(true);
    getPropertyRequests().then(setRequests).finally(() => setLoadingReqs(false));
  };

  const [contacts, setContacts] = useState<any[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const loadContacts = () => {
    setLoadingContacts(true);
    getContacts().then(setContacts).finally(() => setLoadingContacts(false));
  };

  // Settings
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [settingsForm, setSettingsForm] = useState({ phone: "", email: "", whatsapp: "", office_address: "", stat_projects: 500, stat_years: 20, stat_cities: 4, stat_families: 10000 });
  const [savingSettings, setSavingSettings] = useState(false);
  const loadSettingsData = () => {
    getSettings().then((s) => {
      if (s) { setSettings(s); setSettingsForm({ phone: s.phone, email: s.email, whatsapp: s.whatsapp, office_address: s.office_address, stat_projects: s.stat_projects ?? 500, stat_years: s.stat_years ?? 20, stat_cities: s.stat_cities ?? 4, stat_families: s.stat_families ?? 10000 }); }
    });
  };
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await updateSettings(settingsForm);
      toast({ title: "Settings saved" });
      loadSettingsData();
    } catch { toast({ title: "Save failed", variant: "destructive" }); }
    finally { setSavingSettings(false); }
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={28} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <div className="flex items-center gap-4">
            <a href="/" className="text-muted-foreground/50 hover:text-primary transition-colors">
              <ArrowLeft size={18} />
            </a>
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-wide">Admin Dashboard</h1>
              <p className="text-[10px] text-muted-foreground/40 tracking-widest uppercase mt-0.5">
                {session?.user?.email}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-muted-foreground/50 hover:text-red-400 text-xs gap-2">
            <LogOut size={14} /> Sign Out
          </Button>
        </div>

        <Tabs defaultValue="properties" className="space-y-6" onValueChange={(v) => { if (v === "contacts") loadContacts(); if (v === "settings" || v === "stats") loadSettingsData(); if (v === "insights") loadInsights(); if (v === "requests") loadRequests(); }}>
          <TabsList className="bg-white/5 border border-white/10 h-auto p-1 gap-1 w-full sm:w-auto flex flex-wrap">
            {["properties", "insights", "requests", "contacts", "stats", "settings"].map((t) => (
              <TabsTrigger key={t} value={t} className="data-[state=active]:bg-primary data-[state=active]:text-black text-[11px] tracking-wider uppercase flex-1 sm:flex-none">
                {t}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ── PROPERTIES ─────────────────── */}
          <TabsContent value="properties">
            <div className="border border-white/[0.07] bg-white/[0.03]">
              <div className="flex items-center justify-between px-5 sm:px-7 py-5 border-b border-white/[0.07]">
                <h2 className="font-serif text-lg">Properties <span className="text-muted-foreground/40 text-sm font-sans ml-2">{properties.length}</span></h2>
                <Button size="sm" onClick={openCreate} className="bg-primary text-black hover:bg-amber-400 rounded-none text-xs tracking-wider gap-1.5">
                  <Plus size={14} /> Add Property
                </Button>
              </div>

              {loadingProps ? (
                <div className="flex justify-center py-16"><Loader2 className="animate-spin text-primary" /></div>
              ) : properties.length === 0 ? (
                <p className="text-center py-16 text-muted-foreground/40 text-sm">No properties yet. Add one to get started.</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/[0.07] hover:bg-transparent">
                        {["Title", "Location", "Price", "Status", "Featured", ""].map((h) => (
                          <TableHead key={h} className="text-muted-foreground/50 text-[10px] tracking-widest uppercase">{h}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {properties.map((p) => (
                        <TableRow key={p.id} className="border-white/[0.05] hover:bg-white/[0.02]">
                          <TableCell className="font-medium text-sm max-w-[180px] truncate">{p.title}</TableCell>
                          <TableCell className="text-muted-foreground text-sm hidden sm:table-cell">{p.location}</TableCell>
                          <TableCell className="text-muted-foreground text-sm hidden md:table-cell">{p.price}</TableCell>
                          <TableCell>
                            <span className="text-[9px] tracking-widest px-2 py-0.5 border border-primary/30 text-primary bg-primary/10">{p.status}</span>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <span className={`text-[9px] ${p.is_featured ? "text-emerald-400" : "text-muted-foreground/40"}`}>
                              {p.is_featured ? "✓ Yes" : "No"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-white/10" onClick={() => openEdit(p)}>
                                <Pencil size={13} />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400/70 hover:text-red-400 hover:bg-red-400/10" onClick={() => handleDelete(p.id, p.title)}>
                                <Trash2 size={13} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* ── INSIGHTS ─────────────────── */}
          <TabsContent value="insights">
            <div className="border border-white/[0.07] bg-white/[0.03]">
              <div className="flex items-center justify-between px-5 sm:px-7 py-5 border-b border-white/[0.07]">
                <h2 className="font-serif text-lg">Insights <span className="text-muted-foreground/40 text-sm font-sans ml-2">{insights.length}</span></h2>
                <Button size="sm" onClick={openInsightCreate} className="bg-primary text-black hover:bg-amber-400 rounded-none text-xs tracking-wider gap-1.5">
                  <Plus size={14} /> Add Insight
                </Button>
              </div>

              {loadingInsights ? (
                <div className="flex justify-center py-16"><Loader2 className="animate-spin text-primary" /></div>
              ) : insights.length === 0 ? (
                <p className="text-center py-16 text-muted-foreground/40 text-sm">No insights yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/[0.07] hover:bg-transparent">
                        {["Title", "Category", "Date", ""].map((h) => (
                          <TableHead key={h} className="text-muted-foreground/50 text-[10px] tracking-widest uppercase">{h}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {insights.map((ins) => (
                        <TableRow key={ins.id} className="border-white/[0.05] hover:bg-white/[0.02]">
                          <TableCell className="font-medium text-sm max-w-[300px] truncate">{ins.title}</TableCell>
                          <TableCell className="text-muted-foreground text-sm hidden sm:table-cell">{ins.category}</TableCell>
                          <TableCell className="text-muted-foreground text-xs">{new Date(ins.published_at).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400/70 hover:text-red-400 hover:bg-red-400/10" onClick={() => handleInsightDelete(ins.id, ins.title)}>
                                <Trash2 size={13} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* ── REQUESTS ───────────────────── */}
          <TabsContent value="requests">
            <div className="border border-white/[0.07] bg-white/[0.03]">
              <div className="px-5 sm:px-7 py-5 border-b border-white/[0.07]">
                <h2 className="font-serif text-lg">Property Requests</h2>
              </div>
              {loadingReqs ? (
                <div className="flex justify-center py-16"><Loader2 className="animate-spin text-primary" /></div>
              ) : requests.length === 0 ? (
                <p className="text-center py-16 text-muted-foreground/40 text-sm">No requests yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/[0.07] hover:bg-transparent">
                        {["Name", "Phone", "Type", "Location", "Budget", "Purpose", "Date"].map((h) => (
                          <TableHead key={h} className="text-muted-foreground/50 text-[10px] tracking-widest uppercase">{h}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requests.map((r) => (
                        <TableRow key={r.id} className="border-white/[0.05] hover:bg-white/[0.02]">
                          <TableCell className="text-sm font-medium">{r.name}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{r.phone}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{r.property_type}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{r.location_preference}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{r.budget_min} - {r.budget_max}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{r.purpose}</TableCell>
                          <TableCell className="text-xs text-muted-foreground/50">{r.created_at ? new Date(r.created_at).toLocaleDateString() : ""}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* ── CONTACTS ───────────────────── */}
          <TabsContent value="contacts">
            <div className="border border-white/[0.07] bg-white/[0.03]">
              <div className="px-5 sm:px-7 py-5 border-b border-white/[0.07]">
                <h2 className="font-serif text-lg">Contact Submissions</h2>
              </div>
              {loadingContacts ? (
                <div className="flex justify-center py-16"><Loader2 className="animate-spin text-primary" /></div>
              ) : contacts.length === 0 ? (
                <p className="text-center py-16 text-muted-foreground/40 text-sm">No submissions yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/[0.07] hover:bg-transparent">
                        {["Name", "Email", "Phone", "Message", "Date"].map((h) => (
                          <TableHead key={h} className="text-muted-foreground/50 text-[10px] tracking-widest uppercase">{h}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contacts.map((c) => (
                        <TableRow key={c.id} className="border-white/[0.05] hover:bg-white/[0.02]">
                          <TableCell className="text-sm font-medium">{c.first_name} {c.last_name}</TableCell>
                          <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">{c.email}</TableCell>
                          <TableCell className="text-sm text-muted-foreground hidden md:table-cell">{c.phone}</TableCell>
                          <TableCell className="text-sm text-muted-foreground max-w-xs truncate hidden lg:table-cell">{c.message}</TableCell>
                          <TableCell className="text-xs text-muted-foreground/50">{new Date(c.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </TabsContent>

          {/* ── STATS ───────────────────── */}
          <TabsContent value="stats">
            <div className="border border-white/[0.07] bg-white/[0.03] p-5 sm:p-8 max-w-lg">
              <h2 className="font-serif text-lg mb-6">Homepage Stats</h2>
              <form onSubmit={handleSaveSettings} className="space-y-5">
                {[
                  { key: "stat_projects", label: "Projects Delivered", type: "number" },
                  { key: "stat_years", label: "Years of Trust", type: "number" },
                  { key: "stat_cities", label: "Cities", type: "number" },
                  { key: "stat_families", label: "Happy Families", type: "number" },
                ].map(({ key, label, type }) => (
                  <div key={key} className="space-y-1.5">
                    <Label className="text-[10px] tracking-widest uppercase text-muted-foreground/60">{label}</Label>
                    <Input
                      type={type}
                      value={settingsForm[key as keyof typeof settingsForm]}
                      onChange={(e) => setSettingsForm({ ...settingsForm, [key]: Number(e.target.value) })}
                      className="bg-white/5 border-white/10 focus-visible:ring-primary rounded-none"
                    />
                  </div>
                ))}
                <Button type="submit" disabled={savingSettings} className="bg-primary text-black hover:bg-amber-400 rounded-none text-xs tracking-wider mt-2">
                  {savingSettings && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                  Save Stats
                </Button>
              </form>
            </div>
          </TabsContent>

          {/* ── SETTINGS ───────────────────── */}
          <TabsContent value="settings">
            <div className="border border-white/[0.07] bg-white/[0.03] p-5 sm:p-8 max-w-lg">
              <h2 className="font-serif text-lg mb-6">Site Settings</h2>
              <form onSubmit={handleSaveSettings} className="space-y-5">
                {[
                  { key: "office_address", label: "Office Address" },
                  { key: "phone", label: "Phone Number" },
                  { key: "email", label: "Email Address" },
                  { key: "whatsapp", label: "WhatsApp Number (with country code, no +)" },
                ].map(({ key, label }) => (
                  <div key={key} className="space-y-1.5">
                    <Label className="text-[10px] tracking-widest uppercase text-muted-foreground/60">{label}</Label>
                    <Input
                      value={settingsForm[key as keyof typeof settingsForm]}
                      onChange={(e) => setSettingsForm({ ...settingsForm, [key]: e.target.value })}
                      className="bg-white/5 border-white/10 focus-visible:ring-primary rounded-none"
                    />
                  </div>
                ))}
                <Button type="submit" disabled={savingSettings} className="bg-primary text-black hover:bg-amber-400 rounded-none text-xs tracking-wider mt-2">
                  {savingSettings && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                  Save Settings
                </Button>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Property Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="bg-[#0d0d0d] border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">{editProp ? "Edit Property" : "Add New Property"}</DialogTitle>
          </DialogHeader>
          <PropertyForm initial={editProp} onSave={onFormSave} onCancel={() => setFormOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Insight Form Dialog */}
      <Dialog open={insightFormOpen} onOpenChange={setInsightFormOpen}>
        <DialogContent className="bg-[#0d0d0d] border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Add New Insight</DialogTitle>
          </DialogHeader>
          <InsightForm onSave={() => { setInsightFormOpen(false); loadInsights(); toast({ title: "Insight created" }); }} onCancel={() => setInsightFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
