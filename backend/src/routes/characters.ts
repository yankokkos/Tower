import { Router } from 'express'
import { CharacterController } from '../controllers/CharacterController'
import { authMiddleware } from '../middleware/auth'

const router = Router()

router.use(authMiddleware)

router.get('/', CharacterController.getAll)
router.get('/:id', CharacterController.getById)
router.post('/', CharacterController.create)
router.put('/:id', CharacterController.update)
router.delete('/:id', CharacterController.delete)

export default router

