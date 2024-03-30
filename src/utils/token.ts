import crypto from "crypto";

export function hashToken(token: string, salt: string) {
  return crypto.pbkdf2Sync(token, salt, 1000, 64, "sha512").toString("hex");
}

export function generateToken() {
  return crypto.randomBytes(64).toString("hex");
}

export function generateSalt() {
  return crypto.randomBytes(16).toString("hex");
}

export function generateSessionId() {
  return crypto.randomBytes(16).toString("hex");
}
