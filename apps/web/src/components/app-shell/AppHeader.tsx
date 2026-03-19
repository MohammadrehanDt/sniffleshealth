import type { ReactNode } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

type AppHeaderProps = {
  title: string;
  description?: string;
  userLabel?: string;
  actions?: ReactNode;
  onLogout: () => void;
};

export function AppHeader({
  title,
  description,
  userLabel,
  actions,
  onLogout,
}: AppHeaderProps) {
  return (
    <header className="border-b border-border/70 bg-background/90 px-6 py-5 backdrop-blur">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
          {description ? (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col items-start gap-3 lg:items-end">
          {userLabel ? (
            <div className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
              Signed in as <span className="font-medium text-foreground">{userLabel}</span>
            </div>
          ) : null}
          <div className="flex flex-wrap items-center gap-3">
            {actions}
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
