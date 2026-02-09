/**
 * Sanitizes error messages to prevent sensitive information leakage
 * and provides user-friendly error messages for common scenarios.
 */
export function sanitizeErrorMessage(error: unknown): string {
  if (!error) return 'An unknown error occurred';

  const errorMessage = error instanceof Error ? error.message : String(error);

  // Network errors
  if (errorMessage.toLowerCase().includes('network') || 
      errorMessage.toLowerCase().includes('fetch') ||
      errorMessage.toLowerCase().includes('connection')) {
    return 'Network error. Please check your connection and try again.';
  }

  // Authorization errors - sanitize to prevent password leakage
  if (errorMessage.toLowerCase().includes('unauthorized') ||
      errorMessage.toLowerCase().includes('access denied') ||
      errorMessage.toLowerCase().includes('permission')) {
    return 'Access denied. Please check your credentials.';
  }

  // Invalid passcode - generic message
  if (errorMessage.toLowerCase().includes('password') ||
      errorMessage.toLowerCase().includes('passcode') ||
      errorMessage.toLowerCase().includes('invalid')) {
    return 'Invalid passcode. Please try again.';
  }

  // Timeout errors
  if (errorMessage.toLowerCase().includes('timeout')) {
    return 'Request timed out. Please try again.';
  }

  // Generic fallback
  return 'An error occurred. Please try again.';
}

/**
 * Determines if an error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  if (!error) return false;

  const errorMessage = error instanceof Error ? error.message : String(error);
  
  return (
    errorMessage.toLowerCase().includes('network') ||
    errorMessage.toLowerCase().includes('timeout') ||
    errorMessage.toLowerCase().includes('fetch')
  );
}
