import { useState } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      setError("Invalid credentials. Please try again.");
    } else {
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
      <div className="relative w-full max-w-sm">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/8 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative border border-white/[0.07] bg-white/[0.03] p-8 sm:p-10">
          <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          <div className="flex flex-col items-center mb-8">
            <img src="/ak-logo.png" alt="AK Group" className="h-12 w-auto mb-4 drop-shadow-[0_0_16px_rgba(255,140,0,0.5)]" />
            <p className="text-[10px] tracking-[0.3em] text-primary/70 uppercase">Admin Access</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] tracking-[0.2em] text-muted-foreground/60 uppercase">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="bg-white/[0.04] border-white/[0.08] focus-visible:ring-primary h-11 rounded-none text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] tracking-[0.2em] text-muted-foreground/60 uppercase">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="bg-white/[0.04] border-white/[0.08] focus-visible:ring-primary h-11 rounded-none text-sm"
              />
            </div>

            {error && (
              <p className="text-xs text-red-400 text-center">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-primary to-amber-500 text-black font-bold tracking-[0.15em] text-xs rounded-none border-0 mt-2 hover:shadow-[0_0_24px_rgba(255,140,0,0.3)] transition-all"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : "SIGN IN"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
