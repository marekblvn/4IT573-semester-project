import { NextFunction, Request, Response } from "express";
import { ApplicationError } from "../errors/application.error";

export default (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof ApplicationError) {
    const { status, code, message, details } = err;
    console.log(
      `[ERROR] ${status} ${code}: ${message} ${JSON.stringify(details)}`,
    );
    res.status(status).json({ error: { message, code, details } });
  } else {
    const error = err as Error;
    const criticalError = new ApplicationError(
      500,
      "UNKNOWN_ERROR",
      error.message ?? "Something unexpected happened",
      { stack: error.stack },
    );
    const { status, code, message, details } = criticalError;
    console.log(
      `[ERROR] ${status} ${code}: ${message} ${JSON.stringify(details)}`,
    );
    res
      .status(criticalError.status)
      .json({ error: { message, code, details } });
  }
};
