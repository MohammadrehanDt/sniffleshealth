import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AppModal } from "@/components/common/AppModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CalendarIcon, Clock } from "lucide-react";
import { consultations as mockConsultations } from "@/data/mockData";
import { Appointment } from "@sniffles/types";
import { toast } from "sonner";

// Extract unique doctors from mock data
const doctors = Array.from(new Set(mockConsultations.map((c) => c.doctor))).map(
  (name) => {
    const consultation = mockConsultations.find((c) => c.doctor === name);
    return { name, specialty: consultation?.specialty };
  },
);

const bookingSchema = z.object({
  doctor: z.string().min(1, "Doctor is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  reason: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Appointment | null;
}

export function BookingModal({
  open,
  onOpenChange,
  initialData,
}: BookingModalProps) {
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      doctor: "",
      date: "",
      time: "",
      reason: "",
    },
  });

  const { reset, handleSubmit, formState, control } = form;
  const { isDirty } = formState;

  useEffect(() => {
    if (open) {
      if (initialData) {
        let dateValue = initialData.date;
        if (dateValue === "Today") {
          dateValue = new Date().toISOString().split("T")[0];
        } else if (dateValue === "Tomorrow") {
          dateValue = new Date(Date.now() + 86400000)
            .toISOString()
            .split("T")[0];
        } else if (dateValue.includes(",")) {
          try {
            const date = new Date(dateValue);
            if (!isNaN(date.getTime())) {
              dateValue = date.toISOString().split("T")[0];
            }
          } catch (e) {
            console.error("Failed to parse date:", dateValue);
          }
        }

        reset({
          doctor: initialData.physician.name,
          date: dateValue,
          time: initialData.time,
          reason: initialData.reason || "",
        });
      } else {
        reset({ doctor: "", date: "", time: "", reason: "" });
      }
    }
  }, [open, initialData, reset]);

  const onSubmit = (values: BookingFormValues) => {
    console.log("Submitting:", values);
    toast.success(
      initialData
        ? "Appointment rescheduled successfully"
        : "Appointment booked successfully",
    );
    onOpenChange(false);
  };

  const handleClose = () => {
    if (isDirty) {
      if (
        confirm("You have unsaved changes. Are you sure you want to close?")
      ) {
        onOpenChange(false);
      }
    } else {
      onOpenChange(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <AppModal
      open={open}
      onOpenChange={(val) => (!val ? handleClose() : onOpenChange(val))}
      title={initialData ? "Reschedule Appointment" : "Appointments"}
    >
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={control}
            name="doctor"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Doctor *
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full bg-white border-neutral-200 rounded-lg">
                      <SelectValue placeholder="Select Doctor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {doctors.map((doc) => (
                      <SelectItem key={doc.name} value={doc.name}>
                        {doc.name} - {doc.specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">
                  Date of Appointment *
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="date"
                      min={today}
                      className="bg-white border-neutral-200 rounded-lg pr-10"
                      {...field}
                    />
                    <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">Time *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="time"
                      className="bg-white border-neutral-200 rounded-lg pr-10"
                      {...field}
                    />
                    <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold">Reason</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Please specify reason"
                    className="bg-white border-neutral-200 rounded-lg min-h-[100px] resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            variant="brand"
            className="w-full font-bold py-6 rounded-lg text-base"
          >
            {initialData ? "Confirm Reschedule" : "Create Appointment"}
          </Button>
        </form>
      </Form>
    </AppModal>
  );
}
