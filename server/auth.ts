// server/api/auth.ts (or wherever your Next.js API routes live)
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from './db';
import * as schema from '@shared/schema';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize, parse } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';
const TOKEN_NAME = 'token';

async function findUserByEmail(email: string) {
  const users = await db.select().from(schema.users).where(schema.users.email.eq(email));
  return users.length > 0 ? users[0] : null;
}

export async function loginHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const valid = await bcrypt.compare(password, user.password_hash); // Adjust field name as per your schema
    if (!valid) return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.setHeader(
      'Set-Cookie',
      serialize(TOKEN_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
        sameSite: 'lax',
      })
    );

    res.status(200).json({ message: 'Logged in successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function logoutHandler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader(
    'Set-Cookie',
    serialize(TOKEN_NAME, '', {
      maxAge: -1,
      path: '/',
    })
  );
  res.status(200).json({ message: 'Logged out' });
}

export async function checkAuth(req: NextApiRequest, res: NextApiResponse) {
  try {
    const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
    const token = cookies[TOKEN_NAME];
    if (!token) return res.status(401).json({ message: 'Not authenticated' });

    const payload = jwt.verify(token, JWT_SECRET);
    res.status(200).json({ authenticated: true, user: payload });
  } catch {
    res.status(401).json({ message: 'Not authenticated' });
  }
}