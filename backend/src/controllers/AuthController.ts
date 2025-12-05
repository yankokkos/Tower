import { Request, Response } from 'express'
import { UserModel } from '../models/User'
import { hashPassword, comparePassword } from '../utils/password'
import { generateToken } from '../utils/jwt'
import { sendSuccess, sendError } from '../utils/response'
import { z } from 'zod'

const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(1),
    role: z.enum(['player', 'master']).default('player'),
  }),
})

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
})

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, name, role } = req.body
      
      // Verificar se email já existe
      const existingUser = await UserModel.findByEmail(email)
      if (existingUser) {
        sendError(res, 'Email already registered', 409)
        return
      }
      
      // Hash da senha
      const hashedPassword = await hashPassword(password)
      
      // Criar usuário (sempre como player, não permitir criar master)
      const user = await UserModel.create({
        email,
        password: hashedPassword,
        name,
        role: 'player', // Forçar player
      })
      
      // Gerar token
      const token = generateToken(user)
      
      // Remover senha da resposta
      const { password: _, ...userWithoutPassword } = user
      
      sendSuccess(res, {
        user: userWithoutPassword,
        token,
      }, 'User created successfully', 201)
    } catch (error: any) {
      sendError(res, error.message || 'Failed to create user', 500)
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body
      
      // Buscar usuário
      const user = await UserModel.findByEmail(email)
      if (!user) {
        sendError(res, 'Invalid email or password', 401)
        return
      }
      
      // Verificar senha
      const isValid = await comparePassword(password, user.password)
      if (!isValid) {
        sendError(res, 'Invalid email or password', 401)
        return
      }
      
      // Atualizar último login
      await UserModel.updateLastLogin(user.id)
      
      // Gerar token
      const token = generateToken(user)
      
      // Remover senha da resposta
      const { password: _, ...userWithoutPassword } = user
      
      sendSuccess(res, {
        user: userWithoutPassword,
        token,
      }, 'Login successful')
    } catch (error: any) {
      sendError(res, error.message || 'Failed to login', 500)
    }
  }
}

