import { Threat } from '../types'

export const mockThreats: Threat[] = [
  {
    id: 'threat-001',
    campaignId: 'campaign-001',
    masterId: 'user-001',
    
    name: 'Sussurro das Sombras',
    code: 'AM-TWR-2024-KETER-3',
    type: 'entity',
    originPlane: 'Plano da Discórdia',
    
    description: 'Entidade incorpórea que se manifesta como sombras que sussurram segredos. Pode possuir pessoas através de seus medos.',
    capabilities: [
      'Possessão através de medos',
      'Manipulação de sombras',
      'Leitura de pensamentos',
      'Invisibilidade em áreas escuras'
    ],
    weaknesses: [
      'Luz intensa causa dano',
      'Símbolos sagrados causam dor',
      'Vulnerável a ataques de energia positiva'
    ],
    
    combatStats: {
      pv: 50,
      pvMax: 50,
      defense: 8,
      attacks: [
        {
          name: 'Sussurro Corrompedor',
          damage: '2d10+5',
          type: 'simbólico',
          description: 'Ataque que causa dano PS'
        },
        {
          name: 'Possessão',
          damage: '1d10',
          type: 'controle',
          description: 'Tenta possuir alvo'
        }
      ]
    },
    
    containmentLevel: 'keter',
    dangerLevel: 'high',
    status: 'to_capture',
    location: 'Centro de São Paulo - Edifício Abandonado',
    containmentProcedures: 'Manter em área iluminada constantemente. Usar símbolos sagrados ao redor. Monitoramento psíquico constante.',
    
    discoveryDate: new Date('2024-01-15'),
    incidents: [
      {
        date: new Date('2024-01-15'),
        description: 'Primeira aparição registrada. Três vítimas possuídas.'
      }
    ],
    
    relatedMissions: [],
    relatedCharacters: [],
    notes: 'Ameaça prioritária. Objetivo da Operação Eclipse.',
    
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-20')
  }
]

export const getThreatById = (id: string): Threat | undefined => {
  return mockThreats.find(threat => threat.id === id)
}

export const getThreatsByCampaign = (campaignId: string): Threat[] => {
  return mockThreats.filter(threat => threat.campaignId === campaignId)
}
