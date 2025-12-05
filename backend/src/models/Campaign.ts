import { getPool } from '../config/database'
import { Campaign } from '../types'
import { convertKeysToCamelCase, convertKeysToSnakeCase } from '../utils/caseConverter'
import { v4 as uuidv4 } from 'uuid'

export class CampaignModel {
  static async findById(id: string): Promise<Campaign | null> {
    const pool = getPool()
    const [rows] = await pool.execute(
      'SELECT * FROM campaigns WHERE id = ?',
      [id]
    )
    const result = rows as any[]
    if (result.length === 0) return null
    return convertKeysToCamelCase<Campaign>(result[0])
  }

  static async findByMaster(masterId: string): Promise<Campaign[]> {
    const pool = getPool()
    const [rows] = await pool.execute(
      'SELECT * FROM campaigns WHERE master_id = ? ORDER BY created_at DESC',
      [masterId]
    )
    const result = rows as any[]
    return result.map(row => convertKeysToCamelCase<Campaign>(row))
  }

  static async findByPlayer(playerId: string): Promise<Campaign[]> {
    const pool = getPool()
    const [rows] = await pool.execute(
      `SELECT c.* FROM campaigns c
       INNER JOIN campaign_players cp ON c.id = cp.campaign_id
       WHERE cp.player_id = ?
       ORDER BY c.created_at DESC`,
      [playerId]
    )
    const result = rows as any[]
    return result.map(row => convertKeysToCamelCase<Campaign>(row))
  }

  static async create(data: {
    name: string
    description: string
    masterId: string
    status?: 'active' | 'paused' | 'completed' | 'archived'
  }): Promise<Campaign> {
    const pool = getPool()
    const id = uuidv4()
    const now = new Date()
    const status = data.status || 'active'
    
    await pool.execute(
      `INSERT INTO campaigns (id, name, description, master_id, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, data.name, data.description, data.masterId, status, now, now]
    )
    
    const campaign = await this.findById(id)
    if (!campaign) throw new Error('Failed to create campaign')
    return campaign
  }

  static async update(id: string, data: Partial<Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Campaign> {
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
      const campaign = await this.findById(id)
      if (!campaign) throw new Error('Campaign not found')
      return campaign
    }
    
    values.push(id)
    await pool.execute(
      `UPDATE campaigns SET ${fields.join(', ')} WHERE id = ?`,
      values
    )
    
    const campaign = await this.findById(id)
    if (!campaign) throw new Error('Campaign not found')
    return campaign
  }

  static async delete(id: string): Promise<void> {
    const pool = getPool()
    await pool.execute('DELETE FROM campaigns WHERE id = ?', [id])
  }

  static async addPlayer(campaignId: string, playerId: string): Promise<void> {
    const pool = getPool()
    await pool.execute(
      'INSERT IGNORE INTO campaign_players (campaign_id, player_id) VALUES (?, ?)',
      [campaignId, playerId]
    )
  }

  static async removePlayer(campaignId: string, playerId: string): Promise<void> {
    const pool = getPool()
    await pool.execute(
      'DELETE FROM campaign_players WHERE campaign_id = ? AND player_id = ?',
      [campaignId, playerId]
    )
  }
}

