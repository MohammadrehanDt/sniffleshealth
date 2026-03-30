import {
  baseLayout,
  emailButton,
  emailText,
} from "../../auth/templates/base-layout";

export function licenseExpiryReminderHtml(params: {
  stateCode: string;
  stateName: string;
  expiryDate: string;
  daysRemaining: number;
  renewUrl: string;
}): string {
  return baseLayout(`
    ${emailText("License Expiring Soon", "heading")}
    ${emailText(`Your ${params.stateName} (${params.stateCode}) medical license expires on <strong>${params.expiryDate}</strong> — that's ${params.daysRemaining} days from now.`)}
    ${emailText("Please renew your license to continue servicing patients in this state. Upload your new certificate and updated expiry date.")}
    ${emailButton(params.renewUrl, "Renew License")}
    ${emailText("If your license expires without renewal, you will be unable to see patients in this state.", "muted")}
  `);
}

export function licenseExpiryReminderText(params: {
  stateCode: string;
  stateName: string;
  expiryDate: string;
  daysRemaining: number;
  renewUrl: string;
}): string {
  return `License Expiring Soon

Your ${params.stateName} (${params.stateCode}) medical license expires on ${params.expiryDate} — that's ${params.daysRemaining} days from now.

Please renew your license to continue servicing patients in this state. Upload your new certificate and updated expiry date.

Renew here: ${params.renewUrl}

If your license expires without renewal, you will be unable to see patients in this state.`;
}
