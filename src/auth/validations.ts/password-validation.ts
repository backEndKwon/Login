/* password validation */
import * as argon from 'argon2';
export async function validatePassword(storedPassword: string, inputPassword) {
  return await argon.verify(storedPassword, inputPassword);
}
