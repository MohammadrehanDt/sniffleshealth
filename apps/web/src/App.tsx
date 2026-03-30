import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ROUTES } from "@/constants";
import { AuthBootstrap } from "@/features/auth/components/AuthBootstrap";
import { GuestRoute } from "@/features/auth/components/GuestRoute";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import {
  DoctorDashboardPage,
  ForgotPasswordPage,
  LoginPage,
  ResetPasswordPage,
  SignupPage,
} from "@/features/auth/pages";
import { PublicLayout, RootLayout } from "@/components/layout";
import { ScrollToTop } from "@/lib/scroll-to-top";
import LandingPage from "@/features/landing/pages/LandingPage";
import {
  Symptoms,
  MedicalProfile,
  SummaryConsultation,
  Consultation,
} from "@/features/consultation/pages";
import {
  SelectConsultationType,
  PaymentConfirmation,
} from "@/features/payment/pages";
import HIPAACompliance from "./pages/HIPAACompliance";
import {
  KYC,
  AddressDetails,
  Dashboard,
  ProfilePage,
  MedicationRefill,
} from "@/features/user/pages";
import { AppointmentsPage } from "@/features/appointments/pages";
import { FindingDoctor, DoctorChat } from "@/features/doctor/pages";
import {
  PharmacySelection,
  PharmacyConfirmation,
} from "@/features/pharmacy/pages";
import IntakeFlowPage from "@/features/intake/pages/IntakeFlowPage";
import Prescription from "./pages/Prescription";
import NotFound from "./pages/NotFound";
import { queryClient } from "@/lib/query-client";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthBootstrap />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path={ROUTES.HOME} element={<LandingPage />} />
              <Route path={ROUTES.INTAKE} element={<IntakeFlowPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route
              path={ROUTES.LOGIN}
              element={
                <GuestRoute>
                  <LoginPage />
                </GuestRoute>
              }
            />
            <Route
              path={ROUTES.SIGNUP}
              element={
                <GuestRoute>
                  <SignupPage />
                </GuestRoute>
              }
            />
            <Route
              path={ROUTES.FORGOT_PASSWORD}
              element={<ForgotPasswordPage />}
            />
            <Route
              path={ROUTES.RESET_PASSWORD}
              element={<ResetPasswordPage />}
            />
            <Route path={ROUTES.SYMPTOMS} element={<Symptoms />} />
            <Route path={ROUTES.MEDICAL_PROFILE} element={<MedicalProfile />} />
            <Route path={ROUTES.SUMMARY} element={<SummaryConsultation />} />
            <Route path={ROUTES.CONSULTATION} element={<Consultation />} />
            <Route
              path={ROUTES.SELECT_CONSULTATION_TYPE}
              element={<SelectConsultationType />}
            />
            <Route
              path={ROUTES.PAYMENT_CONFIRMATION}
              element={<PaymentConfirmation />}
            />
            <Route
              path={ROUTES.HIPAA_COMPLIANCE}
              element={<HIPAACompliance />}
            />
            <Route path={ROUTES.KYC} element={<KYC />} />
            <Route path={ROUTES.ADDRESS_DETAILS} element={<AddressDetails />} />
            <Route path={ROUTES.FINDING_DOCTOR} element={<FindingDoctor />} />
            <Route path={ROUTES.DOCTOR_CHAT} element={<DoctorChat />} />
            <Route path={ROUTES.PRESCRIPTION} element={<Prescription />} />
            <Route
              path={ROUTES.PHARMACY_SELECTION}
              element={<PharmacySelection />}
            />
            <Route
              path={ROUTES.PHARMACY_CONFIRMATION}
              element={<PharmacyConfirmation />}
            />
            {/* Authenticated layout — shared sidebar, header, footer */}
            <Route
              element={
                <ProtectedRoute>
                  <RootLayout />
                </ProtectedRoute>
              }
            >
              <Route
                path={ROUTES.DASHBOARD}
                element={
                  <ProtectedRoute roles={["PATIENT"]}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.APPOINTMENTS}
                element={
                  <ProtectedRoute roles={["PATIENT"]}>
                    <AppointmentsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.MEDICATION_REFILL}
                element={
                  <ProtectedRoute roles={["PATIENT"]}>
                    <MedicationRefill />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.DOCTOR_DASHBOARD}
                element={
                  <ProtectedRoute roles={["DOCTOR"]}>
                    <DoctorDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.PROFILE}
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
