import { baseLayout, emailText } from "../../auth/templates/base-layout";

export function doctorRejectedHtml(params: { note?: string }): string {
  const reasonBlock = params.note ? emailText(`Reason: ${params.note}`) : "";

  return baseLayout(`
    ${emailText("Registration Declined", "heading")}
    ${emailText("We're sorry, but your Sniffles Health physician registration has been declined by our admin team.")}
    ${reasonBlock}
    ${emailText("If you believe this was an error, please contact our support team for further assistance.", "muted")}
  `);
}

export function doctorRejectedText(params: { note?: string }): string {
  const reason = params.note ? `\nReason: ${params.note}\n` : "";

  return `Registration Declined

We're sorry, but your Sniffles Health physician registration has been declined by our admin team.
${reason}
If you believe this was an error, please contact our support team for further assistance.`;
}
