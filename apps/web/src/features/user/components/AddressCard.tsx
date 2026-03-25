import type { ProfileAddress } from "@sniffles/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface AddressCardProps {
  address: ProfileAddress;
  onEdit: (address: ProfileAddress) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function AddressCard({
  address,
  onEdit,
  onDelete,
  isDeleting,
}: AddressCardProps) {
  return (
    <Card className="border border-[#D7E1E4] shadow-none bg-white rounded overflow-hidden space-y-6">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-[16px] font-medium text-[#000000]">
            {address.label}
          </h3>
          {address.isDefault && (
            <Badge className="bg-brand-500 hover:bg-brand-600 rounded-full font-normal text-[10px] px-3 py-1">
              Default
            </Badge>
          )}
        </div>

        <div className="space-y-1 text-sm font-normal text-neutral-700 mb-8">
          <p>Address Line 1: {address.addressLine1}</p>
          {address.addressLine2 && (
            <p>Address Line 2: {address.addressLine2}</p>
          )}
          <p>State: {address.state}</p>
          <p>City: {address.city}</p>
          <p>ZIP Code: {address.zipCode}</p>
        </div>

        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => onEdit(address)}
            className="h-9 px-8 py-5 text-sm rounded-lg border-none text-brand-500 bg-brand-100 hover:bg-brand-200 font-medium shadow-none transition-colors"
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            onClick={() => onDelete(address.id)}
            disabled={isDeleting}
            className="h-9 px-4 text-semantic-error hover:text-semantic-error hover:bg-semantic-error/10 font-medium"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
