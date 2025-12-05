import { Request, Response, NextFunction } from 'express'
import { env } from '../config/env'

export function corsMiddleware(req: Request, res: Response, next: NextFunction): void {
  const origin = req.headers.origin
  
  if (origin && env.cors.allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  } else if (env.cors.allowedOrigins.includes('*')) {
    res.setHeader('Access-Control-Allow-Origin', '*')
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Max-Age', '86400')
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(204)
    return
  }
  
  next()
}

