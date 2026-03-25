import { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Camera, Loader2 } from "lucide-react";
import type { ProfileAddress } from "@sniffles/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { FormField } from "@/components/common/FormField";
import { DatePickerInput } from "@/components/common/DatePickerInput";
import { useCurrentUser } from "@/features/auth/hooks/useAuth";
import {
  useUpdateProfile,
  useAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
} from "../hooks/useProfile";
import {
  profileSchema,
  type ProfileFormValues,
  type AddressFormValues,
} from "../schemas/profile.schema";
import { AddressCard } from "../components/AddressCard";
import { AddressForm } from "../components/AddressForm";

export default function ProfilePage() {
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: addresses = [], isLoading: addressesLoading } = useAddresses();
  const updateProfile = useUpdateProfile();
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<ProfileAddress | null>(
    null,
  );
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      dateOfBirth: "",
      email: "",
      phone: "",
      weight: "",
      weightUnit: "kg",
      height: "",
      heightUnit: "ft",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName ?? "",
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
        email: user.email,
        phone: user.phone ?? "",
        weight: user.weight != null ? String(user.weight) : "",
        weightUnit: (user.weightUnit as "kg" | "lbs") ?? "kg",
        height: user.height != null ? String(user.height) : "",
        heightUnit: (user.heightUnit as "ft" | "cm") ?? "ft",
      });
      if (user.avatarUrl) {
        setImagePreview(user.avatarUrl);
      }
    }
  }, [user, reset]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Image must be under 5MB",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  function onSubmitProfile(data: ProfileFormValues) {
    updateProfile.mutate(
      {
        fullName: data.fullName,
        phone: data.phone || undefined,
        dateOfBirth: data.dateOfBirth || undefined,
        weight: data.weight ? parseFloat(data.weight) : null,
        weightUnit: data.weightUnit,
        height: data.height ? parseFloat(data.height) : null,
        heightUnit: data.heightUnit,
      },
      {
        onSuccess: () => {
          toast({
            title: "Profile updated",
            description: "Your profile has been saved successfully.",
          });
        },
        onError: (err) => {
          toast({
            variant: "destructive",
            title: "Update failed",
            description:
              err instanceof Error ? err.message : "Unable to update profile",
          });
        },
      },
    );
  }

  function handleCancel() {
    if (user) {
      reset({
        fullName: user.fullName ?? "",
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
        email: user.email,
        phone: user.phone ?? "",
        weight: user.weight != null ? String(user.weight) : "",
        weightUnit: (user.weightUnit as "kg" | "lbs") ?? "kg",
        height: user.height != null ? String(user.height) : "",
        heightUnit: (user.heightUnit as "ft" | "cm") ?? "ft",
      });
    }
  }

  function handleAddressSubmit(data: AddressFormValues) {
    const payload = {
      label: data.label,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2 || undefined,
      state: data.state,
      city: data.city,
      zipCode: data.zipCode,
      isDefault: data.isDefault ?? false,
    };

    if (editingAddress) {
      updateAddress.mutate(
        { id: editingAddress.id, payload },
        {
          onSuccess: () => {
            setEditingAddress(null);
            toast({
              title: "Address updated",
              description: "Your address has been updated successfully.",
            });
          },
          onError: (err) => {
            toast({
              variant: "destructive",
              title: "Update failed",
              description:
                err instanceof Error ? err.message : "Unable to update address",
            });
          },
        },
      );
    } else {
      createAddress.mutate(payload, {
        onSuccess: () => {
          setIsAddingAddress(false);
          toast({
            title: "Address added",
            description: "Your new address has been saved successfully.",
          });
        },
        onError: (err) => {
          toast({
            variant: "destructive",
            title: "Failed to add address",
            description:
              err instanceof Error ? err.message : "Unable to add address",
          });
        },
      });
    }
  }

  function handleDeleteAddress(id: string) {
    deleteAddress.mutate(id, {
      onSuccess: () => {
        toast({
          title: "Address deleted",
          description: "The address has been removed.",
        });
      },
      onError: (err) => {
        toast({
          variant: "destructive",
          title: "Delete failed",
          description:
            err instanceof Error ? err.message : "Unable to delete address",
        });
      },
    });
  }

  if (userLoading || addressesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto pb-10">
      <div className="flex flex-col gap-6">
        <h1 className="text-[20px] font-semibold text-[#1B2B2E]">My Profile</h1>

        {/* Basic Details Section */}
        <section className="space-y-4">
          <h2 className="text-[16px] font-semibold text-[#1B2B2E]">
            Basic Details
          </h2>
          <Card className="border border-[#D7E1E4] shadow-none bg-white rounded overflow-hidden">
            <CardContent className="p-6 space-y-8">
              <div className="flex items-center gap-4">
                <div
                  className="relative group cursor-pointer"
                  onClick={handleImageClick}
                >
                  <div className="h-20 w-20 bg-neutral-200 rounded-full flex items-center justify-center overflow-hidden border-2 border-transparent group-hover:border-brand-500 transition-all">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-10 w-10 text-neutral-400" />
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 bg-brand-500 p-1.5 rounded-full text-white shadow-lg group-hover:scale-110 transition-transform">
                    <Camera className="h-3 w-3" />
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <FormField
                  label="Full Name"
                  error={errors.fullName?.message}
                  labelClassName="text-sm font-normal text-neutral-800"
                >
                  <Input
                    id="fullName"
                    {...register("fullName")}
                    placeholder="John Doe"
                    className={`rounded-xl border-neutral-200 h-12 focus-visible:ring-brand-500 ${errors.fullName ? "border-semantic-error" : ""}`}
                  />
                </FormField>

                <FormField
                  label="Date of Birth"
                  labelClassName="text-sm font-normal text-neutral-800"
                >
                  <Controller
                    name="dateOfBirth"
                    control={control}
                    render={({ field }) => (
                      <DatePickerInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select date of birth"
                        maxDate={new Date()}
                      />
                    )}
                  />
                </FormField>

                <FormField
                  label="Email"
                  labelClassName="text-sm font-normal text-neutral-800"
                >
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    disabled
                    className="rounded-xl border-neutral-200 h-12 focus-visible:ring-brand-500 disabled:opacity-60"
                  />
                </FormField>

                <FormField
                  label="Phone Number"
                  error={errors.phone?.message}
                  labelClassName="text-sm font-normal text-neutral-800"
                >
                  <Input
                    id="phone"
                    {...register("phone")}
                    placeholder="+1 4456 6886 99"
                    className={`rounded-xl border-neutral-200 h-12 focus-visible:ring-brand-500 ${errors.phone ? "border-semantic-error" : ""}`}
                  />
                </FormField>

                <div className="space-y-2">
                  <Label
                    htmlFor="weight"
                    className="text-sm font-normal text-neutral-800"
                  >
                    Weight
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="weight"
                      {...register("weight")}
                      placeholder="68.63"
                      className="rounded-xl border-neutral-200 h-12 flex-1 focus-visible:ring-brand-500"
                    />
                    <Controller
                      name="weightUnit"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-24 rounded-xl border-neutral-200 h-12 focus:ring-brand-500">
                            <SelectValue placeholder="Unit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kg">Kg</SelectItem>
                            <SelectItem value="lbs">Lbs</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="height"
                    className="text-sm font-normal text-neutral-800"
                  >
                    Height
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="height"
                      {...register("height")}
                      placeholder="5'11&quot;"
                      className="rounded-xl border-neutral-200 h-12 flex-1 focus-visible:ring-brand-500"
                    />
                    <Controller
                      name="heightUnit"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-24 rounded-xl border-neutral-200 h-12 focus:ring-brand-500">
                            <SelectValue placeholder="Unit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ft">Ft</SelectItem>
                            <SelectItem value="cm">Cm</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Address Information Section */}
        <section className="space-y-4">
          <h2 className="text-[16px] font-semibold text-[#1B2B2E]">
            Address Information
          </h2>

          {addresses.map((address) =>
            editingAddress?.id === address.id ? (
              <AddressForm
                key={address.id}
                address={address}
                onSubmit={handleAddressSubmit}
                onCancel={() => setEditingAddress(null)}
                isSubmitting={updateAddress.isPending}
              />
            ) : (
              <AddressCard
                key={address.id}
                address={address}
                onEdit={setEditingAddress}
                onDelete={handleDeleteAddress}
                isDeleting={
                  deleteAddress.isPending &&
                  deleteAddress.variables === address.id
                }
              />
            ),
          )}

          {isAddingAddress ? (
            <AddressForm
              onSubmit={handleAddressSubmit}
              onCancel={() => setIsAddingAddress(false)}
              isSubmitting={createAddress.isPending}
            />
          ) : (
            <Button
              onClick={() => setIsAddingAddress(true)}
              variant="outline"
              className="h-12 px-6 rounded-xl border-none bg-brand-100 text-brand-500 font-bold hover:bg-brand-200 shadow-none transition-colors"
            >
              Add Address
            </Button>
          )}
        </section>

        {/* Save Changes - at the bottom of the entire page */}
        <div className="flex gap-4 pt-2">
          <Button
            type="button"
            disabled={updateProfile.isPending || !isDirty}
            onClick={handleSubmit(onSubmitProfile)}
            className="bg-brand-500 hover:bg-brand-600 text-white rounded-lg px-10 h-12 font-bold transition-colors disabled:opacity-50"
          >
            {updateProfile.isPending ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={handleCancel}
            disabled={!isDirty}
            className="text-brand-500 hover:bg-brand-100 h-12 px-10 font-bold transition-colors"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
