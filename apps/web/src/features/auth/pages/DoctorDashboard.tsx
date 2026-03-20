import { ClipboardList, ShieldCheck } from "lucide-react";
import { AppHeader, AppShell, PageWrapper } from "@/components/app-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { useAuthStore } from "@/stores/auth.store";

const physicianQueue = [
  { patient: "Ava Thompson", issue: "Respiratory follow-up", status: "Pending" },
  { patient: "Noah Rivera", issue: "Medication review", status: "Scheduled" },
  { patient: "Emma Collins", issue: "SOAP note approval", status: "Attention" },
];

export default function DoctorDashboardPage() {
  const { user, clearSession } = useAuthStore();

  return (
    <AppShell role="doctor">
      <AppHeader
        title="Physician Dashboard"
        description="Role-based shell for clinical review workflows. The full consultation review and prescription tools land in later phases."
        userLabel={user?.email}
        actions={
          <Button>
            <ClipboardList className="h-4 w-4" />
            Review queue
          </Button>
        }
        onLogout={clearSession}
      />

      <PageWrapper className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="rounded-3xl border-white/70 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Review queue</CardTitle>
            <CardDescription>
              Shared dashboard layout now supports role-specific physician panels.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {physicianQueue.map((item) => (
              <div
                key={`${item.patient}-${item.issue}`}
                className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-medium text-foreground">{item.patient}</p>
                  <p className="text-sm text-muted-foreground">{item.issue}</p>
                </div>
                <StatusBadge
                  label={item.status}
                  tone={
                    item.status === "Attention"
                      ? "attention"
                      : item.status === "Scheduled"
                        ? "scheduled"
                        : "pending"
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-white/70 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-700">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl">Operational baseline</CardTitle>
                <CardDescription>
                  Phase 3 establishes the physician shell and reusable component pattern.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              The auth layer from Phase 2 already protects this route by role. This shell is the
              foundation for consultation review, SOAP notes, and prescription actions.
            </p>
            <div className="rounded-2xl bg-[#f6f1eb] p-4 text-foreground">
              Next physician phases can drop richer modules into this layout without redesigning the
              sidebar or header.
            </div>
          </CardContent>
        </Card>
      </PageWrapper>
    </AppShell>
  );
}
