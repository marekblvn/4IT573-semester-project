import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validate from "../../utils/validate";
import { LoginUserSchema, RegisterUserSchema } from "../../schemas/auth.schema";
import UserDao from "../../dao/user.dao";
import { ApplicationError } from "../../errors/application.error";

export const register = async (req: Request, res: Response) => {
  const { username, password, name } = await validate(
    RegisterUserSchema,
    req.body,
  );
  const existingUser = await UserDao.findByUsername(username);
  if (existingUser) {
    throw new ApplicationError(
      400,
      "USERNAME_TAKEN",
      `Username '${username}' is already taken`,
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await UserDao.create({
    username,
    password: hashedPassword,
    name: name ?? username,
  });

  return res.status(201).json({ username: newUser.username });
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = await validate(LoginUserSchema, req.body);
  const user = await UserDao.findByUsername(username);
  if (!user) {
    throw new ApplicationError(
      400,
      "INVALID_CREDENTIALS",
      "Invalid credentials",
    );
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApplicationError(
      400,
      "INVALID_CREDENTIALS",
      "Invalid credentials",
    );
  }

  const token = jwt.sign(
    { userId: user.id, username: user.username },
    process.env.JWT_SECRET as string,
    { expiresIn: "24h" },
  );

  return res.status(200).json({ token, name: user.name });
};
