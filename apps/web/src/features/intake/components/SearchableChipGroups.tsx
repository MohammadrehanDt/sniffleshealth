import { useMemo, useState, type ReactNode } from "react";
import { Search } from "lucide-react";
import { SearchInput } from "@/components/common";
import { StepChipGroup, StepContainer, StepField } from "./StepContainer";

type ChipGroup = {
  title?: string;
  items: string[];
  showTitle?: boolean;
};

type SearchableChipGroupsProps = {
  title: string;
  description: string;
  searchPlaceholder: string;
  searchValue?: string;
  selectedItems: string[];
  groups: ChipGroup[];
  onToggle: (item: string) => void;
  error?: string;
  manualEntry?: ReactNode;
};

export function SearchableChipGroups({
  title,
  description,
  searchPlaceholder,
  searchValue = "",
  selectedItems,
  groups,
  onToggle,
  error,
  manualEntry,
}: SearchableChipGroupsProps) {
  const [searchQuery, setSearchQuery] = useState(searchValue);

  const filteredGroups = useMemo(
    () =>
      groups
        .map((group) => ({
          ...group,
          items: searchQuery
            ? group.items.filter((item) =>
                item.toLowerCase().includes(searchQuery.toLowerCase()),
              )
            : group.items,
        }))
        .filter((group) => group.items.length > 0),
    [groups, searchQuery],
  );

  return (
    <StepContainer title={title} description={description}>
      <SearchInput
        placeholder={searchPlaceholder}
        icon={<Search className="h-5 w-5 text-neutral-500" />}
        iconPosition="start"
        containerClassName="border border-border p-3"
        value={searchQuery}
        onValueChange={setSearchQuery}
      />

      {error ? <p className="text-xs text-destructive">{error}</p> : null}

      <div className="space-y-6 divide-y divide-border/70">
        {filteredGroups.map((group, index) => (
          <div key={group.title ?? index} className="space-y-3 pt-4 first:pt-0">
            {group.showTitle && group.title ? (
              <h4 className="text-sm text-neutral-800">{group.title}</h4>
            ) : null}
            <StepChipGroup
              options={group.items}
              selectedValues={selectedItems}
              onToggle={onToggle}
              chipClassName="h-auto px-4 py-2.5"
              selectedChipClassName="font-normal bg-white "
              unselectedChipClassName="text-neutral-800"
            />
          </div>
        ))}
      </div>

      {manualEntry ? (
        <StepField className="pt-4">{manualEntry}</StepField>
      ) : null}
    </StepContainer>
  );
}
