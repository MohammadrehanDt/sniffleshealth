import {
  baseLayout,
  emailButton,
  emailText,
} from "../../auth/templates/base-layout";

export function doctorVerifiedHtml(params: { loginUrl: string }): string {
  return baseLayout(`
    ${emailText("Account Verified", "heading")}
    ${emailText("Your Sniffles Health physician account has been verified by our admin team.")}
    ${emailText("You can now log in and start managing your state licenses to begin servicing patients.")}
    ${emailButton(params.loginUrl, "Log In to Your Account")}
    ${emailText("If you have any questions, please contact our support team.", "muted")}
  `);
}

export function doctorVerifiedText(params: { loginUrl: string }): string {
  return `Account Verified

Your Sniffles Health physician account has been verified by our admin team.

You can now log in and start managing your state licenses to begin servicing patients.

Log in here: ${params.loginUrl}

If you have any questions, please contact our support team.`;
}
