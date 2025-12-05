import dotenv from 'dotenv'
import path from 'path'

// Carregar .env do root do projeto ou do diretório backend
const envPath = path.resolve(__dirname, '../../../config.env')
dotenv.config({ path: envPath })

// Também tentar carregar .env local se existir
dotenv.config()

export const env = {
  // Database
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    database: process.env.DB_NAME || 'tower_rpg',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
  },
  
  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'change-me-in-production',
    expiration: parseInt(process.env.JWT_EXPIRATION || '86400', 10), // 24 horas
  },
  
  // API
  api: {
    env: process.env.API_ENV || 'development',
    debug: process.env.API_DEBUG === 'true',
    port: parseInt(process.env.PORT || '5001', 10),
  },
  
  // CORS
  cors: {
    allowedOrigins: process.env.CORS_ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:5173',
      'http://localhost:3000',
    ],
  },
} as const

