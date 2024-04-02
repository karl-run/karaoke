import { createUser, getUserByEmail, updateUserLoginState } from 'server/user/user-db';

import { generate16ByteHex, generate64ByteHex, hashWithSalt } from 'utils/token';
import {sendLoginLink} from "@/server/email/email-service";

export async function createMagicLinkForUser(email: string) {
  const cleanEmail = email.trim().toLowerCase();
  const existingUser = await getUserByEmail(cleanEmail);

  if (!existingUser) {
    console.warn(`User with ${cleanEmail} not found, ignoring.`);
    return;
  }

  const token = generate64ByteHex();
  const salt = generate16ByteHex();

  await sendLoginLink(cleanEmail, token);
  await updateUserLoginState(cleanEmail, hashWithSalt(token, salt), salt);
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
  const token = generate64ByteHex();
  const salt = generate16ByteHex();

  await sendLoginLink(cleanEmail, token);
  await createUser(cleanEmail, displayName, hashWithSalt(token, salt), salt);
}
