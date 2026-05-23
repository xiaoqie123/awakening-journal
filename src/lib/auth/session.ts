import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import type { JWTPayload } from 'jose';

interface SessionPayload extends JWTPayload {
  userId: string;
  expiresAt: Date;
}

function getEncodedKey(): Uint8Array {
  const key = process.env.SESSION_SECRET;
  if (!key || key.length < 32) {
    throw new Error(
      'SESSION_SECRET is missing or too short. ' +
      'Generate one with: openssl rand -base64 32\n' +
      'Then add it to .env.local (local) or Vercel project Settings > Environment Variables (production)'
    );
  }
  return new TextEncoder().encode(key);
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getEncodedKey());
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, getEncodedKey(), {
      algorithms: ['HS256'],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, expiresAt });
  const cookieStore = await cookies();

  cookieStore.set('awakening-session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });

  redirect('/');
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('awakening-session');
}

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get('awakening-session')?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    redirect('/login');
  }

  return { isAuth: true, userId: session.userId };
});

export async function getSessionUserId(): Promise<string | null> {
  try {
    const cookie = (await cookies()).get('awakening-session')?.value;
    const session = await decrypt(cookie);
    return session?.userId ?? null;
  } catch {
    return null;
  }
}
