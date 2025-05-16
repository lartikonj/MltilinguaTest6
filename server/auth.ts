
import { OAuth2Client } from 'google-auth-library';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { users, sessions, type User } from '@shared/schema';
import { db } from './db';
import { eq } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

export async function createUser(email: string, name: string, password?: string, googleId?: string): Promise<User> {
  const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
  
  const [user] = await db.insert(users).values({
    email,
    name,
    password: hashedPassword,
    googleId,
    role: 'user'
  }).returning();
  
  return user;
}

export async function createSession(userId: number): Promise<string> {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
  
  await db.insert(sessions).values({
    userId,
    token,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });
  
  return token;
}

export async function verifyGoogleToken(token: string) {
  const ticket = await googleClient.verifyIdToken({
    idToken: token,
    audience: GOOGLE_CLIENT_ID
  });
  
  const payload = ticket.getPayload();
  return payload;
}

export async function authenticateUser(email: string, password: string): Promise<string | null> {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email)
    });
    
    if (!user || !user.password) return null;
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return null;
    
    return createSession(user.id);
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

export async function registerUser(email: string, password: string, name: string): Promise<boolean> {
  try {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email)
    });
    
    if (existingUser) return false;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    await createUser(email, name, hashedPassword);
    return true;
  } catch (error) {
    console.error('Registration error:', error);
    return false;
  }
}

export async function validateSession(token: string): Promise<User | null> {
  try {
    const { userId } = jwt.verify(token, JWT_SECRET) as { userId: number };
    
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId)
    });
    
    return user || null;
  } catch {
    return null;
  }
}

export async function requireAdmin(token: string): Promise<User | null> {
  const user = await validateSession(token);
  if (!user || user.role !== 'admin') return null;
  return user;
}
