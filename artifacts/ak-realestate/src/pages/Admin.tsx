import { useState, useEffect } from "react";
import {
  useAdminListProperties,
  useAdminDeleteProperty,
  useAdminCreateProperty,
  useAdminListContacts,
  useGetSettings,
  useUpdateSettings,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, ArrowLeft } from "lucide-react";

const BLANK_PROPERTY = {
  title: "",
  slug: "",
  location: "",
  price: "",
  sqft: "",
  status: "AVAILABLE" as "AVAILABLE" | "LAUNCHING SOON" | "SOLD OUT",
  image: "",
  description: "",
  isFeatured: true,
};

export default function Admin() {
  const { toast } = useToast();
  const {
    data: properties,
    isLoading: loadingProps,
    refetch: refetchProps,
  } = useAdminListProperties();
  const { data: contacts, isLoading: loadingContacts } = useAdminListContacts();
  const {
    data: settings,
    isLoading: loadingSettings,
    refetch: refetchSettings,
  } = useGetSettings();

  const deleteProperty = useAdminDeleteProperty();
  const createProperty = useAdminCreateProperty();
  const updateSettings = useUpdateSettings();

  const [showCreate, setShowCreate] = useState(false);
  const [newProp, setNewProp] = useState(BLANK_PROPERTY);

  const [settingsForm, setSettingsForm] = useState({
    officeAddress: "",
    phone: "",
    email: "",
    whatsappNumber: "",
  });

  useEffect(() => {
    if (settings) {
      setSettingsForm({
        officeAddress: settings.officeAddress,
        phone: settings.phone,
        email: settings.email,
        whatsappNumber: settings.whatsappNumber,
      });
    }
  }, [settings]);

  const handleDeleteProperty = async (id: number) => {
    if (confirm("Are you sure you want to delete this property?")) {
      deleteProperty.mutate(
        { id },
        {
          onSuccess: () => {
            toast({ title: "Property deleted" });
            refetchProps();
          },
          onError: () => {
            toast({ title: "Delete failed", variant: "destructive" });
          },
        }
      );
    }
  };

  const handleCreateProperty = (e: React.FormEvent) => {
    e.preventDefault();
    createProperty.mutate(
      { data: newProp },
      {
        onSuccess: () => {
          toast({ title: "Property created" });
          setShowCreate(false);
          setNewProp(BLANK_PROPERTY);
          refetchProps();
        },
        onError: () => {
          toast({ title: "Create failed", variant: "destructive" });
        },
      }
    );
  };

  const handleUpdateSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings.mutate(
      { data: settingsForm },
      {
        onSuccess: () => {
          toast({ title: "Settings updated" });
          refetchSettings();
        },
        onError: () => {
          toast({ title: "Update failed", variant: "destructive" });
        },
      }
    );
  };

  const slugify = (title: string) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 sm:mb-10">
          <a
            href="/"
            className="text-muted-foreground/50 hover:text-primary transition-colors"
          >
            <ArrowLeft size={18} />
          </a>
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-wide">
              Admin Dashboard
            </h1>
            <p className="text-xs text-muted-foreground/40 tracking-widest mt-0.5 uppercase">
              AK Group of Real Estate
            </p>
          </div>
        </div>

        <Tabs defaultValue="properties" className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10 h-auto p-1 gap-1">
            <TabsTrigger
              value="properties"
              className="data-[state=active]:bg-primary data-[state=active]:text-black text-xs tracking-wider uppercase"
            >
              Properties
            </TabsTrigger>
            <TabsTrigger
              value="contacts"
              className="data-[state=active]:bg-primary data-[state=active]:text-black text-xs tracking-wider uppercase"
            >
              Contacts
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-primary data-[state=active]:text-black text-xs tracking-wider uppercase"
            >
              Site Settings
            </TabsTrigger>
          </TabsList>

          {/* PROPERTIES TAB */}
          <TabsContent value="properties">
            <Card className="bg-white/[0.03] border-white/10 text-white">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-serif text-lg">
                  Manage Properties
                </CardTitle>
                <Button
                  size="sm"
                  className="bg-primary text-black hover:bg-amber-400 rounded-none text-xs tracking-wider"
                  onClick={() => setShowCreate(true)}
                >
                  <Plus size={14} className="mr-2" /> Add Property
                </Button>
              </CardHeader>
              <CardContent>
                {loadingProps ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-primary" />
                  </div>
                ) : properties?.length === 0 ? (
                  <p className="text-center py-12 text-muted-foreground/50 text-sm">
                    No properties yet. Add one above.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/10 hover:bg-white/5">
                          <TableHead className="text-muted-foreground text-xs">
                            Title
                          </TableHead>
                          <TableHead className="text-muted-foreground text-xs hidden sm:table-cell">
                            Location
                          </TableHead>
                          <TableHead className="text-muted-foreground text-xs hidden md:table-cell">
                            Price
                          </TableHead>
                          <TableHead className="text-muted-foreground text-xs">
                            Status
                          </TableHead>
                          <TableHead className="text-muted-foreground text-xs text-right">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {properties?.map((prop: any) => (
                          <TableRow
                            key={prop.id}
                            className="border-white/10 hover:bg-white/5"
                          >
                            <TableCell className="font-medium text-sm">
                              {prop.title}
                            </TableCell>
                            <TableCell className="text-sm hidden sm:table-cell text-muted-foreground">
                              {prop.location}
                            </TableCell>
                            <TableCell className="text-sm hidden md:table-cell text-muted-foreground">
                              {prop.price}
                            </TableCell>
                            <TableCell>
                              <span
                                className={`text-[10px] tracking-wider px-2 py-0.5 border ${
                                  prop.status === "AVAILABLE"
                                    ? "text-emerald-400 border-emerald-400/30 bg-emerald-400/10"
                                    : prop.status === "LAUNCHING SOON"
                                    ? "text-primary border-primary/30 bg-primary/10"
                                    : "text-foreground/40 border-foreground/20"
                                }`}
                              >
                                {prop.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-400 hover:text-red-300 hover:bg-red-400/10 h-8 w-8"
                                onClick={() => handleDeleteProperty(prop.id)}
                              >
                                <Trash2 size={14} />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* CONTACTS TAB */}
          <TabsContent value="contacts">
            <Card className="bg-white/[0.03] border-white/10 text-white">
              <CardHeader>
                <CardTitle className="font-serif text-lg">
                  Contact Submissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingContacts ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-primary" />
                  </div>
                ) : contacts?.length === 0 ? (
                  <p className="text-center py-12 text-muted-foreground/50 text-sm">
                    No submissions yet.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/10">
                          <TableHead className="text-muted-foreground text-xs">
                            Name
                          </TableHead>
                          <TableHead className="text-muted-foreground text-xs hidden sm:table-cell">
                            Email
                          </TableHead>
                          <TableHead className="text-muted-foreground text-xs hidden md:table-cell">
                            Phone
                          </TableHead>
                          <TableHead className="text-muted-foreground text-xs hidden lg:table-cell">
                            Message
                          </TableHead>
                          <TableHead className="text-muted-foreground text-xs">
                            Date
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {contacts?.map((c: any) => (
                          <TableRow
                            key={c.id}
                            className="border-white/10 hover:bg-white/5"
                          >
                            <TableCell className="text-sm font-medium">
                              {c.firstName} {c.lastName}
                            </TableCell>
                            <TableCell className="text-sm hidden sm:table-cell text-muted-foreground">
                              {c.email}
                            </TableCell>
                            <TableCell className="text-sm hidden md:table-cell text-muted-foreground">
                              {c.phone}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell text-sm text-muted-foreground max-w-xs truncate">
                              {c.message}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground/60">
                              {new Date(c.createdAt).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* SETTINGS TAB */}
          <TabsContent value="settings">
            <Card className="bg-white/[0.03] border-white/10 text-white">
              <CardHeader>
                <CardTitle className="font-serif text-lg">
                  Site Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingSettings ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-primary" />
                  </div>
                ) : (
                  <form
                    onSubmit={handleUpdateSettings}
                    className="space-y-5 max-w-lg"
                  >
                    <div className="space-y-2">
                      <Label className="text-xs tracking-widest uppercase text-muted-foreground">
                        Office Address
                      </Label>
                      <Input
                        value={settingsForm.officeAddress}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            officeAddress: e.target.value,
                          })
                        }
                        className="bg-white/5 border-white/10 focus-visible:ring-primary rounded-none"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs tracking-widest uppercase text-muted-foreground">
                          Phone
                        </Label>
                        <Input
                          value={settingsForm.phone}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              phone: e.target.value,
                            })
                          }
                          className="bg-white/5 border-white/10 focus-visible:ring-primary rounded-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs tracking-widest uppercase text-muted-foreground">
                          Email
                        </Label>
                        <Input
                          value={settingsForm.email}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              email: e.target.value,
                            })
                          }
                          className="bg-white/5 border-white/10 focus-visible:ring-primary rounded-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs tracking-widest uppercase text-muted-foreground">
                        WhatsApp Number
                      </Label>
                      <Input
                        value={settingsForm.whatsappNumber}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            whatsappNumber: e.target.value,
                          })
                        }
                        className="bg-white/5 border-white/10 focus-visible:ring-primary rounded-none"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="bg-primary text-black hover:bg-amber-400 rounded-none text-xs tracking-wider"
                      disabled={updateSettings.isPending}
                    >
                      {updateSettings.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Save Settings
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* CREATE PROPERTY DIALOG */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="bg-[#0d0d0d] border-white/10 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              Add New Property
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateProperty}>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label className="text-xs tracking-widest uppercase text-muted-foreground">
                  Title *
                </Label>
                <Input
                  value={newProp.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setNewProp({
                      ...newProp,
                      title,
                      slug: slugify(title),
                    });
                  }}
                  required
                  placeholder="The Zenith Residences"
                  className="bg-white/5 border-white/10 focus-visible:ring-primary rounded-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs tracking-widest uppercase text-muted-foreground">
                    Slug *
                  </Label>
                  <Input
                    value={newProp.slug}
                    onChange={(e) =>
                      setNewProp({ ...newProp, slug: e.target.value })
                    }
                    required
                    placeholder="zenith-residences"
                    className="bg-white/5 border-white/10 focus-visible:ring-primary rounded-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs tracking-widest uppercase text-muted-foreground">
                    Status *
                  </Label>
                  <Select
                    value={newProp.status}
                    onValueChange={(v) =>
                      setNewProp({
                        ...newProp,
                        status: v as typeof newProp.status,
                      })
                    }
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 focus:ring-primary rounded-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111] border-white/10 text-white">
                      <SelectItem value="AVAILABLE">Available</SelectItem>
                      <SelectItem value="LAUNCHING SOON">
                        Launching Soon
                      </SelectItem>
                      <SelectItem value="SOLD OUT">Sold Out</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs tracking-widest uppercase text-muted-foreground">
                  Location *
                </Label>
                <Input
                  value={newProp.location}
                  onChange={(e) =>
                    setNewProp({ ...newProp, location: e.target.value })
                  }
                  required
                  placeholder="Chennai, Tamil Nadu"
                  className="bg-white/5 border-white/10 focus-visible:ring-primary rounded-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs tracking-widest uppercase text-muted-foreground">
                    Price *
                  </Label>
                  <Input
                    value={newProp.price}
                    onChange={(e) =>
                      setNewProp({ ...newProp, price: e.target.value })
                    }
                    required
                    placeholder="₹4.2 Cr onwards"
                    className="bg-white/5 border-white/10 focus-visible:ring-primary rounded-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs tracking-widest uppercase text-muted-foreground">
                    Sq.Ft *
                  </Label>
                  <Input
                    value={newProp.sqft}
                    onChange={(e) =>
                      setNewProp({ ...newProp, sqft: e.target.value })
                    }
                    required
                    placeholder="3200"
                    className="bg-white/5 border-white/10 focus-visible:ring-primary rounded-none"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs tracking-widest uppercase text-muted-foreground">
                  Image URL *
                </Label>
                <Input
                  value={newProp.image}
                  onChange={(e) =>
                    setNewProp({ ...newProp, image: e.target.value })
                  }
                  required
                  placeholder="https://..."
                  className="bg-white/5 border-white/10 focus-visible:ring-primary rounded-none"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs tracking-widest uppercase text-muted-foreground">
                  Description
                </Label>
                <Textarea
                  value={newProp.description}
                  onChange={(e) =>
                    setNewProp({ ...newProp, description: e.target.value })
                  }
                  placeholder="A brief description of the property..."
                  className="bg-white/5 border-white/10 focus-visible:ring-primary rounded-none resize-none min-h-[70px]"
                />
              </div>
            </div>
            <DialogFooter className="mt-4 gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowCreate(false)}
                className="text-muted-foreground"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary text-black hover:bg-amber-400 rounded-none text-xs tracking-wider"
                disabled={createProperty.isPending}
              >
                {createProperty.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Property
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
