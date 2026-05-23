'use server';

import { createSession, deleteSession } from '@/lib/auth/session';
import { getUserByEmail, createUser, verifyPassword } from '@/lib/auth/users';
import { redirect } from 'next/navigation';

type FormState = {
  errors?: { email?: string[]; password?: string[]; name?: string[] };
  message?: string;
};

export async function register(prevState: FormState, formData: FormData): Promise<FormState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  const errors: FormState['errors'] = {};

  if (!email || !email.includes('@')) {
    errors.email = ['请输入有效的邮箱地址'];
  }
  if (!password || password.length < 8) {
    errors.password = ['密码至少 8 个字符'];
  }
  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const existing = await getUserByEmail(email);
  if (existing) {
    return { message: '该邮箱已注册' };
  }

  const user = await createUser(email, password, name || undefined);
  await createSession(user.id);
  redirect('/');
}

export async function login(prevState: FormState, formData: FormData): Promise<FormState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { message: '请填写邮箱和密码' };
  }

  const user = await getUserByEmail(email);
  if (!user) {
    return { message: '邮箱或密码不正确' };
  }

  const valid = await verifyPassword(user, password);
  if (!valid) {
    return { message: '邮箱或密码不正确' };
  }

  await createSession(user.id);
  redirect('/');
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}
