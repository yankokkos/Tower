import { Request, Response } from 'express'
import { ThreatModel } from '../models/Threat'
import { sendSuccess, sendError, sendNotFound } from '../utils/response'

export class ThreatController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { campaign_id } = req.query
      
      if (!campaign_id) {
        sendError(res, 'campaign_id is required', 400)
        return
      }
      
      const threats = await ThreatModel.findByCampaign(campaign_id as string)
      sendSuccess(res, threats)
    } catch (error: any) {
      sendError(res, error.message || 'Failed to fetch threats', 500)
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const threat = await ThreatModel.findById(id)
      
      if (!threat) {
        sendNotFound(res, 'Threat not found')
        return
      }
      
      sendSuccess(res, threat)
    } catch (error: any) {
      sendError(res, error.message || 'Failed to fetch threat', 500)
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId
      if (!userId) {
        sendError(res, 'Unauthorized', 401)
        return
      }
      
      const threat = await ThreatModel.create({
        ...req.body,
        masterId: userId,
      })
      
      sendSuccess(res, threat, 'Threat created successfully', 201)
    } catch (error: any) {
      sendError(res, error.message || 'Failed to create threat', 500)
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const userId = req.user?.userId
      
      const threat = await ThreatModel.findById(id)
      if (!threat) {
        sendNotFound(res, 'Threat not found')
        return
      }
      
      if (threat.masterId !== userId) {
        sendError(res, 'Forbidden', 403)
        return
      }
      
      const updated = await ThreatModel.update(id, req.body)
      sendSuccess(res, updated, 'Threat updated successfully')
    } catch (error: any) {
      sendError(res, error.message || 'Failed to update threat', 500)
    }
  }
}

