import { getPool } from '../config/database'
import { NPC } from '../types'
import { convertKeysToCamelCase, convertKeysToSnakeCase } from '../utils/caseConverter'
import { v4 as uuidv4 } from 'uuid'

export class NPCModel {
  static async findById(id: string): Promise<NPC | null> {
    const pool = getPool()
    const [rows] = await pool.execute(
      'SELECT * FROM npcs WHERE id = ?',
      [id]
    )
    const result = rows as any[]
    if (result.length === 0) return null
    return this.parseNPC(result[0])
  }

  static async findByCampaign(campaignId: string): Promise<NPC[]> {
    const pool = getPool()
    const [rows] = await pool.execute(
      'SELECT * FROM npcs WHERE campaign_id = ? ORDER BY created_at DESC',
      [campaignId]
    )
    const result = rows as any[]
    return result.map(row => this.parseNPC(row))
  }

  static async create(data: Partial<NPC> & {
    campaignId: string
    masterId: string
    name: string
    description: string
    affiliation: string
    history: string
    notes: string
  }): Promise<NPC> {
    const pool = getPool()
    const id = uuidv4()
    const snakeData = convertKeysToSnakeCase(data)
    
    await pool.execute(
      `INSERT INTO npcs (
        id, campaign_id, master_id, name, description, affiliation,
        rank, age, appearance, attributes, skills, relationships,
        history, notes, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        snakeData.campaign_id,
        snakeData.master_id,
        snakeData.name,
        snakeData.description,
        snakeData.affiliation,
        snakeData.rank || null,
        snakeData.age || null,
        snakeData.appearance || null,
        snakeData.attributes ? JSON.stringify(snakeData.attributes) : null,
        snakeData.skills ? JSON.stringify(snakeData.skills) : null,
        JSON.stringify(snakeData.relationships || []),
        snakeData.history,
        snakeData.notes,
        snakeData.status || 'alive',
      ]
    )
    
    const npc = await this.findById(id)
    if (!npc) throw new Error('Failed to create NPC')
    return npc
  }

  static async update(id: string, data: Partial<NPC>): Promise<NPC> {
    const pool = getPool()
    const snakeData = convertKeysToSnakeCase(data)
    const fields: string[] = []
    const values: any[] = []
    
    for (const [key, value] of Object.entries(snakeData)) {
      if (value !== undefined && key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
        fields.push(`${key} = ?`)
        if (typeof value === 'object' && value !== null && !(value instanceof Date)) {
          values.push(JSON.stringify(value))
        } else {
          values.push(value)
        }
      }
    }
    
    if (fields.length === 0) {
      const npc = await this.findById(id)
      if (!npc) throw new Error('NPC not found')
      return npc
    }
    
    values.push(id)
    await pool.execute(
      `UPDATE npcs SET ${fields.join(', ')} WHERE id = ?`,
      values
    )
    
    const npc = await this.findById(id)
    if (!npc) throw new Error('NPC not found')
    return npc
  }

  static async delete(id: string): Promise<void> {
    const pool = getPool()
    await pool.execute('DELETE FROM npcs WHERE id = ?', [id])
  }

  private static parseNPC(row: any): NPC {
    const npc = convertKeysToCamelCase<NPC>(row)
    
    if (typeof npc.attributes === 'string') {
      npc.attributes = JSON.parse(npc.attributes)
    }
    if (typeof npc.skills === 'string') {
      npc.skills = JSON.parse(npc.skills)
    }
    if (typeof npc.relationships === 'string') {
      npc.relationships = JSON.parse(npc.relationships)
    }
    
    return npc
  }
}

