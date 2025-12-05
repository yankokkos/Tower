import { getPool } from '../config/database'
import { Summon } from '../types'
import { convertKeysToCamelCase, convertKeysToSnakeCase } from '../utils/caseConverter'
import { v4 as uuidv4 } from 'uuid'

export class SummonModel {
  static async findById(id: string): Promise<Summon | null> {
    const pool = getPool()
    const [rows] = await pool.execute(
      'SELECT * FROM summons WHERE id = ?',
      [id]
    )
    const result = rows as any[]
    if (result.length === 0) return null
    return this.parseSummon(result[0])
  }

  static async findByCampaign(campaignId: string): Promise<Summon[]> {
    const pool = getPool()
    const [rows] = await pool.execute(
      'SELECT * FROM summons WHERE campaign_id = ? ORDER BY scheduled_date DESC',
      [campaignId]
    )
    const result = rows as any[]
    return result.map(row => this.parseSummon(row))
  }

  static async create(data: Partial<Summon> & {
    campaignId: string
    masterId: string
    title: string
    message: string
    scheduledDate: Date
    invitedPlayers: string[]
  }): Promise<Summon> {
    const pool = getPool()
    const id = uuidv4()
    const snakeData = convertKeysToSnakeCase(data)
    
    await pool.execute(
      `INSERT INTO summons (
        id, campaign_id, master_id, title, message, scheduled_date,
        invited_players, confirmed_players, declined_players,
        status, reminder_sent, reminder_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        snakeData.campaign_id,
        snakeData.master_id,
        snakeData.title,
        snakeData.message,
        snakeData.scheduled_date,
        JSON.stringify(snakeData.invited_players),
        JSON.stringify([]),
        JSON.stringify([]),
        snakeData.status || 'pending',
        0,
        snakeData.reminder_date || null,
      ]
    )
    
    const summon = await this.findById(id)
    if (!summon) throw new Error('Failed to create summon')
    return summon
  }

  static async update(id: string, data: Partial<Summon>): Promise<Summon> {
    const pool = getPool()
    const snakeData = convertKeysToSnakeCase(data)
    const fields: string[] = []
    const values: any[] = []
    
    for (const [key, value] of Object.entries(snakeData)) {
      if (value !== undefined && key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
        fields.push(`${key} = ?`)
        if (key === 'reminder_sent') {
          values.push(value ? 1 : 0)
        } else if (typeof value === 'object' && value !== null && !(value instanceof Date)) {
          values.push(JSON.stringify(value))
        } else {
          values.push(value)
        }
      }
    }
    
    if (fields.length === 0) {
      const summon = await this.findById(id)
      if (!summon) throw new Error('Summon not found')
      return summon
    }
    
    values.push(id)
    await pool.execute(
      `UPDATE summons SET ${fields.join(', ')} WHERE id = ?`,
      values
    )
    
    const summon = await this.findById(id)
    if (!summon) throw new Error('Summon not found')
    return summon
  }

  static async confirm(id: string, playerId: string): Promise<Summon> {
    const summon = await this.findById(id)
    if (!summon) throw new Error('Summon not found')
    
    const confirmed = [...(summon.confirmedPlayers || [])]
    if (!confirmed.includes(playerId)) {
      confirmed.push(playerId)
    }
    
    const declined = (summon.declinedPlayers || []).filter((id: string) => id !== playerId)
    
    return this.update(id, {
      confirmedPlayers: confirmed,
      declinedPlayers: declined,
    })
  }

  static async decline(id: string, playerId: string): Promise<Summon> {
    const summon = await this.findById(id)
    if (!summon) throw new Error('Summon not found')
    
    const declined = [...(summon.declinedPlayers || [])]
    if (!declined.includes(playerId)) {
      declined.push(playerId)
    }
    
    const confirmed = (summon.confirmedPlayers || []).filter((id: string) => id !== playerId)
    
    return this.update(id, {
      confirmedPlayers: confirmed,
      declinedPlayers: declined,
    })
  }

  static async delete(id: string): Promise<void> {
    const pool = getPool()
    await pool.execute('DELETE FROM summons WHERE id = ?', [id])
  }

  private static parseSummon(row: any): Summon {
    const summon = convertKeysToCamelCase<Summon>(row)
    
    if (typeof summon.invitedPlayers === 'string') {
      summon.invitedPlayers = JSON.parse(summon.invitedPlayers)
    }
    if (typeof summon.confirmedPlayers === 'string') {
      summon.confirmedPlayers = JSON.parse(summon.confirmedPlayers)
    }
    if (typeof summon.declinedPlayers === 'string') {
      summon.declinedPlayers = JSON.parse(summon.declinedPlayers)
    }
    if (typeof summon.reminderSent === 'number') {
      summon.reminderSent = summon.reminderSent === 1
    }
    
    return summon
  }
}

