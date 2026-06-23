import { AsyncLocalStorage } from "node:async_hooks";

export interface UserContext {
  userId: number;
  username: string;
}

export const userContext = new AsyncLocalStorage<UserContext>();

export const getCurrentUser = () => userContext.getStore();
