import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";
import { searchUsersByNameOrEmail } from "../models/UserModel.js";




const SALT_ROUNDS = 10;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class UserServiceError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = "UserServiceError";
    this.status = status;
  }
}

function toUserDTO(u) {
  // Never leak passwordHash to the Client.
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    image: u.image ?? null,
    createdAt: u.createdAt.toISOString(),
  };
}

/** Registers a new user with a hashed password. */
export async function createUser({ name, email, password, image }) {
  const trimmedName = (name || "").trim();
  const normalizedEmail = (email || "").trim().toLowerCase();

  if (!trimmedName) {
    throw new UserServiceError("Name is required");
  }
  if (!EMAIL_RE.test(normalizedEmail)) {
    throw new UserServiceError("A valid email is required");
  }
  if (!password || password.length < 8) {
    throw new UserServiceError("Password must be at least 8 characters");
  }

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    throw new UserServiceError("An account with that email already exists", 409);
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { name: trimmedName, email: normalizedEmail, passwordHash, image: image ?? null },
  });

  return toUserDTO(user);
}

/** Verifies email/password credentials and returns the user if valid. */
export async function authenticateUser(email, password) {
  const normalizedEmail = (email || "").trim().toLowerCase();

  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!user) {
    throw new UserServiceError("Invalid email or password", 401);
  }

  const valid = await bcrypt.compare(password || "", user.passwordHash);
  if (!valid) {
    throw new UserServiceError("Invalid email or password", 401);
  }

  return toUserDTO(user);
}

/** Fetches a single user by id. */
export async function getUserById(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new UserServiceError("User not found", 404);
  }
  return toUserDTO(user);
}

/** Fetches a single user by email. */
export async function getUserByEmail(email) {
  const normalizedEmail = (email || "").trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!user) {
    throw new UserServiceError("User not found", 404);
  }
  return toUserDTO(user);
}

/** Updates editable profile fields (name/image). Email/password go through dedicated flows. */
export async function updateProfile(userId, { name, image } = {}) {
  const data = {};

  if (name !== undefined) {
    const trimmedName = name.trim();
    if (!trimmedName) {
      throw new UserServiceError("Name cannot be empty");
    }
    data.name = trimmedName;
  }
  if (image !== undefined) {
    data.image = image;
  }
  if (Object.keys(data).length === 0) {
    throw new UserServiceError("No fields to update");
  }

  const user = await prisma.user.update({ where: { id: userId }, data });
  return toUserDTO(user);
}

/** Changes a user's password after verifying the current one. */
export async function changePassword(userId, currentPassword, newPassword) {
  if (!newPassword || newPassword.length < 8) {
    throw new UserServiceError("New password must be at least 8 characters");
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new UserServiceError("User not found", 404);
  }

  const valid = await bcrypt.compare(currentPassword || "", user.passwordHash);
  if (!valid) {
    throw new UserServiceError("Current password is incorrect", 401);
  }

  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });

  return { success: true };
}

/**
 * Searches users by name or email prefix — used for "start a new chat" pickers.
 * Excludes the requesting user from results.
 */
export async function searchUsers(query, excludeUserId, limit = 10) {
  const trimmed = (query || "").trim();
  if (!trimmed) return [];

  const users = await prisma.user.findMany({
    where: {
      id: { not: excludeUserId },
      OR: [
        { name: { contains: trimmed, mode: "insensitive" } },
        { email: { contains: trimmed, mode: "insensitive" } },
      ],
    },
    take: Math.min(limit, 25),
    orderBy: { name: "asc" },
  });

  return users.map(toUserDTO);
}

/** Deletes a user account. Related conversations/messages cascade per the Prisma schema. */
export async function deleteUser(userId) {
  await prisma.user.delete({ where: { id: userId } });
  return { success: true };
}



export const searchUsersService = async (query, currentUserId) => {
  return await searchUsersByNameOrEmail(
    query,
    currentUserId
  );
};