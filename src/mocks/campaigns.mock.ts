import { Campaign } from '../types'

export const mockCampaigns: Campaign[] = [
  {
    id: 'campaign-001',
    name: 'Operação Eclipse',
    description: 'Uma campanha sobre contenção de ameaças planares em São Paulo.',
    masterId: 'user-001',
    status: 'active',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-20'),
    startedAt: new Date('2024-01-18')
  },
  {
    id: 'campaign-002',
    name: 'Torre de Vigilância',
    description: 'Campanha focada em investigações e descobertas sobre a estrutura dos planos.',
    masterId: 'user-001',
    status: 'paused',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15'),
    startedAt: new Date('2024-01-10')
  }
]

export const getCampaignById = (id: string): Campaign | undefined => {
  return mockCampaigns.find(campaign => campaign.id === id)
}

export const getCampaignsByMaster = (masterId: string): Campaign[] => {
  return mockCampaigns.filter(campaign => campaign.masterId === masterId)
}

export const getCampaignsByPlayer = (playerId: string): Campaign[] => {
  return mockCampaigns.filter(campaign => campaign.status === 'active')
}
