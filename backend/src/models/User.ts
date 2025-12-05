import { getPool } from '../config/database'
import { User } from '../types'
import { convertKeysToCamelCase, convertKeysToSnakeCase } from '../utils/caseConverter'
import { v4 as uuidv4 } from 'uuid'

export class UserModel {
  static async findByEmail(email: string): Promise<User | null> {
    const pool = getPool()
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    )
    const result = rows as any[]
    if (result.length === 0) return null
    return convertKeysToCamelCase<User>(result[0])
  }

  static async findById(id: string): Promise<User | null> {
    const pool = getPool()
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    )
    const result = rows as any[]
    if (result.length === 0) return null
    return convertKeysToCamelCase<User>(result[0])
  }

  static async create(data: {
    email: string
    password: string
    name: string
    role: 'player' | 'master'
  }): Promise<User> {
    const pool = getPool()
    const id = uuidv4()
    const now = new Date()
    
    await pool.execute(
      `INSERT INTO users (id, email, password, name, role, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, data.email, data.password, data.name, data.role, now, now]
    )
    
    const user = await this.findById(id)
    if (!user) throw new Error('Failed to create user')
    return user
  }

  static async updateLastLogin(id: string): Promise<void> {
    const pool = getPool()
    await pool.execute(
      'UPDATE users SET last_login_at = NOW() WHERE id = ?',
      [id]
    )
  }

  static async update(id: string, data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): Promise<User> {
    const pool = getPool()
    const snakeData = convertKeysToSnakeCase(data)
    const fields: string[] = []
    const values: any[] = []
    
    for (const [key, value] of Object.entries(snakeData)) {
      if (value !== undefined) {
        fields.push(`${key} = ?`)
        values.push(value)
      }
    }
    
    if (fields.length === 0) {
      const user = await this.findById(id)
      if (!user) throw new Error('User not found')
      return user
    }
    
    values.push(id)
    await pool.execute(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    )
    
    const user = await this.findById(id)
    if (!user) throw new Error('User not found')
    return user
  }
}

