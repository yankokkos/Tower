import { Request, Response } from 'express'
import { ReportModel } from '../models/Report'
import { sendSuccess, sendError, sendNotFound } from '../utils/response'

export class ReportController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { campaign_id } = req.query
      
      if (!campaign_id) {
        sendError(res, 'campaign_id is required', 400)
        return
      }
      
      const reports = await ReportModel.findByCampaign(campaign_id as string)
      sendSuccess(res, reports)
    } catch (error: any) {
      sendError(res, error.message || 'Failed to fetch reports', 500)
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const report = await ReportModel.findById(id)
      
      if (!report) {
        sendNotFound(res, 'Report not found')
        return
      }
      
      sendSuccess(res, report)
    } catch (error: any) {
      sendError(res, error.message || 'Failed to fetch report', 500)
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId
      if (!userId) {
        sendError(res, 'Unauthorized', 401)
        return
      }
      
      const report = await ReportModel.create({
        ...req.body,
        masterId: userId,
      })
      
      sendSuccess(res, report, 'Report created successfully', 201)
    } catch (error: any) {
      sendError(res, error.message || 'Failed to create report', 500)
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const userId = req.user?.userId
      
      const report = await ReportModel.findById(id)
      if (!report) {
        sendNotFound(res, 'Report not found')
        return
      }
      
      if (report.masterId !== userId) {
        sendError(res, 'Forbidden', 403)
        return
      }
      
      const updated = await ReportModel.update(id, req.body)
      sendSuccess(res, updated, 'Report updated successfully')
    } catch (error: any) {
      sendError(res, error.message || 'Failed to update report', 500)
    }
  }
}

