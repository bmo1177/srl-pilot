/**
 * Utility to sanitize database errors and prevent information leakage
 * Maps technical error codes to user-friendly messages
 */

interface PostgresError {
  code?: string;
  message?: string;
  details?: string;
}

const ERROR_MESSAGES: Record<string, string> = {
  // Unique constraint violations
  '23505': 'This record already exists. Please use a different value.',
  
  // Foreign key violations
  '23503': 'Referenced record not found. Please check your selection.',
  
  // Check constraint violations
  '23514': 'Invalid data provided. Please check your input.',
  
  // Not null violations
  '23502': 'Required field is missing. Please fill in all required fields.',
  
  // RLS policy violations
  '42501': 'Access denied. You do not have permission to perform this action.',
  'PGRST301': 'Access denied. Authentication required.',
  
  // Generic database errors
  '08000': 'Database connection error. Please try again.',
  '53300': 'Database is temporarily unavailable. Please try again later.',
};

/**
 * Sanitize database errors for user display
 * Prevents leaking internal database structure information
 * 
 * @param error - Error object from Supabase or database
 * @returns User-friendly error message
 */
export function sanitizeError(error: any): string {
  // Handle null/undefined
  if (!error) {
    return 'An unexpected error occurred. Please try again.';
  }

  // Check for PostgreSQL error code
  if (error.code && ERROR_MESSAGES[error.code]) {
    return ERROR_MESSAGES[error.code];
  }

  // Check for common Supabase/PostgREST errors
  if (error.message) {
    const message = error.message.toLowerCase();
    
    if (message.includes('row-level security')) {
      return 'Access denied. You do not have permission to access this data.';
    }
    
    if (message.includes('unique constraint')) {
      return 'This record already exists. Please use a different value.';
    }
    
    if (message.includes('foreign key')) {
      return 'Invalid reference. Please check your selection.';
    }
    
    if (message.includes('not found')) {
      return 'The requested resource was not found.';
    }
    
    if (message.includes('duplicate')) {
      return 'This record already exists.';
    }
    
    if (message.includes('invalid')) {
      return 'Invalid data provided. Please check your input.';
    }
  }

  // Default safe message (log the actual error server-side in production)
  console.error('Unhandled database error:', error);
  return 'An error occurred. Please try again or contact support if the problem persists.';
}

/**
 * Log detailed errors (in development) while showing safe messages to users
 * In production, this should send errors to a logging service
 */
export function handleDatabaseError(error: any, context?: string): string {
  const sanitized = sanitizeError(error);
  
  // In development, log the full error for debugging
  if (import.meta.env.DEV && context) {
    console.error(`[${context}] Database error:`, error);
  }
  
  // In production, send to logging service (e.g., Sentry, LogRocket)
  // if (import.meta.env.PROD) {
  //   logToService(error, context);
  // }
  
  return sanitized;
}
