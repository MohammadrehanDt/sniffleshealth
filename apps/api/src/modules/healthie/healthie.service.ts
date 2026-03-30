import {
  Injectable,
  Inject,
  Logger,
  BadRequestException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../prisma/prisma.service";
import type {
  CreateClientResponse,
  CreateRequestedPaymentResponse,
  HealthieRequestedPayment,
  OfferingsResponse,
  OrganizationMembersResponse,
} from "./healthie.types";

const MAX_RETRIES = 2;

@Injectable()
export class HealthieService {
  private readonly logger = new Logger(HealthieService.name);

  @Inject(ConfigService)
  private readonly configService!: ConfigService;

  @Inject(PrismaService)
  private readonly prisma!: PrismaService;

  /**
   * Creates a client in Healthie and stores the healthiePatientId on the local user.
   * Non-blocking: logs errors but never throws.
   */
  async createPatientForUser(
    userId: string,
    email: string,
    fullName: string | null,
  ): Promise<void> {
    try {
      await this.ensurePatientIdForUser(userId, email, fullName);
    } catch (error) {
      this.logger.error(
        `Failed to create Healthie patient for user ${userId}`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }

  async findProviderIdByNpi(npi: string): Promise<string | null> {
    const normalizedNpi = npi.trim();
    if (!normalizedNpi) {
      return null;
    }

    const query = `
      query organizationMembers(
        $keywords: String
        $offset: Int
        $page_size: Int
      ) {
        organizationMembers(
          keywords: $keywords
          offset: $offset
          page_size: $page_size
        ) {
          id
          email
          first_name
          last_name
          npi
          is_patient
          active
        }
      }
    `;

    const json = await this.executeGraphql<OrganizationMembersResponse>({
      query,
      variables: {
        keywords: normalizedNpi,
        offset: 0,
        page_size: 100,
      },
    });

    if (json.errors?.length) {
      throw new BadRequestException(
        `Healthie provider lookup failed: ${JSON.stringify(json.errors)}`,
      );
    }

    const match =
      json.data?.organizationMembers.find(
        (member) =>
          member.is_patient !== true &&
          member.active !== false &&
          member.npi?.trim() === normalizedNpi,
      ) ?? null;

    return match?.id ?? null;
  }

  async ensurePatientIdForUser(
    userId: string,
    email: string,
    fullName: string | null,
  ): Promise<string> {
    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { healthiePatientId: true },
    });

    if (existingUser?.healthiePatientId) {
      return existingUser.healthiePatientId;
    }

    const { firstName, lastName } = this.splitName(fullName);

    const mutation = `
      mutation CreateClient($first_name: String, $last_name: String, $email: String!) {
        createClient(input: {
          first_name: $first_name
          last_name: $last_name
          email: $email
          dont_send_welcome: true
        }) {
          user {
            id
            email
            first_name
            last_name
          }
          messages {
            field
            message
          }
        }
      }
    `;

    let lastError: unknown;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const json = await this.executeGraphql<CreateClientResponse>({
          query: mutation,
          variables: { first_name: firstName, last_name: lastName, email },
        });

        if (json.errors) {
          throw new Error(
            `Healthie GraphQL errors: ${JSON.stringify(json.errors)}`,
          );
        }

        const result = json.data?.createClient;
        if (result?.messages?.length) {
          this.logger.warn(
            `Healthie createClient messages for user ${userId}: ${JSON.stringify(result.messages)}`,
          );
        }

        const patient = result?.user;
        if (!patient?.id) {
          throw new Error("Healthie createClient returned no patient ID");
        }

        const updatedUser = await this.prisma.user.update({
          where: { id: userId },
          data: { healthiePatientId: patient.id },
          select: { healthiePatientId: true },
        });

        this.logger.log(
          `Healthie patient ${patient.id} created for user ${userId}`,
        );
        return updatedUser.healthiePatientId!;
      } catch (error) {
        lastError = error;
        if (attempt < MAX_RETRIES) {
          const delay = Math.pow(2, attempt) * 500;
          this.logger.warn(
            `Healthie createClient attempt ${attempt + 1} failed for user ${userId}, retrying in ${delay}ms — ${error instanceof Error ? error.message : String(error)}`,
          );
          await new Promise((r) => setTimeout(r, delay));
        }
      }
    }

    throw new BadRequestException(
      `Failed to create Healthie patient: ${lastError instanceof Error ? lastError.message : String(lastError)}`,
    );
  }

  async createRequestedPayment(input: {
    userId: string;
    email: string;
    fullName: string | null;
    healthiePatientId?: string | null;
    offeringId: string;
    serviceDescription: string;
    notes?: string;
  }): Promise<HealthieRequestedPayment> {
    const recipientId =
      input.healthiePatientId ??
      (await this.ensurePatientIdForUser(
        input.userId,
        input.email,
        input.fullName,
      ));

    const mutation = `
      mutation CreateRequestedPayment($input: createRequestedPaymentInput) {
        createRequestedPayment(input: $input) {
          requestedPayment {
            id
            invoice_id
            price
            status
            currency
            created_at
          }
          messages {
            field
            message
          }
        }
      }
    `;

    const json = await this.executeGraphql<CreateRequestedPaymentResponse>({
      query: mutation,
      variables: {
        input: {
          recipient_id: recipientId,
          invoice_type: "other",
          offering_id: input.offeringId,
          notes: input.notes,
          services_provided: input.serviceDescription,
        },
      },
    });

    console.log(
      "Healthie createRequestedPayment response:",
      JSON.stringify(json),
    );

    if (json.errors?.length) {
      throw new BadRequestException(
        `Healthie billing request failed: ${JSON.stringify(json.errors)}`,
      );
    }

    const result = json.data?.createRequestedPayment;
    if (result?.messages?.length) {
      throw new BadRequestException(
        result.messages.map((message) => message.message).join(", "),
      );
    }

    if (!result?.requestedPayment?.id) {
      throw new BadRequestException(
        "Healthie billing request did not return an invoice.",
      );
    }

    return result.requestedPayment;
  }

  async getConsultationOfferings(): Promise<
    Array<{
      id: string;
      title: string;
      price: string;
      currency: string;
      billingFrequency: string | null;
      initialPaymentAmount: string | null;
      initialPriceWithTaxes: string | null;
      wait: string;
    }>
  > {
    const query = `
    query getOfferings(
      $offset: Int
      $should_paginate: Boolean
      $keywords: String
      $provider_id: ID
      $offering_id: ID
      $offering_ids: [ID]
      $only_client_visible: Boolean
      $client_visibility: String
      $offering_user_group_id: ID
      $show_only_visible: Boolean
    ) {
      offerings(
        offset: $offset
        should_paginate: $should_paginate
        keywords: $keywords
        provider_id: $provider_id
        offering_id: $offering_id
        offering_ids: $offering_ids
        only_client_visible: $only_client_visible
        client_visibility: $client_visibility
        offering_user_group_id: $offering_user_group_id
        show_only_visible: $show_only_visible
      ) {
        id
        name
        billing_frequency
        currency
        price
        initial_payment_amount
        initial_price_with_taxes
        show_price
        visibility_status
        archived
      }
    }
  `;

    const json = await this.executeGraphql<OfferingsResponse>({
      query,
      variables: {
        offset: 0,
        should_paginate: false,
        keywords: null,
        provider_id: null,
        offering_id: null,
        offering_ids: null,
        offering_user_group_id: null,
        only_client_visible: false,
        client_visibility: "all",
        show_only_visible: false,
      },
    });

    console.log("Healthie offerings response:", JSON.stringify(json));

    if (json.errors?.length) {
      throw new BadRequestException(
        `Healthie offerings request failed: ${JSON.stringify(json.errors)}`,
      );
    }

    const offerings = json.data?.offerings ?? [];

    // Filter to get non-archived offerings
    const activeOfferings = offerings.filter(
      (offering) => offering.archived === false,
    );

    console.log(`Found ${activeOfferings.length} active offerings`);

    return activeOfferings.map((offering) => ({
      id: offering.id,
      title: offering.name ?? "Untitled Offering",
      price: offering.price ?? "0",
      currency: offering.currency ?? "USD",
      billingFrequency: offering.billing_frequency ?? null,
      initialPaymentAmount: offering.initial_payment_amount ?? null,
      initialPriceWithTaxes: offering.initial_price_with_taxes ?? null,
      wait: "~5 min wait",
    }));
  }
  private async executeGraphql<TData>(input: {
    query: string;
    variables?: Record<string, unknown>;
  }): Promise<{
    data?: TData;
    errors?: unknown[];
  }> {
    const apiKey = this.configService.get<string>("HEALTHIE_API_KEY");
    const apiUrl = this.configService.get<string>(
      "HEALTHIE_API_URL",
      "https://api.gethealthie.com/graphql",
    );

    if (!apiKey) {
      throw new BadRequestException(
        "Healthie billing is not configured on the server.",
      );
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${apiKey}`,
        AuthorizationSource: "API",
      },
      body: JSON.stringify({
        query: input.query,
        variables: input.variables,
      }),
    });

    if (!response.ok) {
      throw new BadRequestException(
        `Healthie request failed with HTTP ${response.status}: ${response.statusText}`,
      );
    }

    return response.json() as Promise<{
      data?: TData;
      errors?: unknown[];
    }>;
  }

  private splitName(fullName: string | null): {
    firstName: string | null;
    lastName: string | null;
  } {
    if (!fullName) return { firstName: null, lastName: null };
    const trimmed = fullName.trim();
    const spaceIndex = trimmed.lastIndexOf(" ");
    if (spaceIndex === -1) return { firstName: trimmed, lastName: null };
    return {
      firstName: trimmed.slice(0, spaceIndex),
      lastName: trimmed.slice(spaceIndex + 1),
    };
  }
}
