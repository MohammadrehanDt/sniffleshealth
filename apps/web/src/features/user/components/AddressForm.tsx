import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin } from "lucide-react";
import type { ProfileAddress } from "@sniffles/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField } from "@/components/common/FormField";
import { US_STATES } from "@/constants";
import {
  addressSchema,
  type AddressFormValues,
} from "../schemas/profile.schema";

interface AddressFormProps {
  address?: ProfileAddress | null;
  onSubmit: (data: AddressFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function AddressForm({
  address,
  onSubmit,
  onCancel,
  isSubmitting,
}: AddressFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: address?.label ?? "",
      addressLine1: address?.addressLine1 ?? "",
      addressLine2: address?.addressLine2 ?? "",
      state: address?.state?.toUpperCase() ?? "",
      city: address?.city ?? "",
      zipCode: address?.zipCode ?? "",
      isDefault: address?.isDefault ?? false,
    },
    mode: "onChange",
  });

  return (
    <Card className="border border-[#D7E1E4] shadow-none bg-white rounded overflow-hidden p-6 space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <FormField
            label="Name"
            error={errors.label?.message}
            labelClassName="text-sm font-medium text-text-secondary"
          >
            <Input
              id="label"
              {...register("label")}
              placeholder="e.g. Home"
              className={`rounded-xl border-neutral-200 h-12 focus-visible:ring-brand-500 ${errors.label ? "border-semantic-error" : ""}`}
            />
          </FormField>
          <div className="hidden md:block" />

          <FormField
            label="Address Line 1"
            error={errors.addressLine1?.message}
            labelClassName="text-sm font-medium text-text-secondary"
          >
            <Input
              id="addressLine1"
              {...register("addressLine1")}
              placeholder="Building Number: 102"
              className={`rounded-xl border-neutral-200 h-12 focus-visible:ring-brand-500 ${errors.addressLine1 ? "border-semantic-error" : ""}`}
            />
          </FormField>

          <FormField
            label="Address Line 2"
            labelClassName="text-sm font-medium text-text-secondary"
          >
            <Input
              id="addressLine2"
              {...register("addressLine2")}
              placeholder="875 N Michigan Ave, John Hancock Center"
              className="rounded-xl border-neutral-200 h-12 focus-visible:ring-brand-500"
            />
          </FormField>

          <FormField
            label="Select State"
            error={errors.state?.message}
            labelClassName="text-sm font-medium text-text-secondary"
          >
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    className={`rounded-xl border-neutral-200 h-12 focus:ring-brand-500 ${errors.state ? "border-semantic-error" : ""}`}
                  >
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                  <SelectContent>
                    {US_STATES.map((state) => (
                      <SelectItem key={state.code} value={state.code}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>

          <FormField
            label="City"
            error={errors.city?.message}
            labelClassName="text-sm font-medium text-text-secondary"
            trailingIcon={<MapPin className="h-4 w-4" />}
          >
            <Input
              id="city"
              {...register("city")}
              placeholder="Boston"
              className={`rounded-xl border-neutral-200 h-12 pr-10 focus-visible:ring-brand-500 ${errors.city ? "border-semantic-error" : ""}`}
            />
          </FormField>

          <FormField
            label="ZIP Code"
            error={errors.zipCode?.message}
            labelClassName="text-sm font-medium text-text-secondary"
          >
            <Input
              id="zipCode"
              {...register("zipCode")}
              placeholder="02116"
              className={`rounded-xl border-neutral-200 h-12 focus-visible:ring-brand-500 ${errors.zipCode ? "border-semantic-error" : ""}`}
            />
          </FormField>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Controller
            name="isDefault"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="isDefault"
                checked={field.value}
                onCheckedChange={field.onChange}
                className="border-neutral-300 data-[state=checked]:bg-brand-500 data-[state=checked]:border-brand-500 h-5 w-5 rounded-md"
              />
            )}
          />
          <label
            htmlFor="isDefault"
            className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[#1B2B2E]"
          >
            Set as default
          </label>
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="hover:bg-brand-600 hover:text-white bg-[#E8F4F5] text-primary-700 rounded-lg px-8 h-10 font-medium text-sm transition-colors"
          >
            {isSubmitting ? "Saving..." : address ? "Save" : "Add Address"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="text-brand-500 hover:bg-brand-100 h-10 px-6 font-medium text-sm transition-colors"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
