import { useState, type FormEvent } from "react";
import type { LoginPayload } from "@sniffles/types";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants";
import { authApi } from "../services/auth.api";
import { getDefaultRouteForRole } from "../utils/auth-routing";
import { useAuthStore } from "@/stores/auth.store";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((state) => state.setSession);

  const [form, setForm] = useState<LoginPayload>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen bg-[#ecf3f4] flex flex-col items-center justify-center p-4">
      {/* Centered Login Card */}
      <div className="w-full max-w-[540px] bg-white rounded-[32px] p-8 md:p-12 shadow-sm relative z-10">
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <img src="/images/logo.svg" alt="SnifflesHealth" className="h-10" />
        </div>

        {/* Heading Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1f2937] mb-2">Welcome Back</h1>
          <p className="text-sm text-[#4b5563]">Log in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email address Field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1f2937] px-1">Email</label>
            <div className="bg-white border border-[#d1d5db] rounded-xl p-3.5 focus-within:border-[#045866] transition-all">
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((current) => ({ ...current, email: e.target.value }))
                }
                placeholder="emailaddress@domain.com"
                required
                className="w-full bg-transparent border-none outline-none text-[#1f2937] text-sm"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-sm font-semibold text-[#1f2937]">Password</label>
              <Link to="#" className="text-xs font-bold text-[#0891b2] hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="flex items-center gap-3 bg-white border border-[#d1d5db] rounded-xl p-3.5 focus-within:border-[#045866] transition-all">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) =>
                  setForm((current) => ({ ...current, password: e.target.value }))
                }
                placeholder="********"
                required
                className="flex-1 bg-transparent border-none outline-none text-[#1f2937] text-sm"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#4b5563]">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-700 text-center bg-red-50 p-3 rounded-xl">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all transform active:scale-[0.98] ${
              isSubmitting ? "bg-[#d1d5db] cursor-not-allowed" : "bg-[#7baeb5] hover:bg-[#6a9ca3] shadow-sm"
            }`}
          >
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-[#4b5563]">
            New here?{" "}
            <Link to={ROUTES.SIGNUP} className="font-semibold text-[#0891b2] hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>

      {/* Decorative background patterns (Teal Plus Signs) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-5">
        <div className="absolute top-[10%] left-[5%] text-[200px] text-[#045866] font-thin">+</div>
        <div className="absolute top-[60%] left-[15%] text-[150px] text-[#045866] font-thin">+</div>
        <div className="absolute top-[20%] right-[10%] text-[180px] text-[#045866] font-thin">+</div>
        <div className="absolute top-[70%] right-[20%] text-[220px] text-[#045866] font-thin">+</div>
      </div>
    </div>
  );
}
