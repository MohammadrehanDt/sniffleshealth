import { useState, useMemo } from "react";
import { Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable, ColumnDef } from "@/components/common/DataTable";
import { StatusBadge } from "@/components/ui/status-badge";
import { Appointment } from "@sniffles/types";
import {
  upcomingAppointments as initialUpcoming,
  appointmentHistory as initialHistory,
} from "../data/appointmentsMock";
import { UpcomingAppointmentCard } from "../components/UpcomingAppointmentCard";
import { BookingModal } from "../components/BookingModal";
import { CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const columns: ColumnDef<Appointment>[] = [
  {
    header: "Date",
    accessor: "date",
    className: "text-neutral-600 font-medium",
  },
  {
    header: "Symptoms",
    accessor: (row) => row.symptoms?.join(", ") || row.reason || "—",
    className: "text-neutral-500",
  },
  {
    header: "Physician",
    accessor: (row) => row.physician.name,
    className: "text-neutral-900 font-semibold",
  },
  {
    header: "Type",
    accessor: "type",
    render: (val) => (
      <span className="capitalize text-neutral-500">
        {String(val).toLowerCase()}
      </span>
    ),
  },
  {
    header: "Status",
    accessor: "status",
    render: (val) => <StatusBadge status={val as string} />,
  },
];

export default function AppointmentsPage() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(
    null,
  );

  // Filter history based on search query
  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return initialHistory;
    const q = searchQuery.toLowerCase();
    return initialHistory.filter((item) => {
      const physicianName = item.physician.name.toLowerCase();
      const date = item.date.toLowerCase();
      const symptoms = (
        item.symptoms?.join(", ") ||
        item.reason ||
        ""
      ).toLowerCase();
      return (
        physicianName.includes(q) || date.includes(q) || symptoms.includes(q)
      );
    });
  }, [searchQuery]);

  const handleReschedule = (apt: Appointment) => {
    setSelectedAppointment(apt);
    setIsBookingModalOpen(true);
  };

  const handleCancelClick = (id: string) => {
    setAppointmentToDelete(id);
  };

  const confirmCancel = () => {
    if (appointmentToDelete) {
      toast.success("Appointment cancelled successfully");
      setAppointmentToDelete(null);
    }
  };

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col gap-6">
        <h1 className="text-[20px] font-semibold text-[#1B2B2E]">
          Appointments
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 min-w-[300px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              placeholder="Search by date, symptoms, Physician and more..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-6 bg-white border-neutral-100 rounded-xl"
            />
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-neutral-200 text-sm text-[#8FA1A6] font-medium px-5 py-6 rounded-xl flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button
              onClick={() => {
                setSelectedAppointment(null);
                setIsBookingModalOpen(true);
              }}
              variant="brand"
              className="font-medium text-sm text-[#E8F4F5] px-6 py-6 rounded-xl flex items-center gap-2"
            >
              Book New Appointment
            </Button>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="space-y-4">
        <h2 className="text-[16px] font-semibold text-[#1B2B2E]">
          Upcoming Appointments
        </h2>
        <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide">
          {initialUpcoming.map((apt, idx) => (
            <UpcomingAppointmentCard
              key={idx}
              appointment={apt}
              onReschedule={() => handleReschedule(apt)}
              onCancel={() => handleCancelClick(apt.id)}
            />
          ))}
        </div>
      </div>

      {/* Appointment History */}
      <div className="space-y-4">
        <h2 className="text-[16px] font-semibold text-[#1B2B2E]">
          Appointment History
        </h2>
        <CardContent className="p-0">
          <DataTable
            data={filteredHistory}
            columns={columns}
            searchable={false}
            pageSize={5}
            className="border-none"
          />
        </CardContent>
      </div>

      <BookingModal
        open={isBookingModalOpen}
        onOpenChange={(open) => {
          setIsBookingModalOpen(open);
          if (!open) setSelectedAppointment(null);
        }}
        initialData={selectedAppointment}
      />

      {/* Cancel Confirmation */}
      <AlertDialog
        open={!!appointmentToDelete}
        onOpenChange={(open) => !open && setAppointmentToDelete(null)}
      >
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Appointment?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will remove your appointment
              from the schedule.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg">
              Go Back
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCancel}
              className="bg-semantic-error hover:bg-rose-600 rounded-lg text-white"
            >
              Confirm Cancellation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
