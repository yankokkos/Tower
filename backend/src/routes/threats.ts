import { Router } from 'express'
import { ThreatController } from '../controllers/ThreatController'
import { authMiddleware } from '../middleware/auth'

const router = Router()

router.use(authMiddleware)

router.get('/', ThreatController.getAll)
router.get('/:id', ThreatController.getById)
router.post('/', ThreatController.create)
router.put('/:id', ThreatController.update)

export default router

