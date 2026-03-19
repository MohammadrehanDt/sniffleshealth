import { useMemo, useState, type FormEvent } from "react";
import type { UserRole } from "@sniffles/types";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authApi } from "../services/auth.api";
import { getDefaultRouteForRole } from "../utils/auth-routing";
import { useAuthStore } from "@/stores/auth.store";

type SignupStep = "email" | "otp" | "password";

export default function SignupPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);

  const [step, setStep] = useState<SignupStep>("email");
  const [role, setRole] = useState<UserRole>("PATIENT");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stepIndex = useMemo(() => {
    return step === "email" ? 1 : step === "otp" ? 2 : 3;
  }, [step]);

  async function handleEmailStep(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      const response = await authApi.requestOtp({ email: normalizedEmail, role });
      setEmail(normalizedEmail);
      setDevOtp(response.otpCode ?? null);
      setStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send OTP");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleOtpStep(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await authApi.verifyOtp({ email, otp: otp.trim() });
      setStep("password");
    } catch (err) {
      setError(err instanceof Error ? err.message : "OTP verification failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handlePasswordStep(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await authApi.completeSignup({
        email,
        otp: otp.trim(),
        password,
      });
      setSession(response);
      navigate(getDefaultRouteForRole(response.user.role), { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to complete signup");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#d8f0f3_0%,#fcfaf8_50%,#ffffff_100%)] px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <Card className="rounded-[28px] border-white/80 bg-white/95 shadow-2xl">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Create account</CardTitle>
                <CardDescription>
                  Email, OTP, then password. Minimal now, extensible for full onboarding.
                </CardDescription>
              </div>
              <div className="rounded-full bg-brand-cyan-light px-4 py-2 text-sm font-medium text-brand-cyan-dark">
                Step {stepIndex} of 3
              </div>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-brand-cyan-light">
              <div
                className="h-full rounded-full bg-brand-cyan transition-all"
                style={{ width: `${(stepIndex / 3) * 100}%` }}
              />
            </div>
          </CardHeader>
          <CardContent>
            {step === "email" ? (
              <form className="space-y-4" onSubmit={handleEmailStep}>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary">Role</label>
                  <div className="grid gap-3 md:grid-cols-2">
                    {(["PATIENT", "DOCTOR"] as const).map((option) => (
                      <button
                        key={option}
                        className={`rounded-2xl border p-4 text-left transition ${
                          role === option
                            ? "border-brand-cyan bg-brand-cyan-lightest"
                            : "border-border-color-medium bg-white"
                        }`}
                        onClick={() => setRole(option)}
                        type="button"
                      >
                        <p className="font-semibold text-text-primary">
                          {option === "PATIENT" ? "Patient" : "Physician"}
                        </p>
                        <p className="mt-1 text-sm text-text-secondary">
                          {option === "PATIENT"
                            ? "Personal consultations and follow-ups"
                            : "Review incoming consultations and approve care"}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary">Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                {error ? <p className="text-sm text-red-700">{error}</p> : null}

                <Button className="w-full" disabled={isSubmitting} type="submit">
                  {isSubmitting ? "Sending OTP..." : "Continue"}
                </Button>
              </form>
            ) : null}

            {step === "otp" ? (
              <form className="space-y-4" onSubmit={handleOtpStep}>
                <div className="rounded-2xl border border-brand-cyan-light bg-brand-cyan-lightest p-4">
                  <p className="text-sm text-brand-cyan-dark">
                    OTP sent to <span className="font-semibold">{email}</span>.
                  </p>
                  {devOtp ? (
                    <p className="mt-2 text-sm text-brand-cyan-dark">
                      Dev OTP: <span className="font-semibold tracking-[0.3em]">{devOtp}</span>
                    </p>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary">One-time password</label>
                  <Input
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(event) => setOtp(event.target.value)}
                    placeholder="6-digit OTP"
                    required
                  />
                </div>

                {error ? <p className="text-sm text-red-700">{error}</p> : null}

                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    disabled={isSubmitting}
                    type="button"
                    variant="outline"
                    onClick={() => setStep("email")}
                  >
                    Back
                  </Button>
                  <Button className="flex-1" disabled={isSubmitting} type="submit">
                    {isSubmitting ? "Verifying..." : "Verify OTP"}
                  </Button>
                </div>
              </form>
            ) : null}

            {step === "password" ? (
              <form className="space-y-4" onSubmit={handlePasswordStep}>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary">Password</label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="At least 8 characters"
                    required
                  />
                </div>

                {error ? <p className="text-sm text-red-700">{error}</p> : null}

                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    disabled={isSubmitting}
                    type="button"
                    variant="outline"
                    onClick={() => setStep("otp")}
                  >
                    Back
                  </Button>
                  <Button className="flex-1" disabled={isSubmitting} type="submit">
                    {isSubmitting ? "Creating account..." : "Create account"}
                  </Button>
                </div>
              </form>
            ) : null}

            <p className="mt-6 text-sm text-text-secondary">
              Already registered?{" "}
              <Link className="font-medium text-brand-cyan hover:underline" to={ROUTES.LOGIN}>
                Go to login
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
