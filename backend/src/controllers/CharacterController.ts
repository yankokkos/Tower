import { Request, Response } from 'express'
import { CharacterModel } from '../models/Character'
import { sendSuccess, sendError, sendNotFound } from '../utils/response'

export class CharacterController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId
      const { campaign_id, player_id } = req.query
      
      if (!userId) {
        sendError(res, 'Unauthorized', 401)
        return
      }
      
      let characters
      
      if (campaign_id) {
        characters = await CharacterModel.findByCampaign(campaign_id as string)
      } else if (player_id) {
        characters = await CharacterModel.findByPlayer(player_id as string)
      } else {
        // Se for player, só seus personagens; se for master, todos
        if (req.user?.role === 'master') {
          // Master pode ver todos (buscar por campanhas que ele é master)
          characters = await CharacterModel.findByPlayer(userId)
        } else {
          characters = await CharacterModel.findByPlayer(userId)
        }
      }
      
      sendSuccess(res, characters)
    } catch (error: any) {
      sendError(res, error.message || 'Failed to fetch characters', 500)
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const userId = req.user?.userId
      
      const character = await CharacterModel.findById(id)
      if (!character) {
        sendNotFound(res, 'Character not found')
        return
      }
      
      // Verificar permissão
      if (req.user?.role !== 'master' && character.playerId !== userId) {
        sendError(res, 'Forbidden', 403)
        return
      }
      
      sendSuccess(res, character)
    } catch (error: any) {
      sendError(res, error.message || 'Failed to fetch character', 500)
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId
      if (!userId) {
        sendError(res, 'Unauthorized', 401)
        return
      }
      
      const character = await CharacterModel.create({
        ...req.body,
        createdBy: userId,
        lastModifiedBy: userId,
      })
      
      sendSuccess(res, character, 'Character created successfully', 201)
    } catch (error: any) {
      sendError(res, error.message || 'Failed to create character', 500)
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const userId = req.user?.userId
      
      const character = await CharacterModel.findById(id)
      if (!character) {
        sendNotFound(res, 'Character not found')
        return
      }
      
      // Verificar permissão
      if (req.user?.role !== 'master' && character.playerId !== userId) {
        sendError(res, 'Forbidden', 403)
        return
      }
      
      const updated = await CharacterModel.update(id, {
        ...req.body,
        lastModifiedBy: userId,
      })
      
      sendSuccess(res, updated, 'Character updated successfully')
    } catch (error: any) {
      sendError(res, error.message || 'Failed to update character', 500)
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const userId = req.user?.userId
      
      const character = await CharacterModel.findById(id)
      if (!character) {
        sendNotFound(res, 'Character not found')
        return
      }
      
      // Verificar permissão
      if (req.user?.role !== 'master' && character.playerId !== userId) {
        sendError(res, 'Forbidden', 403)
        return
      }
      
      await CharacterModel.delete(id)
      sendSuccess(res, null, 'Character deleted successfully')
    } catch (error: any) {
      sendError(res, error.message || 'Failed to delete character', 500)
    }
  }
}

