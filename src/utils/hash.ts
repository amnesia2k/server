import bcrypt from "bcryptjs";

/**
 * Hashes a password using bcryptjs.
 * @param password - The plain text password.
 * @returns A hashed password string.
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/**
 * Compares a plain text password with a hashed one.
 * @param input - Plain text password.
 * @param hashed - Previously hashed password from DB.
 * @returns True if match, false otherwise.
 */
export const comparePasswords = async (
  input: string,
  hashed: string
): Promise<boolean> => {
  return await bcrypt.compare(input, hashed);
};
