import { Character } from '../types'

export const mockCharacters: Character[] = [
  {
    id: 'char-001',
    campaignId: 'campaign-001',
    playerId: 'user-002',
    
    name: 'Marcus Coleman',
    concept: 'Investigador Implacável',
    origin: 'Detetive de polícia que investigou crime sobrenatural',
    age: 38,
    appearance: 'Homem de 38 anos, cicatriz no rosto, olhos cinzentos, sempre veste preto',
    code: 'TWR-AG-2024-8472',
    rank: 'Agente',
    division: 'DIC',
    status: 'active',
    
    attributes: {
      forca: 3,
      destreza: 3,
      constituicao: 3,
      inteligencia: 4,
      sabedoria: 5,
      carisma: 4,
      poder: 2
    },
    
    statusDerived: {
      pv: 16,
      pvMax: 16,
      ps: 30,
      psMax: 30,
      pe: 10,
      peMax: 10,
      defense: 4,
      initiative: 3
    },
    
    skills: [
      {
        id: 'skill-001',
        name: 'Investigação',
        attribute: 'inteligencia',
        level: 5,
        specializations: [
          {
            id: 'spec-001',
            name: 'Análise de Cenas de Crime',
            level: 1
          }
        ]
      },
      {
        id: 'skill-002',
        name: 'Percepção',
        attribute: 'sabedoria',
        level: 2
      },
      {
        id: 'skill-003',
        name: 'Persuasão',
        attribute: 'carisma',
        level: 1
      }
    ],
    
    advantages: [
      {
        id: 'adv-001',
        name: 'Mente Forte',
        description: 'Vontade de ferro, resistência a controle mental',
        cost: 3,
        mechanicalEffect: '+5 PS, resistência a controle mental'
      }
    ],
    
    disadvantages: [],
    
    labels: {
      power: 'Investigador Implacável',
      weakness: 'Obsessivo até Autodestruição'
    },
    
    innerPlane: {
      name: 'Paz Interior',
      type: 'fruit',
      description: 'Naturalmente calmo, consegue esperar horas, reage lentamente mas bem'
    },
    
    seeds: [],
    powerThemes: [],
    powerCards: [],
    
    equipment: [
      {
        id: 'eq-001',
        name: 'Pistola 9mm Padrão Tower',
        type: 'weapon',
        description: 'Arma padrão da Tower',
        properties: {
          damage: '1d10+2',
          range: 'médio'
        },
        equipped: true
      },
      {
        id: 'eq-002',
        name: 'Terno Preto Discreto',
        type: 'armor',
        description: 'Roupa tática para investigações',
        properties: {
          defense: 1
        },
        equipped: true
      }
    ],
    
    history: 'Detetive de polícia que investigou crime sobrenatural. Viu algo que não podia ser explicado. Tower o recrutou e o treinou. Agora busca proteger inocentes enquanto luta contra o medo de enlouquecer.',
    
    relationships: [
      {
        id: 'rel-001',
        type: 'mentor',
        name: 'Agente Veterano',
        description: 'Agente veterano que me recrutou e ensinou os fundamentos'
      }
    ],
    
    xp: 0,
    xpTotal: 0,
    
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-20'),
    createdBy: 'user-002',
    lastModifiedBy: 'user-002'
  }
]

export const getCharacterById = (id: string): Character | undefined => {
  return mockCharacters.find(char => char.id === id)
}

export const getCharactersByCampaign = (campaignId: string): Character[] => {
  return mockCharacters.filter(char => char.campaignId === campaignId)
}

export const getCharactersByPlayer = (playerId: string): Character[] => {
  return mockCharacters.filter(char => char.playerId === playerId)
}
