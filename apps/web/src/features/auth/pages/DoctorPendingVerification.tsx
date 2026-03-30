import { ROUTES } from "@/constants";
import { AuthPageShell } from "../components/AuthPageShell";
import { Button } from "@/components/ui/button";

export default function DoctorPendingVerificationPage() {
  return (
    <AuthPageShell
      title="Verification Pending"
      subtitle="Your physician account is waiting for admin approval."
      footerText="Already verified?"
      footerLinkTo={ROUTES.LOGIN}
      footerLinkLabel="Log in"
      cardClassName="max-w-lg"
    >
      <div className="space-y-4 text-sm text-muted-foreground">
        <p>
          We received your registration and your account will stay locked until
          an admin verifies your physician details.
        </p>
        <p>
          Once approved, you can log in and submit state license information for
          each state you want to service.
        </p>
        <Button asChild className="w-full">
          <a href={ROUTES.LOGIN}>Return to login</a>
        </Button>
      </div>
    </AuthPageShell>
  );
}
