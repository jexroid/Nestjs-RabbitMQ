import { NotFoundException } from '@nestjs/common';

/**
 * Checks for user existence and if it was not existed it throw a Not found error
 * @param {string} existingUser
 */
export function CheckExistence(existingUser) {
  if (!existingUser) {
    throw new NotFoundException(`User not found`);
  }

  return existingUser;
}
