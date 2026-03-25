import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants";
import { useForgotPassword } from "../hooks/useAuth";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "../schemas/auth.schema";
import { AuthPageShell } from "../components/AuthPageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/common/FormField";
import { toast } from "@/components/ui/use-toast";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const forgotPasswordMutation = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "onChange",
  });

  async function onSubmit(data: ForgotPasswordFormValues) {
    forgotPasswordMutation.mutate(
      { email: data.email.trim().toLowerCase() },
      {
        onSuccess: (response) => {
          toast({
            title: "Check your email",
            description: response.message,
          });
          navigate(ROUTES.LOGIN, { replace: true });
        },
        onError: (err) => {
          toast({
            variant: "destructive",
            title: "Unable to generate reset link",
            description:
              err instanceof Error
                ? err.message
                : "Please enter a valid registered email.",
          });
        },
      },
    );
  }

  return (
    <AuthPageShell
      title="Forgot Password"
      subtitle="Enter your registered email to receive a reset link"
      footerText="Remembered your password?"
      footerLinkTo={ROUTES.LOGIN}
      footerLinkLabel="Back to Login"
      cardClassName="max-w-[416px]"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-4"
      >
        <FormField label="Email" error={errors.email?.message}>
          <Input
            type="email"
            {...register("email")}
            placeholder="Enter your email"
            className="h-[42px] border-[#E5E7EB] placeholder:text-[#A3A3A3] text-sm focus:border-[#1B6E75] focus-visible:ring-0 rounded-lg"
          />
        </FormField>
        <Button
          type="submit"
          disabled={forgotPasswordMutation.isPending || !isValid}
          className="mt-2 h-[42px] w-full rounded-lg bg-[#146D75] font-medium text-white transition-colors hover:bg-[#0F5960] disabled:cursor-not-allowed disabled:bg-[#B9D0D2] disabled:text-white"
        >
          {forgotPasswordMutation.isPending
            ? "Generating link..."
            : "Send reset link"}
        </Button>
      </form>
    </AuthPageShell>
  );
}
