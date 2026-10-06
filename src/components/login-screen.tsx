import { useState, type FormEvent } from "react";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Warehouse } from "lucide-react";

export function LoginScreen() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onProvider(providerId: string) {
    setError(null);
    try {
      await signIn(providerId, { callbackURL: "/" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
    }
  }

  async function onEmail(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "up") {
        const { error: signUpError } = await authClient.signUp.email({
          name: name.trim() || email.split("@")[0] || "Teammate",
          email: email.trim(),
          password,
          callbackURL: "/",
        });
        if (signUpError) throw new Error(signUpError.message);
      } else {
        const { error: signInError } = await authClient.signIn.email({
          email: email.trim(),
          password,
          callbackURL: "/",
        });
        if (signInError) throw new Error(signInError.message);
      }
      window.location.href = "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not continue.");
      setBusy(false);
    }
  }

  return (
    <main className="relative min-h-dvh bg-bg px-5 py-10 pb-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-primary/10" />
      <div className="relative mx-auto w-full max-w-md pt-4 sm:pt-10">
        <div className="mb-8 flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-lg bg-primary text-primary-fg">
            <Warehouse className="size-5" />
          </span>
          <div>
            <p className="font-display text-2xl font-medium tracking-tight">Stockroom</p>
            <p className="text-sm text-muted">Shared inventory for the shop</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5 shadow-soft sm:p-6">
          <h1 className="font-display text-xl font-medium tracking-tight">
            {mode === "in" ? "Sign in" : "Create account"}
          </h1>
          <p className="mt-1 text-sm text-muted">
            Everyone on the team sees the same stock. Actions are logged by name.
          </p>

          {authEnabled ? (
            <div className="mt-5 space-y-3">
              {GROK_PROVIDERS.map((provider) => (
                <Button
                  key={provider.providerId}
                  type="button"
                  variant="secondary"
                  className="w-full"
                  onClick={() => void onProvider(provider.providerId)}
                >
                  Continue with {provider.label}
                </Button>
              ))}

              <div className="flex items-center gap-3 py-1">
                <span className="h-px flex-1 bg-border" />
                <span className="text-xs tracking-wide text-subtle uppercase">or email</span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <form className="space-y-3" onSubmit={(event) => void onEmail(event)}>
                {mode === "up" ? (
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      autoComplete="name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Your name"
                    />
                  </div>
                ) : null}
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@shop.com"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete={mode === "up" ? "new-password" : "current-password"}
                    required
                    minLength={8}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="At least 8 characters"
                  />
                </div>
                {error ? <p className="text-sm text-loss">{error}</p> : null}
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy
                    ? "Working…"
                    : mode === "in"
                      ? "Sign in with email"
                      : "Create account"}
                </Button>
              </form>

              <button
                type="button"
                className="flex h-11 w-full items-center justify-center text-sm text-muted hover:text-fg"
                onClick={() => {
                  setMode(mode === "in" ? "up" : "in");
                  setError(null);
                }}
              >
                {mode === "in"
                  ? "Need an account? Create one"
                  : "Already have an account? Sign in"}
              </button>
            </div>
          ) : (
            <p className="mt-5 text-sm text-muted">Sign-in is disabled.</p>
          )}
        </div>
      </div>
    </main>
  );
}
