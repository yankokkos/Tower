import { Router } from 'express'
import { CampaignController } from '../controllers/CampaignController'
import { authMiddleware } from '../middleware/auth'

const router = Router()

router.use(authMiddleware)

router.get('/', CampaignController.getAll)
router.get('/:id', CampaignController.getById)
router.post('/', CampaignController.create)
router.put('/:id', CampaignController.update)
router.delete('/:id', CampaignController.delete)

export default router

