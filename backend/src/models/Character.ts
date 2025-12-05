import { getPool } from '../config/database'
import { Character } from '../types'
import { convertKeysToCamelCase, convertKeysToSnakeCase } from '../utils/caseConverter'
import { v4 as uuidv4 } from 'uuid'

export class CharacterModel {
  static async findById(id: string): Promise<Character | null> {
    const pool = getPool()
    const [rows] = await pool.execute(
      'SELECT * FROM characters WHERE id = ?',
      [id]
    )
    const result = rows as any[]
    if (result.length === 0) return null
    return this.parseCharacter(result[0])
  }

  static async findByCampaign(campaignId: string): Promise<Character[]> {
    const pool = getPool()
    const [rows] = await pool.execute(
      'SELECT * FROM characters WHERE campaign_id = ? ORDER BY created_at DESC',
      [campaignId]
    )
    const result = rows as any[]
    return result.map(row => this.parseCharacter(row))
  }

  static async findByPlayer(playerId: string): Promise<Character[]> {
    const pool = getPool()
    const [rows] = await pool.execute(
      'SELECT * FROM characters WHERE player_id = ? ORDER BY created_at DESC',
      [playerId]
    )
    const result = rows as any[]
    return result.map(row => this.parseCharacter(row))
  }

  static async create(data: Partial<Character> & {
    campaignId: string
    playerId: string
    name: string
    concept: string
    origin: string
    age: number
    attributes: Character['attributes']
    labels: Character['labels']
    innerPlane: Character['innerPlane']
    createdBy: string
    lastModifiedBy: string
  }): Promise<Character> {
    const pool = getPool()
    const id = uuidv4()
    
    // Calcular status derivados
    const statusDerived = this.calculateStatusDerived(data)
    
    const snakeData = convertKeysToSnakeCase({
      ...data,
      statusDerived,
    })
    
    await pool.execute(
      `INSERT INTO characters (
        id, campaign_id, player_id, name, codename, concept, origin, age,
        appearance, motivation, code, rank, division, recruitment_date, status,
        attributes, status_derived, skills, advantages, disadvantages,
        labels, inner_plane, seeds, power_themes, power_cards,
        equipment, history, relationships, xp, xp_total, level,
        xp_history, attention, created_by, last_modified_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        snakeData.campaign_id,
        snakeData.player_id,
        snakeData.name,
        snakeData.codename || null,
        snakeData.concept,
        snakeData.origin,
        snakeData.age,
        snakeData.appearance || null,
        snakeData.motivation || null,
        snakeData.code || null,
        snakeData.rank || null,
        snakeData.division || null,
        snakeData.recruitment_date || null,
        snakeData.status || 'active',
        JSON.stringify(snakeData.attributes),
        JSON.stringify(statusDerived),
        JSON.stringify(snakeData.skills || []),
        JSON.stringify(snakeData.advantages || []),
        JSON.stringify(snakeData.disadvantages || []),
        JSON.stringify(snakeData.labels),
        JSON.stringify(snakeData.inner_plane),
        JSON.stringify(snakeData.seeds || []),
        JSON.stringify(snakeData.power_themes || []),
        JSON.stringify(snakeData.power_cards || []),
        JSON.stringify(snakeData.equipment || []),
        snakeData.history || '',
        JSON.stringify(snakeData.relationships || []),
        snakeData.xp || 0,
        snakeData.xp_total || 0,
        snakeData.level || null,
        JSON.stringify(snakeData.xp_history || []),
        JSON.stringify(snakeData.attention || {}),
        snakeData.created_by,
        snakeData.last_modified_by,
      ]
    )
    
    const character = await this.findById(id)
    if (!character) throw new Error('Failed to create character')
    return character
  }

  static async update(id: string, data: Partial<Character>): Promise<Character> {
    const pool = getPool()
    
    // Se atributos, equipamentos ou seeds mudaram, recalcular status derivados
    const current = await this.findById(id)
    if (!current) throw new Error('Character not found')
    
    const merged = { ...current, ...data }
    const statusDerived = this.calculateStatusDerived(merged)
    
    const snakeData = convertKeysToSnakeCase({
      ...data,
      statusDerived,
    })
    
    const fields: string[] = []
    const values: any[] = []
    
    const fieldMap: Record<string, string> = {
      name: 'name',
      codename: 'codename',
      concept: 'concept',
      origin: 'origin',
      age: 'age',
      appearance: 'appearance',
      motivation: 'motivation',
      code: 'code',
      rank: 'rank',
      division: 'division',
      recruitmentDate: 'recruitment_date',
      status: 'status',
      attributes: 'attributes',
      statusDerived: 'status_derived',
      skills: 'skills',
      advantages: 'advantages',
      disadvantages: 'disadvantages',
      labels: 'labels',
      innerPlane: 'inner_plane',
      seeds: 'seeds',
      powerThemes: 'power_themes',
      powerCards: 'power_cards',
      equipment: 'equipment',
      history: 'history',
      relationships: 'relationships',
      xp: 'xp',
      xpTotal: 'xp_total',
      level: 'level',
      xpHistory: 'xp_history',
      attention: 'attention',
      lastModifiedBy: 'last_modified_by',
    }
    
    for (const [camelKey, snakeKey] of Object.entries(fieldMap)) {
      if (snakeData[snakeKey] !== undefined) {
        fields.push(`${snakeKey} = ?`)
        const value = snakeData[snakeKey]
        // Converter objetos/arrays para JSON
        if (typeof value === 'object' && value !== null && !(value instanceof Date)) {
          values.push(JSON.stringify(value))
        } else {
          values.push(value)
        }
      }
    }
    
    if (fields.length === 0) {
      return current
    }
    
    values.push(id)
    await pool.execute(
      `UPDATE characters SET ${fields.join(', ')} WHERE id = ?`,
      values
    )
    
    const character = await this.findById(id)
    if (!character) throw new Error('Character not found')
    return character
  }

  static async delete(id: string): Promise<void> {
    const pool = getPool()
    await pool.execute('DELETE FROM characters WHERE id = ?', [id])
  }

  private static calculateStatusDerived(data: Partial<Character>): Character['statusDerived'] {
    const attributes = data.attributes || {
      forca: 1,
      destreza: 1,
      constituicao: 1,
      inteligencia: 1,
      sabedoria: 1,
      carisma: 1,
      poder: 1,
    }
    
    const equipment = data.equipment || []
    const advantages = data.advantages || []
    const seeds = data.seeds || []
    
    // PV = Constituição × 5 + bônus de armadura
    let armorDefense = 0
    for (const item of equipment) {
      if (item.equipped && item.type === 'armor') {
        armorDefense += item.properties?.defense || 0
      }
    }
    const pv = attributes.constituicao * 5 + armorDefense
    
    // PS = Sabedoria × 5 + bônus de vantagens
    let psBonus = 0
    for (const adv of advantages) {
      if (adv.mechanicalEffect?.includes('PS')) {
        psBonus += 5
      }
    }
    const ps = attributes.sabedoria * 5 + psBonus
    
    // PE = Poder × 5 + bônus de Seeds (+10 se tiver Seed ativa)
    let peBonus = 0
    for (const seed of seeds) {
      if (seed.isActive || seed.type !== 'despertada') {
        peBonus = 10
        break
      }
    }
    const pe = attributes.poder * 5 + peBonus
    
    // Defesa = 10 + Destreza + Bônus Armadura
    const defense = 10 + attributes.destreza + armorDefense
    const initiative = attributes.destreza
    
    return {
      pv,
      pvMax: pv,
      ps,
      psMax: ps,
      pe,
      peMax: pe,
      defense,
      initiative,
    }
  }

  private static parseCharacter(row: any): Character {
    const char = convertKeysToCamelCase<Character>(row)
    
    // Parse JSON fields
    if (typeof char.attributes === 'string') {
      char.attributes = JSON.parse(char.attributes)
    }
    if (typeof char.statusDerived === 'string') {
      char.statusDerived = JSON.parse(char.statusDerived)
    }
    if (typeof char.skills === 'string') {
      char.skills = JSON.parse(char.skills)
    }
    if (typeof char.advantages === 'string') {
      char.advantages = JSON.parse(char.advantages)
    }
    if (typeof char.disadvantages === 'string') {
      char.disadvantages = JSON.parse(char.disadvantages)
    }
    if (typeof char.labels === 'string') {
      char.labels = JSON.parse(char.labels)
    }
    if (typeof char.innerPlane === 'string') {
      char.innerPlane = JSON.parse(char.innerPlane)
    }
    if (typeof char.seeds === 'string') {
      char.seeds = JSON.parse(char.seeds)
    }
    if (typeof char.powerThemes === 'string') {
      char.powerThemes = JSON.parse(char.powerThemes)
    }
    if (typeof char.powerCards === 'string') {
      char.powerCards = JSON.parse(char.powerCards)
    }
    if (typeof char.equipment === 'string') {
      char.equipment = JSON.parse(char.equipment)
    }
    if (typeof char.relationships === 'string') {
      char.relationships = JSON.parse(char.relationships)
    }
    if (typeof char.xpHistory === 'string') {
      char.xpHistory = JSON.parse(char.xpHistory)
    }
    if (typeof char.attention === 'string') {
      char.attention = JSON.parse(char.attention)
    }
    
    return char
  }
}

