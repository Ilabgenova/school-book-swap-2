import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Check, Archive, Plus, ShieldAlert, Loader2 } from "lucide-react";
import { BookImportPanel } from "@/components/admin/BookImportPanel";
import { UsersPanel as UsersModerationPanel } from "@/components/admin/UsersPanel";
import { ModerationPanel } from "@/components/admin/ModerationPanel";
import { ReuseReviewPanel } from "@/components/admin/ReuseReviewPanel";

type Listing = {
  id: string; title: string; subject: string | null; price: number; status: string;
  seller_id: string; created_at: string; program: string | null; class_year: string | null;
  isbn: string | null; condition: string; school_year: string;
};
type AmazonLink = {
  id: string; title: string; isbn: string | null; amazon_url: string | null;
  affiliate_url: string | null; status: string; grade: string | null; program: string | null;
};
type CatalogBook = {
  id: string; title: string; subject: string | null; grade: string; program: string;
  school_year: string; isbn: string | null; is_sellable: boolean; publisher: string | null;
};
type UserRole = { id: string; user_id: string; role: string; created_at: string };

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) navigate("/login?next=/admin");
  }, [authLoading, user, navigate]);

  if (authLoading || adminLoading) {
    return (
      <MainLayout>
        <div className="container py-16 flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>
      </MainLayout>
    );
  }

  if (!isAdmin) {
    return (
      <MainLayout>
        <div className="container py-16 max-w-lg mx-auto text-center">
          <ShieldAlert className="h-12 w-12 mx-auto text-destructive mb-4" />
          <h1 className="text-2xl font-bold mb-2">Access denied</h1>
          <p className="text-muted-foreground">This area is reserved for DISbook admins.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold font-display">Admin dashboard</h1>
          <p className="text-muted-foreground text-sm">Moderation & housekeeping for DISbook</p>
        </div>
        <Tabs defaultValue="listings">
          <TabsList className="grid grid-cols-3 md:grid-cols-7 w-full md:w-auto">
            <TabsTrigger value="listings">Listings</TabsTrigger>
            <TabsTrigger value="import">Book import</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="moderation">Moderation</TabsTrigger>
            <TabsTrigger value="amazon">Amazon</TabsTrigger>
            <TabsTrigger value="catalog">Catalog</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
          </TabsList>
          <TabsContent value="listings" className="mt-6"><ListingsPanel /></TabsContent>
          <TabsContent value="import" className="mt-6"><BookImportPanel /></TabsContent>
          <TabsContent value="users" className="mt-6"><UsersModerationPanel /></TabsContent>
          <TabsContent value="moderation" className="mt-6"><ModerationPanel /></TabsContent>
          <TabsContent value="amazon" className="mt-6"><AmazonPanel /></TabsContent>
          <TabsContent value="catalog" className="mt-6"><CatalogPanel /></TabsContent>
          <TabsContent value="roles" className="mt-6"><UsersPanel /></TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

/* ---------- Listings moderation ---------- */
const ListingsPanel = () => {
  const [items, setItems] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  const load = async () => {
    setLoading(true);
    let q = supabase.from("listings").select("*").order("created_at", { ascending: false }).limit(200);
    if (filter !== "all") q = q.eq("status", filter as any);
    const { data, error } = await q;
    if (error) toast.error(error.message); else setItems((data as any) || []);
    setLoading(false);
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [filter]);

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("listings").update({ status: status as any }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Marked ${status}`); load();
  };
  const remove = async (id: string) => {
    if (!confirm("Permanently delete this listing?")) return;
    const { error } = await supabase.from("listings").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); load();
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending_review">Pending review</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="sold">Sold</SelectItem>
            <SelectItem value="reserved">Reserved</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={load}>Refresh</Button>
      </div>
      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
        <div className="space-y-3">
          {items.length === 0 && <p className="text-sm text-muted-foreground">No listings.</p>}
          {items.map(l => (
            <Card key={l.id} className="p-4 flex flex-col md:flex-row gap-3 md:items-center justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium truncate">{l.title}</p>
                  <Badge variant="outline">{l.status}</Badge>
                  {l.program && <Badge variant="secondary">{l.program} {l.class_year}</Badge>}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  €{l.price} · {l.condition} · {l.school_year} · ISBN {l.isbn || "—"}
                </p>
                <p className="text-[11px] text-muted-foreground">Seller: {l.seller_id.slice(0, 8)}… · {new Date(l.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {l.status !== "active" && (
                  <Button size="sm" variant="outline" onClick={() => setStatus(l.id, "active")}><Check className="h-4 w-4 mr-1" />Approve</Button>
                )}
                {l.status !== "archived" && (
                  <Button size="sm" variant="outline" onClick={() => setStatus(l.id, "archived")}><Archive className="h-4 w-4 mr-1" />Archive</Button>
                )}
                <Button size="sm" variant="destructive" onClick={() => remove(l.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

/* ---------- Amazon links ---------- */
const AmazonPanel = () => {
  const [items, setItems] = useState<AmazonLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", isbn: "", amazon_url: "", affiliate_url: "", status: "coming_soon" });

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("amazon_links").select("*").order("created_at", { ascending: false }).limit(300);
    if (error) toast.error(error.message); else setItems((data as any) || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.title.trim()) return toast.error("Title required");
    const { error } = await supabase.from("amazon_links").insert({
      title: form.title, isbn: form.isbn || null, amazon_url: form.amazon_url || null,
      affiliate_url: form.affiliate_url || null, status: form.status as any,
    });
    if (error) return toast.error(error.message);
    toast.success("Added"); setForm({ title: "", isbn: "", amazon_url: "", affiliate_url: "", status: "coming_soon" }); load();
  };
  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("amazon_links").update({ status: status as any }).eq("id", id);
    if (error) return toast.error(error.message); load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this Amazon link?")) return;
    const { error } = await supabase.from("amazon_links").delete().eq("id", id);
    if (error) return toast.error(error.message); load();
  };

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <p className="font-medium mb-3 flex items-center gap-2"><Plus className="h-4 w-4" />Add Amazon link</p>
        <div className="grid md:grid-cols-2 gap-3">
          <Input placeholder="Book title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <Input placeholder="ISBN" value={form.isbn} onChange={e => setForm({ ...form, isbn: e.target.value })} />
          <Input placeholder="Amazon URL" value={form.amazon_url} onChange={e => setForm({ ...form, amazon_url: e.target.value })} />
          <Input placeholder="Affiliate URL" value={form.affiliate_url} onChange={e => setForm({ ...form, affiliate_url: e.target.value })} />
          <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="coming_soon">Coming soon</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="not_available">Not available</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={add}>Add</Button>
        </div>
      </Card>

      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
        <div className="space-y-2">
          {items.map(a => (
            <Card key={a.id} className="p-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="font-medium truncate">{a.title}</p>
                <p className="text-xs text-muted-foreground">ISBN {a.isbn || "—"} · {a.status}</p>
              </div>
              <div className="flex gap-2">
                <Select value={a.status} onValueChange={v => setStatus(a.id, v)}>
                  <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="coming_soon">Coming soon</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="not_available">Not available</SelectItem>
                  </SelectContent>
                </Select>
                <Button size="sm" variant="destructive" onClick={() => remove(a.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </Card>
          ))}
          {items.length === 0 && <p className="text-sm text-muted-foreground">No Amazon links yet.</p>}
        </div>
      )}
    </div>
  );
};

/* ---------- Book catalog ---------- */
const CatalogPanel = () => {
  const [items, setItems] = useState<CatalogBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", subject: "", program: "MYP", grade: "", school_year: "2025-2026", isbn: "", publisher: "", is_sellable: true });

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("book_catalog").select("*").order("school_year", { ascending: false }).order("grade").limit(500);
    if (error) toast.error(error.message); else setItems((data as any) || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.title || !form.grade) return toast.error("Title & grade required");
    const { error } = await supabase.from("book_catalog").insert({
      title: form.title, subject: form.subject || null, program: form.program, grade: form.grade,
      school_year: form.school_year, isbn: form.isbn || null, publisher: form.publisher || null,
      is_sellable: form.is_sellable,
    });
    if (error) return toast.error(error.message);
    toast.success("Added"); load();
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this catalog entry?")) return;
    const { error } = await supabase.from("book_catalog").delete().eq("id", id);
    if (error) return toast.error(error.message); load();
  };

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <p className="font-medium mb-3 flex items-center gap-2"><Plus className="h-4 w-4" />Add catalog entry</p>
        <div className="grid md:grid-cols-2 gap-3">
          <Input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <Input placeholder="Subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
          <Select value={form.program} onValueChange={v => setForm({ ...form, program: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="MYP">MYP</SelectItem>
              <SelectItem value="DP">DP</SelectItem>
              <SelectItem value="PYP">PYP</SelectItem>
            </SelectContent>
          </Select>
          <Input placeholder="Grade (e.g. MYP1, DP2)" value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })} />
          <Input placeholder="School year (e.g. 2025-2026)" value={form.school_year} onChange={e => setForm({ ...form, school_year: e.target.value })} />
          <Input placeholder="ISBN" value={form.isbn} onChange={e => setForm({ ...form, isbn: e.target.value })} />
          <Input placeholder="Publisher" value={form.publisher} onChange={e => setForm({ ...form, publisher: e.target.value })} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_sellable} onChange={e => setForm({ ...form, is_sellable: e.target.checked })} />
            Sellable (can be listed used)
          </label>
          <Button onClick={add}>Add</Button>
        </div>
      </Card>

      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
        <div className="space-y-2">
          {items.map(b => (
            <Card key={b.id} className="p-3 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="font-medium truncate">{b.title}</p>
                <p className="text-xs text-muted-foreground">
                  {b.program} {b.grade} · {b.subject || "—"} · {b.school_year} · ISBN {b.isbn || "—"} {b.is_sellable ? "" : "· not sellable"}
                </p>
              </div>
              <Button size="sm" variant="destructive" onClick={() => remove(b.id)}><Trash2 className="h-4 w-4" /></Button>
            </Card>
          ))}
          {items.length === 0 && <p className="text-sm text-muted-foreground">Catalog empty.</p>}
        </div>
      )}
    </div>
  );
};

/* ---------- Users / roles ---------- */
const UsersPanel = () => {
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<Record<string, { first_name: string; last_name: string }>>({});

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("user_roles").select("*").order("created_at", { ascending: false });
    if (error) { toast.error(error.message); setLoading(false); return; }
    setRoles((data as any) || []);
    const ids = Array.from(new Set((data || []).map((r: any) => r.user_id)));
    if (ids.length) {
      const { data: prof } = await supabase.from("profiles").select("user_id, first_name, last_name").in("user_id", ids);
      const map: Record<string, any> = {};
      (prof || []).forEach((p: any) => { map[p.user_id] = p; });
      setProfiles(map);
    }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4">
        Role assignment is done server-side for safety. Send new admin/moderator requests to the DISbook owner.
      </p>
      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
        <div className="space-y-2">
          {roles.map(r => {
            const p = profiles[r.user_id];
            return (
              <Card key={r.id} className="p-3 flex items-center justify-between">
                <div>
                  <p className="font-medium">{p ? `${p.first_name} ${p.last_name}` : r.user_id.slice(0, 8) + "…"}</p>
                  <p className="text-xs text-muted-foreground">{r.user_id}</p>
                </div>
                <Badge variant={r.role === "admin" ? "default" : "secondary"}>{r.role}</Badge>
              </Card>
            );
          })}
          {roles.length === 0 && <p className="text-sm text-muted-foreground">No role assignments.</p>}
        </div>
      )}
    </div>
  );
};

export default Admin;
