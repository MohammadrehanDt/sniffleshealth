export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_SPECIAL_CHARACTERS = "@$!%*?&";

export const passwordPatterns = {
  lowercase: /[a-z]/,
  uppercase: /[A-Z]/,
  number: /\d/,
  specialCharacter: /[@$!%*?&]/,
};

export const passwordMessages = {
  required: "Password is required",
  minLength: `Minimum ${PASSWORD_MIN_LENGTH} characters`,
  lowercase: "Must contain a lowercase letter",
  uppercase: "Must contain an uppercase letter",
  number: "Must contain a number",
  specialCharacter: `Must contain a special character (${PASSWORD_SPECIAL_CHARACTERS})`,
  backendMinLength: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
};
