/**
 * Shared form validation helpers for Presale and Airdrop forms.
 * Provides consistent validation logic and error messages.
 */

export interface FormData {
  name: string;
  country: string;
  walletAddress: string;
  rbsAmount: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface NormalizedFormPayload {
  name: string;
  country: string;
  walletAddress: string;
  rbsAmount: number;
  isPresale: boolean;
}

/**
 * Validates form data and returns validation result
 */
export function validateFormData(data: FormData): ValidationResult {
  // Trim and check name
  const name = data.name.trim();
  if (!name) {
    return { isValid: false, error: 'Please enter your name' };
  }

  // Trim and check country
  const country = data.country.trim();
  if (!country) {
    return { isValid: false, error: 'Please enter your country' };
  }

  // Trim and check wallet address
  const walletAddress = data.walletAddress.trim();
  if (!walletAddress) {
    return { isValid: false, error: 'Please enter your wallet address' };
  }

  // Validate RBS amount
  const amountStr = data.rbsAmount.trim();
  if (!amountStr) {
    return { isValid: false, error: 'Please enter RBS amount' };
  }

  const amount = parseFloat(amountStr);
  if (isNaN(amount)) {
    return { isValid: false, error: 'Please enter a valid number for RBS amount' };
  }

  if (amount <= 0) {
    return { isValid: false, error: 'RBS amount must be greater than zero' };
  }

  return { isValid: true };
}

/**
 * Normalizes form data into backend payload format
 */
export function normalizeFormPayload(
  data: FormData,
  isPresale: boolean
): NormalizedFormPayload {
  return {
    name: data.name.trim(),
    country: data.country.trim(),
    walletAddress: data.walletAddress.trim(),
    rbsAmount: parseFloat(data.rbsAmount.trim()),
    isPresale,
  };
}

/**
 * Resets form data to empty state
 */
export function getEmptyFormData(): FormData {
  return {
    name: '',
    country: '',
    walletAddress: '',
    rbsAmount: '',
  };
}
