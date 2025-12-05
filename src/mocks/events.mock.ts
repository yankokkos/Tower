import { CampaignEvent } from '../types'

export const mockEvents: CampaignEvent[] = [
  {
    id: 'event-001',
    campaignId: 'campaign-001',
    masterId: 'user-001',
    
    title: 'Descoberta do Sussurro das Sombras',
    description: 'Os agentes da Tower descobriram a existência de uma entidade planar conhecida como "Sussurro das Sombras" após investigação de três casos de pessoas em estado catatônico no centro de São Paulo.',
    type: 'discovery',
    date: new Date('2024-01-20'),
    
    relatedCharacters: ['char-001'],
    relatedThreats: ['threat-001'],
    relatedNPCs: [],
    
    createdAt: new Date('2024-01-20')
  },
  {
    id: 'event-002',
    campaignId: 'campaign-001',
    masterId: 'user-001',
    
    title: 'Primeiro Contato Direto',
    description: 'Durante a investigação do edifício abandonado, a equipe teve o primeiro contato direto com o Sussurro das Sombras. A entidade tentou possuir um dos agentes mas foi repelida.',
    type: 'mission',
    date: new Date('2024-01-20'),
    
    relatedCharacters: ['char-001'],
    relatedThreats: ['threat-001'],
    relatedNPCs: [],
    
    createdAt: new Date('2024-01-20')
  },
  {
    id: 'event-003',
    campaignId: 'campaign-001',
    masterId: 'user-001',
    
    title: 'Consulta com Dr. Vasquez',
    description: 'Marcus Coleman e equipe consultaram a Dr. Elena Vasquez sobre os símbolos encontrados no edifício. Ela identificou como marcas do Plano da Discórdia.',
    type: 'achievement',
    date: new Date('2024-01-21'),
    
    relatedCharacters: ['char-001'],
    relatedThreats: [],
    relatedNPCs: ['npc-001'],
    
    createdAt: new Date('2024-01-21')
  }
]

export const getEventById = (id: string): CampaignEvent | undefined => {
  return mockEvents.find(event => event.id === id)
}

export const getEventsByCampaign = (campaignId: string): CampaignEvent[] => {
  return mockEvents.filter(event => event.campaignId === campaignId).sort((a, b) => b.date.getTime() - a.date.getTime())
}

export const createEvent = (data: Omit<CampaignEvent, 'id' | 'createdAt'>): CampaignEvent => {
  const newEvent: CampaignEvent = {
    ...data,
    id: `event-${Date.now()}`,
    createdAt: new Date()
  }
  mockEvents.push(newEvent)
  return newEvent
}
