import { getPool } from '../config/database'
import { Document } from '../types'
import { convertKeysToCamelCase, convertKeysToSnakeCase } from '../utils/caseConverter'
import { v4 as uuidv4 } from 'uuid'

export class DocumentModel {
  static async findById(id: string): Promise<Document | null> {
    const pool = getPool()
    const [rows] = await pool.execute(
      'SELECT * FROM documents WHERE id = ?',
      [id]
    )
    const result = rows as any[]
    if (result.length === 0) return null
    return this.parseDocument(result[0])
  }

  static async findByCampaign(campaignId: string): Promise<Document[]> {
    const pool = getPool()
    const [rows] = await pool.execute(
      'SELECT * FROM documents WHERE campaign_id = ? ORDER BY created_at DESC',
      [campaignId]
    )
    const result = rows as any[]
    return result.map(row => this.parseDocument(row))
  }

  static async create(data: Partial<Document> & {
    campaignId: string
    masterId: string
    title: string
    content: string
    category: string
  }): Promise<Document> {
    const pool = getPool()
    const id = uuidv4()
    const snakeData = convertKeysToSnakeCase(data)
    
    await pool.execute(
      `INSERT INTO documents (
        id, campaign_id, master_id, title, content, category,
        is_private, shared_with, tags
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        snakeData.campaign_id,
        snakeData.master_id,
        snakeData.title,
        snakeData.content,
        snakeData.category,
        snakeData.is_private ? 1 : 0,
        JSON.stringify(snakeData.shared_with || []),
        JSON.stringify(snakeData.tags || []),
      ]
    )
    
    const document = await this.findById(id)
    if (!document) throw new Error('Failed to create document')
    return document
  }

  static async update(id: string, data: Partial<Document>): Promise<Document> {
    const pool = getPool()
    const snakeData = convertKeysToSnakeCase(data)
    const fields: string[] = []
    const values: any[] = []
    
    for (const [key, value] of Object.entries(snakeData)) {
      if (value !== undefined && key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
        fields.push(`${key} = ?`)
        if (key === 'is_private') {
          values.push(value ? 1 : 0)
        } else if (typeof value === 'object' && value !== null && !(value instanceof Date)) {
          values.push(JSON.stringify(value))
        } else {
          values.push(value)
        }
      }
    }
    
    if (fields.length === 0) {
      const document = await this.findById(id)
      if (!document) throw new Error('Document not found')
      return document
    }
    
    values.push(id)
    await pool.execute(
      `UPDATE documents SET ${fields.join(', ')} WHERE id = ?`,
      values
    )
    
    const document = await this.findById(id)
    if (!document) throw new Error('Document not found')
    return document
  }

  static async delete(id: string): Promise<void> {
    const pool = getPool()
    await pool.execute('DELETE FROM documents WHERE id = ?', [id])
  }

  private static parseDocument(row: any): Document {
    const document = convertKeysToCamelCase<Document>(row)
    
    if (typeof document.sharedWith === 'string') {
      document.sharedWith = JSON.parse(document.sharedWith)
    }
    if (typeof document.tags === 'string') {
      document.tags = JSON.parse(document.tags)
    }
    if (typeof document.isPrivate === 'number') {
      document.isPrivate = document.isPrivate === 1
    }
    
    return document
  }
}

