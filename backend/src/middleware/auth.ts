import { Request, Response, NextFunction } from 'express'
import { verifyToken, JWTPayload } from '../utils/jwt'
import { sendUnauthorized } from '../utils/response'

// Estender o tipo Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendUnauthorized(res, 'No token provided')
      return
    }
    
    const token = authHeader.substring(7) // Remove 'Bearer '
    const payload = verifyToken(token)
    
    req.user = payload
    next()
  } catch (error) {
    sendUnauthorized(res, 'Invalid or expired token')
  }
}

export function masterOnlyMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    sendUnauthorized(res, 'Authentication required')
    return
  }
  
  if (req.user.role !== 'master') {
    sendUnauthorized(res, 'Master role required')
    return
  }
  
  next()
}

