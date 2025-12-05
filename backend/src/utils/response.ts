import { Response } from 'express'

export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  errors?: any[]
}

export function sendSuccess<T>(
  res: Response,
  data?: T,
  message?: string,
  statusCode: number = 200
): Response {
  const response: ApiResponse<T> = {
    success: true,
    ...(message && { message }),
    ...(data !== undefined && { data }),
  }
  return res.status(statusCode).json(response)
}

export function sendError(
  res: Response,
  message: string,
  statusCode: number = 400,
  errors?: any[]
): Response {
  const response: ApiResponse = {
    success: false,
    message,
    ...(errors && { errors }),
  }
  return res.status(statusCode).json(response)
}

export function sendNotFound(res: Response, message: string = 'Resource not found'): Response {
  return sendError(res, message, 404)
}

export function sendUnauthorized(res: Response, message: string = 'Unauthorized'): Response {
  return sendError(res, message, 401)
}

export function sendForbidden(res: Response, message: string = 'Forbidden'): Response {
  return sendError(res, message, 403)
}

