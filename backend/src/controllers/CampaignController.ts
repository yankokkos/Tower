import { Request, Response } from 'express'
import { CampaignModel } from '../models/Campaign'
import { sendSuccess, sendError, sendNotFound } from '../utils/response'

export class CampaignController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId
      if (!userId) {
        sendError(res, 'Unauthorized', 401)
        return
      }
      
      // Buscar campanhas onde o usuário é mestre ou jogador
      const asMaster = await CampaignModel.findByMaster(userId)
      const asPlayer = await CampaignModel.findByPlayer(userId)
      
      // Combinar e remover duplicatas
      const allCampaigns = [...asMaster, ...asPlayer]
      const uniqueCampaigns = Array.from(
        new Map(allCampaigns.map(c => [c.id, c])).values()
      )
      
      sendSuccess(res, uniqueCampaigns)
    } catch (error: any) {
      sendError(res, error.message || 'Failed to fetch campaigns', 500)
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const campaign = await CampaignModel.findById(id)
      
      if (!campaign) {
        sendNotFound(res, 'Campaign not found')
        return
      }
      
      sendSuccess(res, campaign)
    } catch (error: any) {
      sendError(res, error.message || 'Failed to fetch campaign', 500)
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId
      if (!userId || req.user?.role !== 'master') {
        sendError(res, 'Only masters can create campaigns', 403)
        return
      }
      
      const { name, description, status } = req.body
      
      const campaign = await CampaignModel.create({
        name,
        description: description || '',
        masterId: userId,
        status,
      })
      
      sendSuccess(res, campaign, 'Campaign created successfully', 201)
    } catch (error: any) {
      sendError(res, error.message || 'Failed to create campaign', 500)
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const userId = req.user?.userId
      
      const campaign = await CampaignModel.findById(id)
      if (!campaign) {
        sendNotFound(res, 'Campaign not found')
        return
      }
      
      if (campaign.masterId !== userId && req.user?.role !== 'master') {
        sendError(res, 'Only the campaign master can update it', 403)
        return
      }
      
      const updated = await CampaignModel.update(id, req.body)
      sendSuccess(res, updated, 'Campaign updated successfully')
    } catch (error: any) {
      sendError(res, error.message || 'Failed to update campaign', 500)
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const userId = req.user?.userId
      
      const campaign = await CampaignModel.findById(id)
      if (!campaign) {
        sendNotFound(res, 'Campaign not found')
        return
      }
      
      if (campaign.masterId !== userId) {
        sendError(res, 'Only the campaign master can delete it', 403)
        return
      }
      
      await CampaignModel.delete(id)
      sendSuccess(res, null, 'Campaign deleted successfully')
    } catch (error: any) {
      sendError(res, error.message || 'Failed to delete campaign', 500)
    }
  }
}

