import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation } from "react-router-dom";
import { ROUTES } from "@/constants";
import { useLogin } from "../hooks/useAuth";
import { loginSchema, type LoginFormValues } from "../schemas/auth.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { FormField } from "@/components/common/FormField";
import { AuthPageShell } from "../components/AuthPageShell";
import { AuthPasswordField } from "../components/AuthPasswordField";
import { useState } from "react";

export default function LoginPage() {
  const location = useLocation();
  const [rememberSession, setRememberSession] = useState(false);

  const redirectTo =
    typeof location.state?.from === "string" ? location.state.from : null;

  const loginMutation = useLogin({ redirectTo, rememberSession });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  });

  const isSubmitting = loginMutation.isPending;
  const passwordField = register("password");

  async function onSubmit(data: LoginFormValues) {
    loginMutation.mutate(
      {
        email: data.email.trim().toLowerCase(),
        password: data.password,
      },
      {
        onError: (err) => {
          toast({
            variant: "destructive",
            title: "Login failed",
            description:
              err instanceof Error ? err.message : "Unable to log in",
          });
        },
      },
    );
  }

  return (
    <AuthPageShell
      title="Welcome Back"
      subtitle="Log in to your account"
      footerText="Don't have an account?"
      footerLinkTo={ROUTES.SIGNUP}
      footerLinkLabel="Create Account"
      cardClassName="max-w-[416px]"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-4"
      >
        <FormField
          label="Email"
          error={errors.email?.message}
          labelClassName="text-[#4D4D4D] text-[13px] font-normal mb-1.5"
        >
          <Input
            type="email"
            {...register("email")}
            placeholder="Enter email address"
            className={`h-[42px] border-[#E5E7EB] placeholder:text-[#A3A3A3] text-sm focus:border-[#1B6E75] focus-visible:ring-0 rounded-lg ${errors.email ? "border-semantic-error" : ""}`}
          />
        </FormField>

        <AuthPasswordField
          label="Password"
          error={errors.password?.message}
          placeholder="Enter password"
          {...passwordField}
          inputRef={passwordField.ref}
        />

        <div className="flex items-center justify-between gap-3">
          <label
            htmlFor="remember-session"
            className="flex cursor-pointer items-center gap-2 text-[13px] text-[#4D4D4D]"
          >
            <Checkbox
              id="remember-session"
              checked={rememberSession}
              onCheckedChange={(checked) =>
                setRememberSession(checked === true)
              }
              className="h-4 w-4 rounded-[4px] border-[#C8D2D5] data-[state=checked]:border-[#1B6E75] data-[state=checked]:bg-[#1B6E75]"
            />
            <span className="text-[#1B2B2E] font-medium">Remember me</span>
          </label>
          <Link
            to="#"
            className="text-[12px] font-medium text-[#3B82F6] hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="mt-2 h-[42px] w-full rounded-lg bg-[#146D75] font-medium text-white transition-colors hover:bg-[#0F5960] disabled:cursor-not-allowed disabled:bg-[#B9D0D2] disabled:text-white"
        >
          {isSubmitting ? "Logging in..." : "Log in"}
        </Button>
      </form>
    </AuthPageShell>
  );
}
