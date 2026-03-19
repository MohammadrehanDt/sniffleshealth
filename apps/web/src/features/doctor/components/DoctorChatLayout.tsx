/**
 * DoctorChatLayout - Layout wrapper for Doctor Chat page
 * Handles page-level structure with header and footer
 */

import { ReactNode } from "react";
import { ROUTES } from "@/constants";
import { PageHeader, AppFooter } from "@/components/layout";

interface DoctorChatLayoutProps {
  children: ReactNode;
}

export function DoctorChatLayout({ children }: DoctorChatLayoutProps) {
  return (
    <div className="h-screen bg-neutral-light-gray flex flex-col overflow-hidden">
      <PageHeader
        backTo={ROUTES.FINDING_DOCTOR}
        step="Step 3 of 4"
        title="Consultation with Doctor"
      />
      {children}
      <AppFooter />
    </div>
  );
}
