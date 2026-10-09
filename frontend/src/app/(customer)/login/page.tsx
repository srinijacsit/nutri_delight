"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ShoppingBag } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/menu");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="bg-card p-10 rounded-[2rem] border border-border shadow-xl w-full max-w-md relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent pointer-events-none" />
        <div className="relative mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 ring-8 ring-primary/5">
          <ShoppingBag className="w-10 h-10 text-primary" />
        </div>
        <h1 className="relative text-3xl font-extrabold text-foreground mb-3 tracking-tight text-center">Welcome Back</h1>
        <p className="relative text-base text-foreground/60 mb-10 leading-relaxed text-center">Sign in to your account to continue</p>
        
        {error && (
          <div className="bg-destructive/10 text-destructive text-sm font-bold p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="relative space-y-6">
          <div>
            <label className="block text-sm font-bold text-foreground/80 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-xl border border-border bg-background py-4 px-5 text-foreground font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-foreground/80 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-xl border border-border bg-background py-4 px-5 text-foreground font-medium focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="relative w-full flex items-center justify-center rounded-full bg-primary px-8 py-5 text-lg font-bold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
