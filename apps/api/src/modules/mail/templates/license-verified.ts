import { baseLayout, emailText } from "../../auth/templates/base-layout";

export function licenseVerifiedHtml(params: {
  stateCode: string;
  stateName: string;
}): string {
  return baseLayout(`
    ${emailText("State License Verified", "heading")}
    ${emailText(`Your ${params.stateName} (${params.stateCode}) state license has been verified by our admin team.`)}
    ${emailText("You can now service patients in this state through Sniffles Health.")}
    ${emailText("If you have any questions, please contact our support team.", "muted")}
  `);
}

export function licenseVerifiedText(params: {
  stateCode: string;
  stateName: string;
}): string {
  return `State License Verified

Your ${params.stateName} (${params.stateCode}) state license has been verified by our admin team.

You can now service patients in this state through Sniffles Health.

If you have any questions, please contact our support team.`;
}
