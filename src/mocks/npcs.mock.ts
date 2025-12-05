import { NPC } from '../types'

export const mockNPCs: NPC[] = [
  {
    id: 'npc-001',
    campaignId: 'campaign-001',
    masterId: 'user-001',
    
    name: 'Dr. Elena Vasquez',
    description: 'Cientista da Tower especializada em Seeds e anomalias planares. Mulher de 45 anos, cabelos grisalhos, sempre usa jaleco branco.',
    affiliation: 'Tower - Divisão de Pesquisa',
    rank: 'Diretora de Pesquisa',
    age: 45,
    
    attributes: {
      inteligencia: 8,
      sabedoria: 6,
      carisma: 4,
      poder: 7
    },
    
    skills: [
      { name: 'Ocultismo', level: 5 },
      { name: 'Ciência', level: 5 },
      { name: 'Investigação', level: 3 }
    ],
    
    relationships: [],
    history: 'Apareceu em várias missões de investigação, sempre fornecendo informações cruciais sobre Seeds e planos.',
    notes: 'NPC importante para progressão da campanha. Pode fornecer Seeds aos jogadores.',
    
    status: 'alive',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-20')
  }
]

export const getNPCById = (id: string): NPC | undefined => {
  return mockNPCs.find(npc => npc.id === id)
}

export const getNPCsByCampaign = (campaignId: string): NPC[] => {
  return mockNPCs.filter(npc => npc.campaignId === campaignId)
}
