import { ZodType } from "zod";
import { ValidationError } from "../errors/application.error";

export default async <T>(schema: ZodType<T>, value: unknown): Promise<T> => {
  const validationResult = await schema.safeParseAsync(value);
  if (validationResult.error) {
    throw new ValidationError(validationResult.error);
  }
  return validationResult.data;
};
