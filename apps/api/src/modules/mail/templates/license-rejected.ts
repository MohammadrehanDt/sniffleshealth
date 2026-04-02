import { baseLayout, emailText } from "../../auth/templates/base-layout";

export function licenseRejectedHtml(params: {
  stateCode: string;
  stateName: string;
  reason?: string;
}): string {
  const reasonBlock = params.reason
    ? emailText(`Reason: ${params.reason}`)
    : "";

  return baseLayout(`
    ${emailText("State License Declined", "heading")}
    ${emailText(`Your ${params.stateName} (${params.stateCode}) state license submission has been declined.`)}
    ${reasonBlock}
    ${emailText("Please review the feedback and resubmit your license with the correct information.", "muted")}
  `);
}

export function licenseRejectedText(params: {
  stateCode: string;
  stateName: string;
  reason?: string;
}): string {
  const reason = params.reason ? `\nReason: ${params.reason}\n` : "";

  return `State License Declined

Your ${params.stateName} (${params.stateCode}) state license submission has been declined.
${reason}
Please review the feedback and resubmit your license with the correct information.`;
}
