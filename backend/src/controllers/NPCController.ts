import { Request, Response } from 'express'
import { NPCModel } from '../models/NPC'
import { sendSuccess, sendError, sendNotFound } from '../utils/response'
import { masterOnlyMiddleware } from '../middleware/auth'

export class NPCController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { campaign_id } = req.query
      
      if (!campaign_id) {
        sendError(res, 'campaign_id is required', 400)
        return
      }
      
      const npcs = await NPCModel.findByCampaign(campaign_id as string)
      sendSuccess(res, npcs)
    } catch (error: any) {
      sendError(res, error.message || 'Failed to fetch NPCs', 500)
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const npc = await NPCModel.findById(id)
      
      if (!npc) {
        sendNotFound(res, 'NPC not found')
        return
      }
      
      sendSuccess(res, npc)
    } catch (error: any) {
      sendError(res, error.message || 'Failed to fetch NPC', 500)
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId
      if (!userId) {
        sendError(res, 'Unauthorized', 401)
        return
      }
      
      const npc = await NPCModel.create({
        ...req.body,
        masterId: userId,
      })
      
      sendSuccess(res, npc, 'NPC created successfully', 201)
    } catch (error: any) {
      sendError(res, error.message || 'Failed to create NPC', 500)
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const userId = req.user?.userId
      
      const npc = await NPCModel.findById(id)
      if (!npc) {
        sendNotFound(res, 'NPC not found')
        return
      }
      
      if (npc.masterId !== userId) {
        sendError(res, 'Forbidden', 403)
        return
      }
      
      const updated = await NPCModel.update(id, req.body)
      sendSuccess(res, updated, 'NPC updated successfully')
    } catch (error: any) {
      sendError(res, error.message || 'Failed to update NPC', 500)
    }
  }
}

