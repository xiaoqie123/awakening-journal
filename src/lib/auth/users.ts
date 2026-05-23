import bcrypt from 'bcryptjs';
import { readJson, writeJson, fileExists } from '@/lib/storage';

const USERS_PATH = 'data/users.json';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  createdAt: string;
}

async function getUsers(): Promise<User[]> {
  if (!(await fileExists(USERS_PATH))) return [];
  return readJson<User[]>(USERS_PATH);
}

async function saveUsers(users: User[]): Promise<void> {
  await writeJson(USERS_PATH, users);
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const users = await getUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function getUserById(id: string): Promise<User | null> {
  const users = await getUsers();
  return users.find(u => u.id === id) ?? null;
}

export async function createUser(
  email: string,
  password: string,
  name?: string,
): Promise<User> {
  const passwordHash = await bcrypt.hash(password, 10);
  const user: User = {
    id: crypto.randomUUID(),
    email: email.toLowerCase().trim(),
    passwordHash,
    name: name || email.split('@')[0],
    createdAt: new Date().toISOString(),
  };

  const users = await getUsers();
  users.push(user);
  await saveUsers(users);

  return user;
}

export async function verifyPassword(user: User, password: string): Promise<boolean> {
  return bcrypt.compare(password, user.passwordHash);
}
