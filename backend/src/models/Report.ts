import { getPool } from '../config/database'
import { Report } from '../types'
import { convertKeysToCamelCase, convertKeysToSnakeCase } from '../utils/caseConverter'
import { v4 as uuidv4 } from 'uuid'

export class ReportModel {
  static async findById(id: string): Promise<Report | null> {
    const pool = getPool()
    const [rows] = await pool.execute(
      'SELECT * FROM reports WHERE id = ?',
      [id]
    )
    const result = rows as any[]
    if (result.length === 0) return null
    return this.parseReport(result[0])
  }

  static async findByCampaign(campaignId: string): Promise<Report[]> {
    const pool = getPool()
    const [rows] = await pool.execute(
      'SELECT * FROM reports WHERE campaign_id = ? ORDER BY date DESC, created_at DESC',
      [campaignId]
    )
    const result = rows as any[]
    return result.map(row => this.parseReport(row))
  }

  static async create(data: Partial<Report> & {
    campaignId: string
    masterId: string
    title: string
    content: string
    type: Report['type']
    date: Date
  }): Promise<Report> {
    const pool = getPool()
    const id = uuidv4()
    const snakeData = convertKeysToSnakeCase(data)
    
    await pool.execute(
      `INSERT INTO reports (
        id, campaign_id, master_id, title, content, type, date,
        tags, is_private, shared_with
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        snakeData.campaign_id,
        snakeData.master_id,
        snakeData.title,
        snakeData.content,
        snakeData.type,
        snakeData.date,
        JSON.stringify(snakeData.tags || []),
        snakeData.is_private ? 1 : 0,
        JSON.stringify(snakeData.shared_with || []),
      ]
    )
    
    const report = await this.findById(id)
    if (!report) throw new Error('Failed to create report')
    return report
  }

  static async update(id: string, data: Partial<Report>): Promise<Report> {
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
      const report = await this.findById(id)
      if (!report) throw new Error('Report not found')
      return report
    }
    
    values.push(id)
    await pool.execute(
      `UPDATE reports SET ${fields.join(', ')} WHERE id = ?`,
      values
    )
    
    const report = await this.findById(id)
    if (!report) throw new Error('Report not found')
    return report
  }

  static async delete(id: string): Promise<void> {
    const pool = getPool()
    await pool.execute('DELETE FROM reports WHERE id = ?', [id])
  }

  private static parseReport(row: any): Report {
    const report = convertKeysToCamelCase<Report>(row)
    
    if (typeof report.tags === 'string') {
      report.tags = JSON.parse(report.tags)
    }
    if (typeof report.sharedWith === 'string') {
      report.sharedWith = JSON.parse(report.sharedWith)
    }
    if (typeof report.isPrivate === 'number') {
      report.isPrivate = report.isPrivate === 1
    }
    
    return report
  }
}

