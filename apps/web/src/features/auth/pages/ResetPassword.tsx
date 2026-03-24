import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthPageShell } from "../components/AuthPageShell";
import { AuthPasswordField } from "../components/AuthPasswordField";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { ROUTES } from "@/constants";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "../schemas/auth.schema";
import { useResetPassword } from "../hooks/useAuth";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const resetPasswordMutation = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onChange",
  });

  const passwordField = register("password");
  const confirmPasswordField = register("confirmPassword");

  async function onSubmit(data: ResetPasswordFormValues) {
    if (!token) {
      toast({
        variant: "destructive",
        title: "Invalid reset link",
        description: "This password reset link is missing or invalid.",
      });
      return;
    }

    resetPasswordMutation.mutate(
      { token, password: data.password },
      {
        onSuccess: (response) => {
          toast({
            title: "Password updated",
            description: response.message,
          });
          navigate(ROUTES.LOGIN, { replace: true });
        },
        onError: (err) => {
          toast({
            variant: "destructive",
            title: "Unable to reset password",
            description:
              err instanceof Error
                ? err.message
                : "Password reset failed. Please request a new link.",
          });
        },
      },
    );
  }

  return (
    <AuthPageShell
      title="Reset Password"
      subtitle="Choose a new password. This link is valid for 10 minutes."
      footerText="Remembered your password?"
      footerLinkTo={ROUTES.LOGIN}
      footerLinkLabel="Back to Login"
      cardClassName="max-w-[416px]"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-4"
      >
        <AuthPasswordField
          label="New Password"
          error={errors.password?.message}
          placeholder="Enter new password"
          {...passwordField}
          inputRef={passwordField.ref}
        />

        <AuthPasswordField
          label="Confirm Password"
          error={errors.confirmPassword?.message}
          placeholder="Confirm new password"
          {...confirmPasswordField}
          inputRef={confirmPasswordField.ref}
        />

        <p className="text-xs text-[#666666]">
          Use at least 8 characters with upper/lowercase letters, a number, and
          a symbol.
        </p>

        <Button
          type="submit"
          disabled={resetPasswordMutation.isPending || !isValid || !token}
          className="mt-2 h-[42px] w-full rounded-lg bg-[#146D75] font-medium text-white transition-colors hover:bg-[#0F5960] disabled:cursor-not-allowed disabled:bg-[#B9D0D2] disabled:text-white"
        >
          {resetPasswordMutation.isPending
            ? "Resetting Password..."
            : "Reset Password"}
        </Button>
      </form>
    </AuthPageShell>
  );
}
