import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import nodemailer, { type Transporter } from "nodemailer";
import { LOGO_CID, LOGO_PATH } from "../auth/templates/base-layout";
import {
  passwordResetHtml,
  passwordResetText,
} from "../auth/templates/password-reset";
import {
  passwordResetConfirmationHtml,
  passwordResetConfirmationText,
} from "../auth/templates/password-reset-confirmation";
import {
  doctorRejectedHtml,
  doctorRejectedText,
} from "./templates/doctor-rejected";
import {
  doctorVerifiedHtml,
  doctorVerifiedText,
} from "./templates/doctor-verified";
import {
  licenseExpiredHtml,
  licenseExpiredText,
} from "./templates/license-expired";
import {
  licenseExpiryReminderHtml,
  licenseExpiryReminderText,
} from "./templates/license-expiry-reminder";
import {
  licenseRejectedHtml,
  licenseRejectedText,
} from "./templates/license-rejected";
import {
  licenseVerifiedHtml,
  licenseVerifiedText,
} from "./templates/license-verified";

@Injectable()
export class MailService {
  @Inject(ConfigService)
  private readonly configService!: ConfigService;

  private transporter: Transporter | null = null;

  async sendPasswordResetEmail(params: {
    email: string;
    resetLink: string;
    expiresInMinutes: number;
  }) {
    await this.send({
      to: params.email,
      subject: "Reset your Sniffles Health password",
      text: passwordResetText(params),
      html: passwordResetHtml(params),
    });
  }

  async sendPasswordResetConfirmationEmail(email: string) {
    await this.send({
      to: email,
      subject: "Your Sniffles Health password was changed",
      text: passwordResetConfirmationText(),
      html: passwordResetConfirmationHtml(),
    });
  }

  async sendDoctorVerifiedEmail(params: { email: string }) {
    const loginUrl = this.getWebUrl("/login");

    await this.send({
      to: params.email,
      subject: "Your Sniffles Health physician account is approved",
      text: doctorVerifiedText({ loginUrl }),
      html: doctorVerifiedHtml({ loginUrl }),
    });
  }

  async sendDoctorRejectedEmail(params: { email: string; note?: string }) {
    await this.send({
      to: params.email,
      subject: "Your Sniffles Health physician registration was declined",
      text: doctorRejectedText({ note: params.note }),
      html: doctorRejectedHtml({ note: params.note }),
    });
  }

  async sendLicenseVerifiedEmail(params: { email: string; stateCode: string }) {
    const stateName = this.getStateName(params.stateCode);

    await this.send({
      to: params.email,
      subject: `${stateName} license approved`,
      text: licenseVerifiedText({
        stateCode: params.stateCode,
        stateName,
      }),
      html: licenseVerifiedHtml({
        stateCode: params.stateCode,
        stateName,
      }),
    });
  }

  async sendLicenseRejectedEmail(params: {
    email: string;
    stateCode: string;
    reason?: string;
  }) {
    const stateName = this.getStateName(params.stateCode);

    await this.send({
      to: params.email,
      subject: `${stateName} license needs updates`,
      text: licenseRejectedText({
        stateCode: params.stateCode,
        stateName,
        reason: params.reason,
      }),
      html: licenseRejectedHtml({
        stateCode: params.stateCode,
        stateName,
        reason: params.reason,
      }),
    });
  }

  async sendLicenseExpiryReminderEmail(params: {
    email: string;
    stateCode: string;
    expiryDate: Date;
    daysRemaining: number;
  }) {
    const stateName = this.getStateName(params.stateCode);
    const renewUrl = this.getWebUrl(`/licenses?state=${params.stateCode}`);

    await this.send({
      to: params.email,
      subject: `${stateName} license expires in ${params.daysRemaining} days`,
      text: licenseExpiryReminderText({
        stateCode: params.stateCode,
        stateName,
        expiryDate: params.expiryDate.toLocaleDateString("en-US"),
        daysRemaining: params.daysRemaining,
        renewUrl,
      }),
      html: licenseExpiryReminderHtml({
        stateCode: params.stateCode,
        stateName,
        expiryDate: params.expiryDate.toLocaleDateString("en-US"),
        daysRemaining: params.daysRemaining,
        renewUrl,
      }),
    });
  }

  async sendLicenseExpiredEmail(params: { email: string; stateCode: string }) {
    const stateName = this.getStateName(params.stateCode);
    const renewUrl = this.getWebUrl(`/licenses?state=${params.stateCode}`);

    await this.send({
      to: params.email,
      subject: `${stateName} license expired`,
      text: licenseExpiredText({
        stateCode: params.stateCode,
        stateName,
        renewUrl,
      }),
      html: licenseExpiredHtml({
        stateCode: params.stateCode,
        stateName,
        renewUrl,
      }),
    });
  }

  async send(options: {
    to: string;
    subject: string;
    text: string;
    html: string;
  }) {
    const transporter = this.getTransporter();

    await transporter.sendMail({
      from: this.getFromAddress(),
      attachments: [
        {
          filename: "logo.png",
          path: LOGO_PATH,
          cid: LOGO_CID,
        },
      ],
      ...options,
    });
  }

  private getTransporter() {
    if (this.transporter) {
      return this.transporter;
    }

    const host = this.configService.get<string>("SMTP_HOST");
    const port = this.configService.get<number>("SMTP_PORT");
    const user = this.configService.get<string>("SMTP_USER");
    const pass = this.configService.get<string>("SMTP_PASS");
    const secure = this.configService.get<boolean>("SMTP_SECURE", false);

    if (!host || !port || !user || !pass) {
      throw new InternalServerErrorException(
        "SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_FROM.",
      );
    }

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });

    return this.transporter;
  }

  private getFromAddress() {
    const from = this.configService.get<string>("SMTP_FROM");
    if (!from) {
      throw new InternalServerErrorException("SMTP_FROM is not configured.");
    }
    return from;
  }

  private getWebUrl(path: string) {
    const baseUrl = this.configService
      .get<string>("WEB_URL", "http://localhost:5173")
      .replace(/\/+$/, "");

    return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  }

  private getStateName(stateCode: string) {
    return US_STATE_NAMES[stateCode.toUpperCase()] ?? stateCode.toUpperCase();
  }
}

const US_STATE_NAMES: Record<string, string> = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
  DC: "District of Columbia",
};
