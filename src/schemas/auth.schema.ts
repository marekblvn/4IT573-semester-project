import z from "zod";

export const RegisterUserSchema = z.object({
  username: z.string().min(3).max(24),
  name: z.string().min(3).max(24).optional(),
  password: z.string().min(8).max(64),
});

export const LoginUserSchema = z.object({
  username: z.string(),
  password: z.string(),
});
