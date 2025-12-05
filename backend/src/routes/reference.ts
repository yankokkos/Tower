import { Router } from 'express'
import { ReferenceController } from '../controllers/ReferenceController'

const router = Router()

// Rotas de referência não precisam de autenticação
router.get('/planes', ReferenceController.getPlanes)
router.get('/equipment', ReferenceController.getEquipment)
router.get('/advantages', ReferenceController.getAdvantages)
router.get('/disadvantages', ReferenceController.getDisadvantages)

export default router

