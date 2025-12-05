import { Request, Response } from 'express'
import { DocumentModel } from '../models/Document'
import { sendSuccess, sendError, sendNotFound } from '../utils/response'

export class DocumentController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { campaign_id } = req.query
      
      if (!campaign_id) {
        sendError(res, 'campaign_id is required', 400)
        return
      }
      
      const documents = await DocumentModel.findByCampaign(campaign_id as string)
      sendSuccess(res, documents)
    } catch (error: any) {
      sendError(res, error.message || 'Failed to fetch documents', 500)
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const document = await DocumentModel.findById(id)
      
      if (!document) {
        sendNotFound(res, 'Document not found')
        return
      }
      
      sendSuccess(res, document)
    } catch (error: any) {
      sendError(res, error.message || 'Failed to fetch document', 500)
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId
      if (!userId) {
        sendError(res, 'Unauthorized', 401)
        return
      }
      
      const document = await DocumentModel.create({
        ...req.body,
        masterId: userId,
      })
      
      sendSuccess(res, document, 'Document created successfully', 201)
    } catch (error: any) {
      sendError(res, error.message || 'Failed to create document', 500)
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const userId = req.user?.userId
      
      const document = await DocumentModel.findById(id)
      if (!document) {
        sendNotFound(res, 'Document not found')
        return
      }
      
      if (document.masterId !== userId) {
        sendError(res, 'Forbidden', 403)
        return
      }
      
      const updated = await DocumentModel.update(id, req.body)
      sendSuccess(res, updated, 'Document updated successfully')
    } catch (error: any) {
      sendError(res, error.message || 'Failed to update document', 500)
    }
  }
}

