import { Router } from 'express'
import { ReportController } from '../controllers/ReportController'
import { authMiddleware } from '../middleware/auth'

const router = Router()

router.use(authMiddleware)

router.get('/', ReportController.getAll)
router.get('/:id', ReportController.getById)
router.post('/', ReportController.create)
router.put('/:id', ReportController.update)

export default router

