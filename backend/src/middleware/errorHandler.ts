import { Request, Response, NextFunction } from 'express'
import { sendError } from '../utils/response'
import { env } from '../config/env'

export function errorHandler(
  err: Error | any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log do erro
  if (env.api.debug) {
    console.error('Error:', err)
  }
  
  // Erro de validação
  if (err.name === 'ValidationError' || err.name === 'ZodError') {
    sendError(res, err.message || 'Validation error', 400, err.errors || err.issues)
    return
  }
  
  // Erro de autenticação
  if (err.message === 'Invalid or expired token' || err.name === 'JsonWebTokenError') {
    sendError(res, 'Invalid or expired token', 401)
    return
  }
  
  // Erro de banco de dados
  if (err.code === 'ER_DUP_ENTRY') {
    sendError(res, 'Duplicate entry', 409)
    return
  }
  
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    sendError(res, 'Referenced resource not found', 404)
    return
  }
  
  // Erro genérico
  const message = err.message || 'Internal server error'
  const statusCode = err.statusCode || 500
  
  sendError(res, message, statusCode)
}

