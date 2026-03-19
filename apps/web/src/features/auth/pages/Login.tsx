import { useState, type FormEvent } from "react";
import type { LoginPayload } from "@sniffles/types";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authApi } from "../services/auth.api";
import { getDefaultRouteForRole } from "../utils/auth-routing";
import { useAuthStore } from "@/stores/auth.store";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((state) => state.setSession);

  const [form, setForm] = useState<LoginPayload>({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo =
    typeof location.state?.from === "string" ? location.state.from : null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await authApi.login({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      setSession(response);
      navigate(redirectTo ?? getDefaultRouteForRole(response.user.role), {
        replace: true,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to log in");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#ecf7f8_0%,#fcfaf8_45%,#ffffff_100%)] px-4 py-16">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[32px] bg-[#123b42] p-8 text-white shadow-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-100">SnifflesHealth</p>
          <h1 className="mt-6 max-w-md text-4xl font-semibold leading-tight">
            Secure telehealth access for patients and physicians.
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-6 text-cyan-50/90">
            Use your email and password to access your role-based workspace. Doctors
            are redirected to the physician panel, patients to their dashboard.
          </p>
        </div>

        <Card className="border-white/70 bg-white/90">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Access your SnifflesHealth account.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Email</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, email: event.target.value }))
                  }
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Password</label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, password: event.target.value }))
                  }
                  placeholder="Minimum 8 characters"
                  required
                />
              </div>

              {error ? <p className="text-sm text-red-700">{error}</p> : null}

              <Button className="w-full" disabled={isSubmitting} type="submit">
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </form>

            <p className="mt-6 text-sm text-text-secondary">
              New here?{" "}
              <Link className="font-medium text-brand-cyan hover:underline" to={ROUTES.SIGNUP}>
                Create your account
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
