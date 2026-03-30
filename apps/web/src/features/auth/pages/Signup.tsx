import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ROUTES } from "@/constants";
import { useRegister } from "../hooks/useAuth";
import {
  registerSchema,
  type RegisterFormValues,
} from "../schemas/auth.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { FormField } from "@/components/common/FormField";
import { AuthPageShell } from "../components/AuthPageShell";
import { AuthPasswordField } from "../components/AuthPasswordField";

export default function SignupPage() {
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors, isValid },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "PATIENT",
    },
    mode: "onChange",
  });

  const role = watch("role");
  const isSubmitting = registerMutation.isPending;
  const passwordField = register("password");
  const confirmPasswordField = register("confirmPassword" as any);

  function handleRoleChange(newRole: "PATIENT" | "DOCTOR") {
    reset({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: newRole,
      ...(newRole === "DOCTOR" ? { npiNumber: "", phone: "" } : {}),
    });
  }

  async function onSubmit(data: RegisterFormValues) {
    registerMutation.mutate(
      {
        fullName: data.fullName.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
        role: data.role,
        npiNumber: data.role === "DOCTOR" ? data.npiNumber.trim() : undefined,
        phone: data.role === "DOCTOR" ? data.phone.trim() : undefined,
      },
      {
        onError: (err) => {
          const message =
            err instanceof Error ? err.message : "Registration failed";

          if (message.toLowerCase().includes("npi")) {
            setError("npiNumber" as keyof RegisterFormValues, {
              message,
            });
            return;
          }

          toast({
            variant: "destructive",
            title: "Signup failed",
            description: message,
          });
        },
      },
    );
  }
  return (
    <AuthPageShell
      title="Create Account"
      subtitle="Sign up to get started"
      footerText="Already have an account?"
      footerLinkTo={ROUTES.LOGIN}
      footerLinkLabel="Log in"
      cardClassName="max-w-lg"
    >
      <div className="flex border border-[#E5E7EB] rounded-lg p-1 mx-auto w-full">
        {(["PATIENT", "DOCTOR"] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => handleRoleChange(r)}
            className={`flex-1 h-[38px] rounded-md text-[13px] font-medium transition-all ${
              role === r
                ? "bg-[#1B6E75] text-white shadow-sm"
                : "bg-transparent text-[#1B6E75] hover:bg-gray-50"
            }`}
          >
            {r === "PATIENT" ? "Patient" : "Physician"}
          </button>
        ))}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full"
      >
        <FormField
          label="Full Name"
          error={errors.fullName?.message}
          labelClassName="text-[#4D4D4D] text-[13px] font-normal mb-1.5"
        >
          <Input
            {...register("fullName")}
            placeholder="Enter full name"
            className={`h-[42px] border-[#E5E7EB] placeholder:text-[#A3A3A3] text-sm focus:border-[#1B6E75] focus-visible:ring-0 rounded-lg ${errors.fullName ? "border-semantic-error" : ""}`}
          />
        </FormField>

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

        {role === "DOCTOR" && (
          <>
            <FormField
              label="NPI Number"
              error={
                (errors as Record<string, { message?: string }>).npiNumber
                  ?.message
              }
              labelClassName="text-[#4D4D4D] text-[13px] font-normal mb-1.5"
            >
              <Input
                {...register("npiNumber" as keyof RegisterFormValues)}
                placeholder="Enter NPI Number"
                maxLength={10}
                className={`h-[42px] border-[#E5E7EB] placeholder:text-[#A3A3A3] text-sm focus:border-[#1B6E75] focus-visible:ring-0 rounded-lg ${(errors as Record<string, unknown>).npiNumber ? "border-semantic-error" : ""}`}
              />
            </FormField>

            <FormField
              label="Cell Phone Number"
              error={
                (errors as Record<string, { message?: string }>).phone?.message
              }
              labelClassName="text-[#4D4D4D] text-[13px] font-normal mb-1.5"
            >
              <Input
                {...register("phone" as keyof RegisterFormValues)}
                placeholder="Enter cell phone number"
                className={`h-[42px] border-[#E5E7EB] placeholder:text-[#A3A3A3] text-sm focus:border-[#1B6E75] focus-visible:ring-0 rounded-lg ${(errors as Record<string, unknown>).phone ? "border-semantic-error" : ""}`}
              />
            </FormField>
          </>
        )}

        <AuthPasswordField
          label="Password"
          error={errors.password?.message}
          placeholder="Enter password"
          {...passwordField}
          inputRef={passwordField.ref}
        />

        <AuthPasswordField
          label="Confirm Password"
          error={(errors as any).confirmPassword?.message}
          placeholder="Enter same password"
          {...confirmPasswordField}
          inputRef={confirmPasswordField.ref}
        />

        <div className="flex items-center gap-2 mt-1 mb-2">
          <input
            type="checkbox"
            id="terms"
            defaultChecked
            className="w-3.5 h-3.5 rounded-sm border-[#E5E7EB] text-[#1B6E75] focus:ring-[#1B6E75] accent-[#1B6E75]"
          />
          <label
            htmlFor="terms"
            className="text-[11px] font-normal text-[#1B2B2E]"
          >
            I hereby confirm to accept SnifflesHealth’s terms of services and
            privacy policy{" "}
          </label>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="h-[42px] w-full rounded-lg bg-[#146D75] font-medium text-white transition-colors hover:bg-[#0F5960] disabled:cursor-not-allowed disabled:bg-[#B9D0D2] disabled:text-white"
        >
          {isSubmitting ? "Creating account..." : "Continue"}
        </Button>
      </form>
    </AuthPageShell>
  );
}
