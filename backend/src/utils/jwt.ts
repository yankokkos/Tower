import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { User } from '../types'

export interface JWTPayload {
  userId: string
  email: string
  role: 'player' | 'master'
}

export function generateToken(user: User): string {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  }
  
  return jwt.sign(payload, env.jwt.secret, {
    expiresIn: env.jwt.expiration,
  })
}

export function verifyToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, env.jwt.secret) as JWTPayload
  } catch (error) {
    throw new Error('Invalid or expired token')
  }
}

