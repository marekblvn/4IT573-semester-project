import z from "zod";

export const JoinRoomSchema = z.object({
  roomCode: z.string().min(1).max(5),
});

export const LeaveRoomSchema = JoinRoomSchema.clone();
