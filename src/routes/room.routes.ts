import { Router } from "express";
import { create, join, leave } from "../handlers/room.handler";

const createRoomRouter = () => {
  const router = Router();
  router.post("/create", create);
  router.post("/join", join);
  router.post("/leave", leave);
  return router;
};

export default createRoomRouter;
