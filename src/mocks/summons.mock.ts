import { Summon } from '../types'

export const mockSummons: Summon[] = [
  {
    id: 'summon-001',
    campaignId: 'campaign-001',
    masterId: 'user-001',
    
    title: 'Sessão 2 - Operação Eclipse',
    message: `Próxima sessão agendada para continuar a investigação do Sussurro das Sombras.

**Objetivos da sessão:**
- Consultar Dr. Elena Vasquez sobre os símbolos
- Investigar histórico do edifício abandonado
- Planejar estratégia de contenção

**Preparação:**
- Revisar relatório da sessão anterior
- Trazer ideias para abordagem
- Equipamentos especiais serão fornecidos`,
    
    scheduledDate: new Date('2024-01-27T19:00:00'),
    
    invitedPlayers: ['user-002', 'user-003'],
    confirmedPlayers: ['user-002'],
    declinedPlayers: [],
    
    status: 'pending',
    reminderSent: false,
    
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-21')
  },
  {
    id: 'summon-002',
    campaignId: 'campaign-001',
    masterId: 'user-001',
    
    title: 'Sessão 3 - Confronto Final',
    message: 'Sessão especial de 4 horas para o confronto final com o Sussurro das Sombras.',
    scheduledDate: new Date('2024-02-03T18:00:00'),
    
    invitedPlayers: ['user-002', 'user-003'],
    confirmedPlayers: [],
    declinedPlayers: [],
    
    status: 'pending',
    reminderSent: false,
    
    createdAt: new Date('2024-01-21'),
    updatedAt: new Date('2024-01-21')
  }
]

export const getSummonById = (id: string): Summon | undefined => {
  return mockSummons.find(summon => summon.id === id)
}

export const getSummonsByCampaign = (campaignId: string): Summon[] => {
  return mockSummons.filter(summon => summon.campaignId === campaignId)
}

export const createSummon = (data: Omit<Summon, 'id' | 'createdAt' | 'updatedAt'>): Summon => {
  const newSummon: Summon = {
    ...data,
    id: `summon-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  mockSummons.push(newSummon)
  return newSummon
}

export const updateSummon = (id: string, data: Partial<Summon>): Summon | undefined => {
  const index = mockSummons.findIndex(s => s.id === id)
  if (index === -1) return undefined
  
  mockSummons[index] = {
    ...mockSummons[index],
    ...data,
    updatedAt: new Date()
  }
  return mockSummons[index]
}

export const confirmSummon = (id: string, playerId: string): Summon | undefined => {
  const summon = getSummonById(id)
  if (!summon) return undefined
  
  // Remove de declined se estava lá
  const declinedIndex = summon.declinedPlayers.indexOf(playerId)
  if (declinedIndex > -1) {
    summon.declinedPlayers.splice(declinedIndex, 1)
  }
  
  // Adiciona a confirmed se não está
  if (!summon.confirmedPlayers.includes(playerId)) {
    summon.confirmedPlayers.push(playerId)
  }
  
  return updateSummon(id, summon)
}

export const declineSummon = (id: string, playerId: string): Summon | undefined => {
  const summon = getSummonById(id)
  if (!summon) return undefined
  
  // Remove de confirmed se estava lá
  const confirmedIndex = summon.confirmedPlayers.indexOf(playerId)
  if (confirmedIndex > -1) {
    summon.confirmedPlayers.splice(confirmedIndex, 1)
  }
  
  // Adiciona a declined se não está
  if (!summon.declinedPlayers.includes(playerId)) {
    summon.declinedPlayers.push(playerId)
  }
  
  return updateSummon(id, summon)
}
