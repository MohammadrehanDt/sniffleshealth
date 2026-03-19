import { CalendarDays, FileText, HeartPulse, MessageSquareText } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuthStore } from "@/stores/auth.store";

const patientMetrics = [
  {
    label: "Open consultations",
    value: "3",
    icon: MessageSquareText,
    detail: "Two awaiting physician review",
  },
  {
    label: "Upcoming appointments",
    value: "1",
    icon: CalendarDays,
    detail: "Next visit tomorrow at 10:30 AM",
  },
  {
    label: "Care plan alerts",
    value: "2",
    icon: HeartPulse,
    detail: "Medication and hydration reminders",
  },
];

const recentItems = [
  {
    date: "Mar 18, 2026",
    concern: "Sinus congestion",
    physician: "Dr. Sofia Patel",
    status: { label: "Scheduled", tone: "scheduled" as const },
  },
  {
    date: "Mar 13, 2026",
    concern: "Recurring cough",
    physician: "Dr. Liam Chen",
    status: { label: "Pending", tone: "pending" as const },
  },
  {
    date: "Mar 06, 2026",
    concern: "Medication refill",
    physician: "Dr. Sofia Patel",
    status: { label: "Completed", tone: "completed" as const },
  },
];

export default function Dashboard() {
  const { user, clearSession } = useAuthStore();

  return (
    <AppShell role="PATIENT">
      <AppHeader
        title="Patient Dashboard"
        description="A reusable patient workspace shell with consistent cards, badges, and table styling for the next feature phases."
        userLabel={user?.email}
        actions={
          <Button>
            <FileText className="h-4 w-4" />
            Start consultation
          </Button>
        }
        onLogout={clearSession}
      />

      <PageWrapper className="space-y-6">
        <section className="grid gap-4 xl:grid-cols-3">
          {patientMetrics.map((metric) => {
            const Icon = metric.icon;

            return (
              <Card key={metric.label} className="rounded-3xl border-white/70 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <div>
                    <CardDescription>{metric.label}</CardDescription>
                    <CardTitle className="mt-2 text-4xl">{metric.value}</CardTitle>
                  </div>
                  <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-700">
                    <Icon className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{metric.detail}</p>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <Card className="rounded-3xl border-white/70 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Recent consultations</CardTitle>
              <CardDescription>
                Table styles are now centralized for future consultation and appointment modules.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Concern</TableHead>
                    <TableHead>Physician</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentItems.map((item) => (
                    <TableRow key={`${item.date}-${item.concern}`}>
                      <TableCell>{item.date}</TableCell>
                      <TableCell className="font-medium">{item.concern}</TableCell>
                      <TableCell>{item.physician}</TableCell>
                      <TableCell>
                        <StatusBadge label={item.status.label} tone={item.status.tone} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-white/70 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Design system notes</CardTitle>
              <CardDescription>
                This page now demonstrates the baseline dashboard shell for patient-facing pages.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div className="rounded-2xl bg-[#f6f1eb] p-4">
                Consistent `Card`, `Table`, and `StatusBadge` usage makes later dashboard work faster.
              </div>
              <div className="rounded-2xl border border-dashed border-border p-4">
                Phase 4 will replace these placeholders with stats, quick actions, health summary, and live consultation data.
              </div>
            </CardContent>
          </Card>
        </section>
      </PageWrapper>
    </AppShell>
  );
}
