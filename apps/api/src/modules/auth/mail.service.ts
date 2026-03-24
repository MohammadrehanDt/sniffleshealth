import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import nodemailer, { type Transporter } from "nodemailer";
import { LOGO_CID, LOGO_PATH } from "./templates/base-layout";
import {
  passwordResetHtml,
  passwordResetText,
} from "./templates/password-reset";
import {
  passwordResetConfirmationHtml,
  passwordResetConfirmationText,
} from "./templates/password-reset-confirmation";

@Injectable()
export class AuthMailService {
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

  private async send(options: {
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
      auth: {
        user,
        pass,
      },
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
}
