import { Router } from "express";
import { login, register } from "../handlers/http/auth.handler";

const createAuthRouter = () => {
  const router = Router();
  router.post("/register", register);
  router.post("/login", login);
  return router;
};

export default createAuthRouter;
