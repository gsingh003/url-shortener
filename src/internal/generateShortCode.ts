import { randomBytes } from "crypto";

export const generateShortCode = (): string => {
    // create a random 6-character string
    return randomBytes(5).toString("base64url").slice(0, 6);
};
