import mysql from 'mysql2/promise'
import { env } from './env'

let pool: mysql.Pool | null = null

export function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: env.db.host,
      port: env.db.port,
      database: env.db.database,
      user: env.db.user,
      password: env.db.password,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
      charset: 'utf8mb4',
      timezone: '+00:00',
    })
  }
  return pool
}

export async function testConnection(): Promise<boolean> {
  try {
    const connection = await getPool().getConnection()
    await connection.ping()
    connection.release()
    return true
  } catch (error) {
    console.error('Database connection test failed:', error)
    return false
  }
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end()
    pool = null
  }
}

