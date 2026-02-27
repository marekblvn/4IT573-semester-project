import { randomBytes } from "node:crypto";

const randomCode = (length: number = 5) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  const randomBytesBuffer = randomBytes(length);
  for (let i = 0; i < length; i++) {
    result += chars.charAt(randomBytesBuffer[i] % chars.length);
  }
  return result;
};
export default randomCode;
