"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await createClient().auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setError(error.message);
    router.replace("/admin");
    router.refresh();
  }

  return (
    <div className="container-x grid min-h-[70vh] place-items-center py-16">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl ring-1 ring-black/5">
        <h1 className="text-3xl">Admin sign in</h1>
        <p className="mt-1 text-sm text-muted">Manage Alley Properties listings.</p>
        <label className="mt-6 block text-sm font-medium">Email</label>
        <input className="input mt-1" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <label className="mt-4 block text-sm font-medium">Password</label>
        <input className="input mt-1" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="mt-3 text-sm text-sold">{error}</p>}
        <button disabled={loading} className="mt-6 w-full rounded-full bg-forest py-3 text-sm font-semibold text-cream disabled:opacity-60">
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
