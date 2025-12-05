import { getPool } from '../config/database'
import { Threat } from '../types'
import { convertKeysToCamelCase, convertKeysToSnakeCase } from '../utils/caseConverter'
import { v4 as uuidv4 } from 'uuid'

export class ThreatModel {
  static async findById(id: string): Promise<Threat | null> {
    const pool = getPool()
    const [rows] = await pool.execute(
      'SELECT * FROM threats WHERE id = ?',
      [id]
    )
    const result = rows as any[]
    if (result.length === 0) return null
    return this.parseThreat(result[0])
  }

  static async findByCampaign(campaignId: string): Promise<Threat[]> {
    const pool = getPool()
    const [rows] = await pool.execute(
      'SELECT * FROM threats WHERE campaign_id = ? ORDER BY created_at DESC',
      [campaignId]
    )
    const result = rows as any[]
    return result.map(row => this.parseThreat(row))
  }

  static async create(data: Partial<Threat> & {
    campaignId: string
    masterId: string
    name: string
    code: string
    type: Threat['type']
    description: string
    capabilities: string[]
    weaknesses: string[]
    combatStats: Threat['combatStats']
    containmentLevel: Threat['containmentLevel']
    dangerLevel: Threat['dangerLevel']
    notes: string
  }): Promise<Threat> {
    const pool = getPool()
    const id = uuidv4()
    const snakeData = convertKeysToSnakeCase(data)
    
    await pool.execute(
      `INSERT INTO threats (
        id, campaign_id, master_id, name, code, type, origin_plane,
        description, capabilities, weaknesses, combat_stats,
        containment_level, danger_level, status, location,
        containment_procedures, discovery_date, incidents,
        related_missions, related_characters, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        snakeData.campaign_id,
        snakeData.master_id,
        snakeData.name,
        snakeData.code,
        snakeData.type,
        snakeData.origin_plane || null,
        snakeData.description,
        JSON.stringify(snakeData.capabilities),
        JSON.stringify(snakeData.weaknesses),
        JSON.stringify(snakeData.combat_stats),
        snakeData.containment_level,
        snakeData.danger_level,
        snakeData.status || 'contained',
        snakeData.location || null,
        snakeData.containment_procedures || null,
        snakeData.discovery_date || null,
        JSON.stringify(snakeData.incidents || []),
        JSON.stringify(snakeData.related_missions || []),
        JSON.stringify(snakeData.related_characters || []),
        snakeData.notes,
      ]
    )
    
    const threat = await this.findById(id)
    if (!threat) throw new Error('Failed to create threat')
    return threat
  }

  static async update(id: string, data: Partial<Threat>): Promise<Threat> {
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
      const threat = await this.findById(id)
      if (!threat) throw new Error('Threat not found')
      return threat
    }
    
    values.push(id)
    await pool.execute(
      `UPDATE threats SET ${fields.join(', ')} WHERE id = ?`,
      values
    )
    
    const threat = await this.findById(id)
    if (!threat) throw new Error('Threat not found')
    return threat
  }

  static async delete(id: string): Promise<void> {
    const pool = getPool()
    await pool.execute('DELETE FROM threats WHERE id = ?', [id])
  }

  private static parseThreat(row: any): Threat {
    const threat = convertKeysToCamelCase<Threat>(row)
    
    if (typeof threat.capabilities === 'string') {
      threat.capabilities = JSON.parse(threat.capabilities)
    }
    if (typeof threat.weaknesses === 'string') {
      threat.weaknesses = JSON.parse(threat.weaknesses)
    }
    if (typeof threat.combatStats === 'string') {
      threat.combatStats = JSON.parse(threat.combatStats)
    }
    if (typeof threat.incidents === 'string') {
      threat.incidents = JSON.parse(threat.incidents)
    }
    if (typeof threat.relatedMissions === 'string') {
      threat.relatedMissions = JSON.parse(threat.relatedMissions)
    }
    if (typeof threat.relatedCharacters === 'string') {
      threat.relatedCharacters = JSON.parse(threat.relatedCharacters)
    }
    
    return threat
  }
}

