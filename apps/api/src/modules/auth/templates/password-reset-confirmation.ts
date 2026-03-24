import { baseLayout, emailText } from "./base-layout";

export function passwordResetConfirmationHtml(): string {
  return baseLayout(
    [
      emailText("Password Changed Successfully", "heading"),
      emailText("Your Sniffles Health account password has been updated."),
      emailText("You can now log in using your new password."),
      emailText(
        "If you did not make this change, please contact our support team immediately.",
        "muted",
      ),
    ].join("\n"),
  );
}

export function passwordResetConfirmationText(): string {
  return [
    "Password Changed Successfully",
    "",
    "Your Sniffles Health account password has been updated.",
    "",
    "You can now log in using your new password.",
    "",
    "If you did not make this change, please contact our support team immediately.",
  ].join("\n");
}
