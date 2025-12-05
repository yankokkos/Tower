import { Router } from 'express'
import { NPCController } from '../controllers/NPCController'
import { authMiddleware } from '../middleware/auth'

const router = Router()

router.use(authMiddleware)

router.get('/', NPCController.getAll)
router.get('/:id', NPCController.getById)
router.post('/', NPCController.create)
router.put('/:id', NPCController.update)

export default router

