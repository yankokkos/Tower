import { Request, Response } from 'express'
import { SummonModel } from '../models/Summon'
import { sendSuccess, sendError, sendNotFound } from '../utils/response'

export class SummonController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { campaign_id } = req.query
      
      if (!campaign_id) {
        sendError(res, 'campaign_id is required', 400)
        return
      }
      
      const summons = await SummonModel.findByCampaign(campaign_id as string)
      sendSuccess(res, summons)
    } catch (error: any) {
      sendError(res, error.message || 'Failed to fetch summons', 500)
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const summon = await SummonModel.findById(id)
      
      if (!summon) {
        sendNotFound(res, 'Summon not found')
        return
      }
      
      sendSuccess(res, summon)
    } catch (error: any) {
      sendError(res, error.message || 'Failed to fetch summon', 500)
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId
      if (!userId) {
        sendError(res, 'Unauthorized', 401)
        return
      }
      
      const summon = await SummonModel.create({
        ...req.body,
        masterId: userId,
      })
      
      sendSuccess(res, summon, 'Summon created successfully', 201)
    } catch (error: any) {
      sendError(res, error.message || 'Failed to create summon', 500)
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const userId = req.user?.userId
      
      const summon = await SummonModel.findById(id)
      if (!summon) {
        sendNotFound(res, 'Summon not found')
        return
      }
      
      if (summon.masterId !== userId) {
        sendError(res, 'Forbidden', 403)
        return
      }
      
      const updated = await SummonModel.update(id, req.body)
      sendSuccess(res, updated, 'Summon updated successfully')
    } catch (error: any) {
      sendError(res, error.message || 'Failed to update summon', 500)
    }
  }

  static async confirm(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const userId = req.user?.userId
      
      if (!userId) {
        sendError(res, 'Unauthorized', 401)
        return
      }
      
      const summon = await SummonModel.confirm(id, userId)
      sendSuccess(res, summon, 'Summon confirmed')
    } catch (error: any) {
      sendError(res, error.message || 'Failed to confirm summon', 500)
    }
  }

  static async decline(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const userId = req.user?.userId
      
      if (!userId) {
        sendError(res, 'Unauthorized', 401)
        return
      }
      
      const summon = await SummonModel.decline(id, userId)
      sendSuccess(res, summon, 'Summon declined')
    } catch (error: any) {
      sendError(res, error.message || 'Failed to decline summon', 500)
    }
  }
}

