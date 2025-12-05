import { Router } from 'express'
import { SummonController } from '../controllers/SummonController'
import { authMiddleware } from '../middleware/auth'

const router = Router()

router.use(authMiddleware)

router.get('/', SummonController.getAll)
router.get('/:id', SummonController.getById)
router.post('/', SummonController.create)
router.put('/:id', SummonController.update)
router.post('/:id/confirm', SummonController.confirm)
router.post('/:id/decline', SummonController.decline)

export default router

