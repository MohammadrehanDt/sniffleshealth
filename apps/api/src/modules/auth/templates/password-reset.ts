import { baseLayout, emailButton, emailText } from "./base-layout";

export function passwordResetHtml(params: {
  resetLink: string;
  expiresInMinutes: number;
}): string {
  return baseLayout(
    [
      emailText("Reset Your Password", "heading"),
      emailText(
        "We received a request to reset your Sniffles Health account password.",
      ),
      emailText("Click the button below to choose a new password:"),
      emailButton(params.resetLink, "Reset Password"),
      emailText(
        `This link is valid for ${params.expiresInMinutes} minutes. If it expires, you can request a new one.`,
        "muted",
      ),
      emailText(
        "If you didn't request this, you can safely ignore this email — your password won't change.",
        "muted",
      ),
    ].join("\n"),
  );
}

export function passwordResetText(params: {
  resetLink: string;
  expiresInMinutes: number;
}): string {
  return [
    "Reset Your Password",
    "",
    "We received a request to reset your Sniffles Health account password.",
    "",
    `Use this link to reset it: ${params.resetLink}`,
    "",
    `This link is valid for ${params.expiresInMinutes} minutes.`,
    "",
    "If you didn't request this, you can safely ignore this email.",
  ].join("\n");
}
