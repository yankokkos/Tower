import express from 'express'
import 'express-async-errors'
import { corsMiddleware } from './middleware/cors'
import { errorHandler } from './middleware/errorHandler'
import { env } from './config/env'
import { testConnection } from './config/database'

// Importar rotas
import authRoutes from './routes/auth'
import campaignRoutes from './routes/campaigns'
import characterRoutes from './routes/characters'
import npcRoutes from './routes/npcs'
import threatRoutes from './routes/threats'
import reportRoutes from './routes/reports'
import summonRoutes from './routes/summons'
import documentRoutes from './routes/documents'
import referenceRoutes from './routes/reference'

const app = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(corsMiddleware)

// Health check
app.get('/health', async (req, res) => {
  const dbConnected = await testConnection()
  res.status(dbConnected ? 200 : 503).json({
    status: dbConnected ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    database: dbConnected ? 'connected' : 'disconnected',
  })
})

// Rotas da API
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/campaigns', campaignRoutes)
app.use('/api/v1/characters', characterRoutes)
app.use('/api/v1/npcs', npcRoutes)
app.use('/api/v1/threats', threatRoutes)
app.use('/api/v1/reports', reportRoutes)
app.use('/api/v1/summons', summonRoutes)
app.use('/api/v1/documents', documentRoutes)
app.use('/api/v1/reference', referenceRoutes)

// Error handler (deve ser o último middleware)
app.use(errorHandler)

// Iniciar servidor
const PORT = env.api.port

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📝 Environment: ${env.api.env}`)
  console.log(`🔍 Debug mode: ${env.api.debug}`)
})

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...')
  process.exit(0)
})

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...')
  process.exit(0)
})

