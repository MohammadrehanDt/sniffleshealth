export interface HealthiePatient {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
}

export interface HealthieProvider {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
}

export interface CreateClientResponse {
  createClient: {
    user: HealthiePatient | null;
    messages: Array<{ field: string; message: string }> | null;
  };
}

export interface HealthieRequestedPayment {
  id: string;
  invoice_id: string | null;
  price: string | null;
  status: string | null;
  currency: string | null;
  created_at: string | null;
}

export interface CreateRequestedPaymentResponse {
  createRequestedPayment: {
    requestedPayment: HealthieRequestedPayment | null;
    messages: Array<{ field: string; message: string }> | null;
  };
}

export interface HealthieOffering {
  id: string;
  name: string | null;
  price: string | null;
  currency: string | null;
  show_price: boolean | null;
  billing_frequency: string | null;
  initial_payment_amount: string | null;
  initial_price_with_taxes: string | null;
  visibility_status?: string | null;
  archived?: boolean | null;
}

export interface OfferingsResponse {
  offerings: HealthieOffering[];
}

export interface HealthieOrganizationMember {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  npi: string | null;
  is_patient: boolean | null;
  active: boolean | null;
}

export interface OrganizationMembersResponse {
  organizationMembers: HealthieOrganizationMember[];
}

export interface SignUpResponse {
  signUp: {
    user: HealthieProvider | null;
    messages: Array<
      | string
      | {
          field?: string | null;
          message?: string | null;
        }
    > | null;
    nextRequiredStep?: string | null;
    token?: string | null;
  };
}
