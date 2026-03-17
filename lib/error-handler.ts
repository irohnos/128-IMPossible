export function parseDatabaseError(error: any, fallbackMessage = "An unexpected error occurred."): string {
  if (!error) return fallbackMessage;

  const code = error?.code;
  const message = error?.message?.toLowerCase() || "";
  const details = error?.details?.toLowerCase() || "";

  // Unique Constraint Violation
  if (code === '23505') {
    return "This record already exists in the database. Please check for duplicates.";
  }
  
  // Foreign Key Constraint Violation
  if (code === '23503') {
    return "Cannot complete this action because other records depend on this item.";
  }

  // Not Null Violation
  if (code === '23502') {
    return "Please fill out all required fields.";
  }

  // Invalid Text Representation
  if (code === '22P02') {
    return "Invalid data format provided. Please check your inputs.";
  }

  return error.message || fallbackMessage;
}