/**
 * Shared email layout matching the Sniffles Health brand.
 * Uses inline styles for maximum email-client compatibility.
 * Logo is embedded via CID attachment (see mail.service.ts).
 */

import { join } from "node:path";

const BRAND = {
  primary: "#146d75",
  primaryDark: "#0f5c63",
  primaryLight: "#e8f4f5",
  bg: "#f5f8f9",
  card: "#ffffff",
  textPrimary: "#2f4246",
  textSecondary: "#6a7e84",
  border: "#d7e1e4",
} as const;

export const LOGO_CID = "logo@sniffleshealth";
export const LOGO_PATH = join(__dirname, "assets", "logo.png");

export function baseLayout(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sniffles Health</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.bg};padding:40px 0;">
    <tr>
      <td align="center">
        <!-- Logo / Header -->
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;">
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <img src="cid:${LOGO_CID}" alt="Sniffles Health" width="160" style="display:block;height:auto;max-width:160px;" />
            </td>
          </tr>
        </table>

        <!-- Card -->
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background-color:${BRAND.card};border-radius:12px;border:1px solid ${BRAND.border};overflow:hidden;">
          <tr>
            <td style="padding:32px 36px;">
              ${content}
            </td>
          </tr>
        </table>

        <!-- Footer -->
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;">
          <tr>
            <td align="center" style="padding:24px 0;font-size:12px;color:${BRAND.textSecondary};line-height:18px;">
              &copy; ${new Date().getFullYear()} Sniffles Health. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function emailButton(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;">
  <tr>
    <td align="center" style="background-color:${BRAND.primary};border-radius:8px;">
      <a href="${href}" target="_blank" style="display:inline-block;padding:12px 32px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;">
        ${label}
      </a>
    </td>
  </tr>
</table>`;
}

export function emailText(text: string, style?: "heading" | "muted"): string {
  if (style === "heading") {
    return `<h1 style="margin:0 0 16px;font-size:20px;font-weight:700;color:${BRAND.textPrimary};line-height:28px;">${text}</h1>`;
  }
  if (style === "muted") {
    return `<p style="margin:0 0 12px;font-size:13px;color:${BRAND.textSecondary};line-height:20px;">${text}</p>`;
  }
  return `<p style="margin:0 0 12px;font-size:14px;color:${BRAND.textPrimary};line-height:22px;">${text}</p>`;
}
