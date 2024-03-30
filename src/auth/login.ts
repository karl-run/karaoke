import { generateSalt, generateToken, hashToken } from "@/utils/token";
import { sendLoginLink } from "@/email/login";
import { createUser, getUserByEmail, updateUserLoginState } from "@/db/users";

export async function createMagicLinkForUser(email: string) {
  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    console.warn(`User with ${email} not found, ignoring.`);
    return;
  }

  const token = generateToken();
  const salt = generateSalt();

  await sendLoginLink(email, token);
  await updateUserLoginState(email, hashToken(token, salt), salt);
}

export async function signup(email: string, displayName: string) {
  const existingUser = await getUserByEmail(email);

  if (existingUser != null) {
    // Treat it as a normal login
    await createMagicLinkForUser(email);
    return;
  }

  // Create a new user
  const token = generateToken();
  const salt = generateSalt();

  await sendLoginLink(email, token);
  await createUser(email, displayName, hashToken(token, salt), salt);
}
