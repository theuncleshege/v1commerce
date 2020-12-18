import bcrypt from 'bcryptjs';

export const APP_SECRET = process.env.APP_SECRET as string;

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function isValidUnencryptedValue(
  unencryptedValue: string,
  hash: string
) {
  return await bcrypt.compare(unencryptedValue, hash);
}
