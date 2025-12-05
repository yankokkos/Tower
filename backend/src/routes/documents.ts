import { Router } from 'express'
import { DocumentController } from '../controllers/DocumentController'
import { authMiddleware } from '../middleware/auth'

const router = Router()

router.use(authMiddleware)

router.get('/', DocumentController.getAll)
router.get('/:id', DocumentController.getById)
router.post('/', DocumentController.create)
router.put('/:id', DocumentController.update)

export default router

