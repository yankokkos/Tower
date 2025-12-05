import { Router } from 'express'
import { AuthController } from '../controllers/AuthController'
import { validate } from '../middleware/validate'
import { z } from 'zod'

const router = Router()

const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(1),
    role: z.enum(['player', 'master']).optional().default('player'),
  }),
})

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
})

router.post('/register', validate(registerSchema), AuthController.register)
router.post('/login', validate(loginSchema), AuthController.login)

export default router

