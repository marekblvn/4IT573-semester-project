export class ApplicationError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details?: Record<string, any>;
  constructor(
    status: number,
    code: string,
    message: string,
    details?: Record<string, any>,
  ) {
    super(message);
    this.message = message;
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export class ValidationError extends ApplicationError {
  constructor(validationErrorDetails: Record<string, any>) {
    super(400, "VALIDATION_ERROR", "Validation failed", validationErrorDetails);
  }
}
