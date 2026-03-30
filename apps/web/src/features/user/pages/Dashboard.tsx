import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, ColumnDef } from "@/components/common/DataTable";
import {
  consultations,
  Consultation,
  dashboardData,
  patientProfile,
} from "@/data/mockData";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants";
import { StatusBadge } from "@/components/ui/status-badge";
import { AlertBanner } from "@/components/common/AlertBanner";
import { StatsCard } from "@/components/common/StatsCard";
import { ActionChips, ActionItem } from "@/components/ui/ActionChips";
import { useState } from "react";
import { ListGroup } from "@/components/ui/ListGroup";
import { formatDate } from "@/lib/utils";

// Sort by most recent date first
const recentConsultations = [...consultations]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 5);

const { stats, healthSummary, alerts } = dashboardData;

const columns: ColumnDef<Consultation>[] = [
  {
    header: "Date",
    accessor: "date",
    render: (val) => formatDate(val as string),
  },
  { header: "Symptoms", accessor: (row) => row.symptoms ?? "—" },
  { header: "Physician", accessor: "doctor" },
  { header: "Type", accessor: "type" },
  {
    header: "Status",
    accessor: "status",
    render: (val) => <StatusBadge status={val as string} />,
  },
];

export default function Index() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Start AI Intake");
  const myActions: ActionItem[] = [
    {
      label: "Start AI Intake",
      variant: activeTab === "Start AI Intake" ? "primary" : "secondary",
      onClick: () => setActiveTab("Start AI Intake"),
    },
    {
      label: "Book Appointment",
      variant: activeTab === "Book Appointment" ? "primary" : "secondary",
      onClick: () => navigate("/appointments"),
    },
    {
      label: "Medication Refill",
      variant: activeTab === "Medication Refill" ? "primary" : "secondary",
      onClick: () => navigate(ROUTES.MEDICATION_REFILL),
    },
    {
      label: "View Lab Results",
      variant: activeTab === "View Lab Results" ? "primary" : "secondary",
      onClick: () => setActiveTab("View Lab Results"),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">
            Hi, {patientProfile.name}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Your health overview at a glance
          </p>
        </div>
        <Button
          variant="brand"
          className="rounded-lg"
          onClick={() => navigate("/consultations")}
        >
          Add New Consultation
        </Button>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatsCard
            key={stat.key}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            iconClassName={stat.iconBg}
            footer={
              <Link
                to={stat.linkUrl}
                className="text-sm text-primary-600 font-medium hover:underline"
              >
                {stat.linkLabel}
              </Link>
            }
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-base font-semibold pb-3">Quick Actions</h3>
        <ActionChips actions={myActions} />
      </div>

      {/* Alert */}
      <div className="w-full">
        <h3 className="text-neutral-800 font-bold text-base mb-3 px-1">
          Your Health Summary
        </h3>

        <div className="border rounded-xl p-5 bg-white shadow-sm">
          <ListGroup
            items={healthSummary}
            variant="bullet"
            className="mb-5 ml-1"
            itemClassName="text-slate-500"
          />
          {alerts.map((alert, i) => (
            <AlertBanner key={i} type={alert.type} message={alert.message} />
          ))}
        </div>
      </div>

      {/* Health Summary */}
      <Card className="border-none">
        <CardHeader className="p-0 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Recent Consultations</CardTitle>
            <Button variant="link" size="sm" asChild>
              <Link to="/consultations">View all</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            data={recentConsultations}
            columns={columns}
            searchable={false}
            pageSize={5}
          />
        </CardContent>
      </Card>
    </div>
  );
}
