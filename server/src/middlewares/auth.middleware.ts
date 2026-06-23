import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ApplicationError } from "../errors/application.error";
import { UserContext, userContext } from "../contexts/user.context";

export default (req: Request, _res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new ApplicationError(401, "UNAUTHORIZED", "User is not authorized");
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as UserContext;
    userContext.run(decoded, () => {
      next();
    });
  } catch (error) {
    throw new ApplicationError(401, "UNAUTHORIZED", "Invalid token");
  }
};
