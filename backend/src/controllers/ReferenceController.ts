import { Request, Response } from 'express'
import { getPool } from '../config/database'
import { sendSuccess, sendError } from '../utils/response'
import { convertKeysToCamelCase } from '../utils/caseConverter'

export class ReferenceController {
  static async getPlanes(req: Request, res: Response): Promise<void> {
    try {
      const pool = getPool()
      const [rows] = await pool.execute(
        'SELECT * FROM planes ORDER BY level, name'
      )
      const result = rows as any[]
      const planes = result.map(row => convertKeysToCamelCase(row))
      sendSuccess(res, planes)
    } catch (error: any) {
      sendError(res, error.message || 'Failed to fetch planes', 500)
    }
  }

  static async getEquipment(req: Request, res: Response): Promise<void> {
    try {
      const pool = getPool()
      const { type, category } = req.query
      
      let sql = 'SELECT * FROM equipment_templates WHERE 1=1'
      const params: any[] = []
      
      if (type) {
        sql += ' AND type = ?'
        params.push(type)
      }
      
      if (category) {
        sql += ' AND category = ?'
        params.push(category)
      }
      
      sql += ' ORDER BY category, name'
      
      const [rows] = await pool.execute(sql, params)
      const result = rows as any[]
      
      const equipment = result.map(row => {
        const item = convertKeysToCamelCase(row)
        // Converter range para camelCase
        if (item.range !== undefined) {
          item.range = row.range
        }
        // Parse JSON fields
        if (typeof item.special === 'string') {
          item.special = JSON.parse(item.special)
        }
        if (typeof item.properties === 'string') {
          item.properties = JSON.parse(item.properties)
        }
        return item
      })
      
      sendSuccess(res, equipment)
    } catch (error: any) {
      sendError(res, error.message || 'Failed to fetch equipment', 500)
    }
  }

  static async getAdvantages(req: Request, res: Response): Promise<void> {
    try {
      const pool = getPool()
      const { category } = req.query
      
      let sql = 'SELECT * FROM advantages WHERE 1=1'
      const params: any[] = []
      
      if (category) {
        sql += ' AND category = ?'
        params.push(category)
      }
      
      sql += ' ORDER BY category, cost, name'
      
      const [rows] = await pool.execute(sql, params)
      const result = rows as any[]
      
      const advantages = result.map(row => {
        const adv = convertKeysToCamelCase(row)
        adv.mechanicalEffect = row.mechanical_effect
        return adv
      })
      
      sendSuccess(res, advantages)
    } catch (error: any) {
      sendError(res, error.message || 'Failed to fetch advantages', 500)
    }
  }

  static async getDisadvantages(req: Request, res: Response): Promise<void> {
    try {
      const pool = getPool()
      const { category } = req.query
      
      let sql = 'SELECT * FROM disadvantages WHERE 1=1'
      const params: any[] = []
      
      if (category) {
        sql += ' AND category = ?'
        params.push(category)
      }
      
      sql += ' ORDER BY category, xp_gain, name'
      
      const [rows] = await pool.execute(sql, params)
      const result = rows as any[]
      
      const disadvantages = result.map(row => {
        const dis = convertKeysToCamelCase(row)
        dis.xpGain = row.xp_gain
        dis.attentionTheme = row.attention_theme
        return dis
      })
      
      sendSuccess(res, disadvantages)
    } catch (error: any) {
      sendError(res, error.message || 'Failed to fetch disadvantages', 500)
    }
  }
}

