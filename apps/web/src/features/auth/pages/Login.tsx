import { useMemo, useState, type FormEvent } from "react";
import type { UserRole } from "@sniffles/types";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants";
import { authApi } from "../services/auth.api";
import { getDefaultRouteForRole } from "../utils/auth-routing";
import { useAuthStore } from "@/stores/auth.store";
import { Eye, EyeOff } from "lucide-react";

// Reusable Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/common/FormField";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((state) => state.setSession);

  const [role, setRole] = useState<UserRole>("patient");
  
  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Validation and UI states
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo =
    typeof location.state?.from === "string" ? location.state.from : null;

  // Validation functions
  const validateEmail = (email: string) => {
    if (!email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Must be a valid email format";
    return "";
  };

  const validatePassword = (pass: string) => {
    if (!pass) return "Password is required";
    if (pass.length < 8) return "Password must be at least 8 characters";
    return "";
  };

  // Real-time validation handlers
  const handleEmailChange = (val: string) => {
    setEmail(val);
    setErrors(prev => ({ ...prev, email: validateEmail(val) }));
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    setErrors(prev => ({ ...prev, password: validatePassword(val) }));
  };

  const isFormValid = useMemo(() => {
    const emErr = validateEmail(email);
    const pwErr = validatePassword(password);
    return !emErr && !pwErr && email && password;
  }, [email, password]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isFormValid) return;

    setApiError("");
    setIsSubmitting(true);

    try {
      const response = await authApi.login({
        email: email.trim().toLowerCase(),
        password,
        role,
      });
      setSession(response);
      navigate(redirectTo ?? getDefaultRouteForRole(response.user.role), {
        replace: true,
      });
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setApiError("");
    // We retain email and password as per criteria "Form retains values if submission fails" 
    // though here it's just role switch.
  };

  // Helper for background logos matching Signup styling
  const BackgroundLogo = ({ style }: { style: React.CSSProperties }) => (
    <img 
      src="/images/Vector.png" 
      alt="" 
      className="fixed pointer-events-none select-none z-0"
      style={{
        width: "437.7px",
        height: "445px",
        transform: "rotate(45deg)",
        opacity: 0.1,
        ...style
      }}
    />
  );

  return (
    <div className="min-h-screen bg-[#ecf3f4] flex items-center justify-center p-4 overflow-auto font-inter relative">
      {/* Decorative background patterns */}
      <BackgroundLogo style={{ top: "-200px", left: "-200px" }} />
      <BackgroundLogo style={{ top: "250px", left: "-200px" }} />
      <BackgroundLogo style={{ bottom: "-200px", left: "-200px" }} />
      <BackgroundLogo style={{ top: "-200px", right: "-200px" }} />
      <BackgroundLogo style={{ top: "250px", right: "-200px" }} />
      <BackgroundLogo style={{ bottom: "-200px", right: "-200px" }} />

      <div className="w-[416px] bg-white rounded-[8px] p-[24px] shadow-sm relative z-10 flex flex-col gap-[24px]">
        <div className="flex justify-center h-[33px]">
          <div className="w-[95.71px] h-[33px] flex items-center justify-center">
            <img src="/images/logo.svg" alt="SnifflesHealth" className="w-full h-full object-contain" />
          </div>
        </div>

        <div className="w-full flex flex-col items-center justify-center gap-[8px]">
          <h1 className="font-medium text-[#1B2B2E] text-[24px] leading-[1.2] text-center m-0">
            Welcome Back
          </h1>
          <p className="font-normal text-[#4A5E63] text-[14px] leading-[1.2] text-center m-0">
            Log in to your account
          </p>
        </div>

        {/* Role Switcher */}
        <div className="w-[368px] h-[57px] flex border-[1px] border-[#D7E1E4] rounded-[8px] p-[8px] gap-[8px] bg-[#FFFFFF] mx-auto items-center">
          <button
            onClick={() => handleRoleChange("patient")}
            className={`w-[172px] h-[41px] rounded-[8px] transition-all flex items-center justify-center ${
              role === "patient" 
                ? "bg-[#146D75] text-white shadow-sm" 
                : "bg-[#E8F4F5] text-[#146D75]"
            }`}
          >
            <span className="font-medium text-[14px] leading-[1.2] text-center whitespace-nowrap">
              Patient
            </span>
          </button>
          <button
            onClick={() => handleRoleChange("doctor")}
            className={`w-[172px] h-[41px] rounded-[8px] transition-all flex items-center justify-center ${
              role === "doctor" 
                ? "bg-[#146D75] text-white shadow-sm" 
                : "bg-[#E8F4F5] text-[#146D75]"
            }`}
          >
            <span className="font-medium text-[14px] leading-[1.2] text-center whitespace-nowrap tracking-[0]">
              Physician
            </span>
          </button>
        </div>

        {/* Form Area */}
        <div className="w-[368px] flex flex-col mx-auto">
          <form onSubmit={handleLogin} className="flex flex-col gap-[16px] w-full">
            <FormField 
              label="Email" 
              error={errors.email}
              labelClassName="text-[#2F4246] font-normal"
            >
              <Input
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="emailaddress@domain.com"
                className={`h-[41px] border-[#D7E1E4] focus:border-[#146D75] focus-visible:ring-0 ${errors.email ? 'border-[#E25555] text-[#E25555]' : ''}`}
              />
            </FormField>

            <FormField 
              label="Password" 
              error={errors.password}
              labelClassName="text-[#2F4246] font-normal"
            >
              <div className="relative w-full">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="********"
                  className={`h-[41px] pr-[44px] border-[#D7E1E4] focus:border-[#146D75] focus-visible:ring-0 ${errors.password ? 'border-[#E25555] text-[#E25555]' : ''}`}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-[16px] top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#4b5563] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </FormField>

            {apiError && <p className="font-medium text-[#E25555] text-[14px] text-center">{apiError}</p>}

            <Button
              type="submit"
              variant="brand"
              disabled={isSubmitting || !isFormValid}
              className="w-full h-[41px] mt-[8px] disabled:bg-[#d1d5db] disabled:opacity-100 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Logging in..." : "Continue"}
            </Button>
          </form>
        </div>

        <div className="w-[187px] h-[14px] flex flex-row items-center justify-center gap-[4px] mx-auto mt-[-8px] whitespace-nowrap">
          <span className="text-[12px] text-[#4b5563] leading-[1.2]">New here?</span>
          <Link 
            to={ROUTES.SIGNUP} 
            className="font-medium text-[#3B82F6] text-[12px] leading-[1.2] hover:underline"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
