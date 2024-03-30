import { generateSalt, generateToken, hashToken } from "@/utils/token";
import { sendLoginLink } from "@/email/login";
import { createUser, getUserByEmail, updateUserLoginState } from "@/db/users";

export async function createMagicLinkForUser(email: string) {
  const cleanEmail = email.trim().toLowerCase();
  const existingUser = await getUserByEmail(cleanEmail);

  if (!existingUser) {
    console.warn(`User with ${cleanEmail} not found, ignoring.`);
    return;
  }

  const token = generateToken();
  const salt = generateSalt();

  await sendLoginLink(cleanEmail, token);
  await updateUserLoginState(cleanEmail, hashToken(token, salt), salt);
}

export async function signup(email: string, displayName: string) {
  const cleanEmail = email.trim().toLowerCase();
  const existingUser = await getUserByEmail(cleanEmail);

  if (existingUser != null) {
    // Treat it as a normal login
    await createMagicLinkForUser(cleanEmail);
    return;
  }

  // Create a new user
  const token = generateToken();
  const salt = generateSalt();

  await sendLoginLink(cleanEmail, token);
  await createUser(cleanEmail, displayName, hashToken(token, salt), salt);
}
