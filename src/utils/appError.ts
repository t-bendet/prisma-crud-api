class AppError extends Error {
  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    // isOperational is used to distinguish between operational errors (like validation errors) and programming errors (like syntax errors)don't leak error details
    // Operational errors are expected errors that can be handled gracefully
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  statusCode: number;
  status: string;
  isOperational: boolean;
}

export default AppError;
