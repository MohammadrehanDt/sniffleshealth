import {
  baseLayout,
  emailButton,
  emailText,
} from "../../auth/templates/base-layout";

export function licenseExpiredHtml(params: {
  stateCode: string;
  stateName: string;
  renewUrl: string;
}): string {
  return baseLayout(`
    ${emailText("License Expired", "heading")}
    ${emailText(`Your ${params.stateName} (${params.stateCode}) medical license has expired.`)}
    ${emailText("You can no longer service patients in this state until you renew your license and it is verified by our admin team.")}
    ${emailButton(params.renewUrl, "Renew License Now")}
    ${emailText("If you have already renewed your license, please upload the updated certificate and expiry date.", "muted")}
  `);
}

export function licenseExpiredText(params: {
  stateCode: string;
  stateName: string;
  renewUrl: string;
}): string {
  return `License Expired

Your ${params.stateName} (${params.stateCode}) medical license has expired.

You can no longer service patients in this state until you renew your license and it is verified by our admin team.

Renew here: ${params.renewUrl}

If you have already renewed your license, please upload the updated certificate and expiry date.`;
}
