// Utility helpers for phone numbers

export function toE164(
  input: string,
  defaultCountry: "US" | "" = "US"
): string | null {
  if (!input) return null;

  // Clean the input → only digits (keep leading + for detection).
  const hasPlus = input.trim().startsWith("+");
  const digitsOnly = input.replace(/\D+/g, "");

  if (!digitsOnly) return null;

  if (hasPlus) {
    return `+${digitsOnly}`;
  }

  if (defaultCountry === "US") {
    if (digitsOnly.length === 10) return `+1${digitsOnly}`;
    if (digitsOnly.length === 11 && digitsOnly.startsWith("1")) {
      return `+${digitsOnly}`;
    }
  }

  return `+${digitsOnly}`;
}

export function normalizePhoneNumber(phone: string): string {
  return toE164(phone) ?? "";
}
